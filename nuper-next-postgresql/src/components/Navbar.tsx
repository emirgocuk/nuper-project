'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, FileText, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from '@/actions/auth';
import { Button } from "@/components/ui/button";

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    // Check if we are on the home page for specific styling
    const isHomePage = pathname === '/';

    const navClasses = isHomePage
        ? 'bg-nuper-dark-blue/50 backdrop-blur-sm text-white'
        : 'bg-white/90 backdrop-blur-sm shadow-md text-nuper-blue';

    const linkHoverClass = isHomePage ? 'hover:text-nuper-gray' : 'hover:text-nuper-dark-blue';
    const mobileMenuBgClass = isHomePage ? 'bg-nuper-dark-blue' : 'bg-white';
    const mobileLinkClass = isHomePage ? 'text-white hover:bg-nuper-blue' : 'text-nuper-blue hover:bg-gray-100';

    const userRole = (session?.user as any)?.role;

    return (
        <nav className={cn("fixed top-0 w-full z-50 transition-colors duration-300", navClasses)}>
            <div className="flex items-center justify-between max-w-6xl px-4 py-4 mx-auto">
                <Link href="/">
                    <h1 className={cn("text-2xl font-bold cursor-pointer font-heading")}>Nuper</h1>
                </Link>
                <div className="flex items-center space-x-4">
                    <div className="items-center hidden space-x-5 md:flex">
                        <Link href="/" className={cn("font-sans py-2", linkHoverClass)}>Ana Sayfa</Link>
                        <Link href="/about" className={cn("font-sans py-2", linkHoverClass)}>Hakkımızda</Link>
                        <Link href="/events" className={cn("font-sans py-2", linkHoverClass)}>Etkinlikler</Link>
                        <Link href="/bulletins" className={cn("font-sans py-2", linkHoverClass)}>Bültenler</Link>
                        <Link href="/projects" className={cn("font-sans py-2", linkHoverClass)}>Projeler</Link>

                        {session ? (
                            <div className="flex items-center gap-4">
                                {userRole === 'ADMIN' && (
                                    <Link href="/admin" className={cn("px-4 py-2 font-sans border rounded-lg transition-colors", isHomePage ? "border-white/50 bg-white/20 hover:bg-white/30" : "border-nuper-blue bg-nuper-blue text-white hover:bg-nuper-dark-blue")}>
                                        Admin Paneli
                                    </Link>
                                )}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-gray-200">
                                            <Avatar className="h-full w-full">
                                                <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                                                <AvatarFallback className="bg-nuper-blue text-white">
                                                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {session.user?.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="cursor-pointer">
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Profilim</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/my-projects" className="cursor-pointer">
                                                <FolderOpen className="mr-2 h-4 w-4" />
                                                <span>Proje Başvurularım</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => logout()} className="text-red-600 focus:text-red-600 cursor-pointer">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Çıkış Yap</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <Link href="/login" className={cn("px-4 py-2 font-sans border rounded-lg", isHomePage ? "border-white/50 bg-white/20 hover:bg-white/30" : "bg-nuper-blue text-white hover:bg-nuper-dark-blue")}>
                                Giriş Yap
                            </Link>
                        )}
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
                            {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                        </button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={cn("md:hidden py-2 px-4 shadow-lg", mobileMenuBgClass)}
                    >
                        <nav className="flex flex-col space-y-2">
                            <Link href="/" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 rounded-md text-base font-medium", mobileLinkClass)}>Ana Sayfa</Link>
                            <Link href="/about" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 rounded-md text-base font-medium", mobileLinkClass)}>Hakkımızda</Link>
                            <Link href="/events" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 rounded-md text-base font-medium", mobileLinkClass)}>Etkinlikler</Link>
                            <Link href="/bulletins" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 rounded-md text-base font-medium", mobileLinkClass)}>Bültenler</Link>
                            <Link href="/projects" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 rounded-md text-base font-medium", mobileLinkClass)}>Projeler</Link>
                            {session ? (
                                <>
                                    {userRole === 'ADMIN' && (
                                        <Link href="/admin" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 rounded-md text-base font-medium text-purple-600 font-bold", mobileLinkClass)}>Admin Paneli</Link>
                                    )}
                                    <Link href="/profile" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 rounded-md text-base font-medium", mobileLinkClass)}>Profilim</Link>
                                    <Link href="/my-projects" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 rounded-md text-base font-medium", mobileLinkClass)}>Proje Başvurularım</Link>
                                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className={cn("block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500", mobileLinkClass)}>Çıkış Yap</button>
                                </>
                            ) : (
                                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-white rounded-lg bg-nuper-blue hover:bg-nuper-dark-blue font-sans text-left">Giriş Yap</Link>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
