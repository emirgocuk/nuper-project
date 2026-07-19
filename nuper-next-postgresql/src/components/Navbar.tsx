'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, FolderOpen, Shield } from 'lucide-react';
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
import { Button } from "@/components/ui/button";

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    // Premium deep space themed navbar for all pages
    const navClasses = 'bg-[#0b1120]/75 backdrop-blur-lg border-b border-white/5 text-white';
    const linkHoverClass = 'hover:text-blue-400 text-gray-300 transition-colors duration-200';
    const mobileMenuBgClass = 'bg-[#0b1120]/95 border-b border-white/10';
    const mobileLinkClass = 'text-gray-300 hover:text-white hover:bg-white/5';

    const userRole = (session?.user as any)?.role;

    return (
        <nav className={cn("fixed top-0 w-full z-50 transition-all duration-300 pr-[var(--removed-body-scroll-bar-size)]", navClasses)}>
            <div className="flex items-center justify-between max-w-6xl px-4 py-4 mx-auto font-sans">
                <Link href="/">
                    <h1 className="text-xl font-bold cursor-pointer font-heading tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-200 to-white">
                        NUPER INDUSTRIES
                    </h1>
                </Link>
                <div className="flex items-center space-x-4">
                    <div className="items-center hidden space-x-6 md:flex">
                        <Link href="/" className={cn("font-medium text-sm py-2", linkHoverClass)}>Ana Sayfa</Link>
                        <Link href="/about" className={cn("font-medium text-sm py-2", linkHoverClass)}>Hakkımızda</Link>
                        <Link href="/projects" className={cn("font-medium text-sm py-2", linkHoverClass)}>Projeler</Link>
                        <Link href="/ideas" className={cn("font-medium text-sm py-2", linkHoverClass)}>Fikirler</Link>
                        <Link href="/bulletins" className={cn("font-medium text-sm py-2", linkHoverClass)}>Bültenler</Link>
                        <Link href="/events" className={cn("font-medium text-sm py-2", linkHoverClass)}>Etkinlikler</Link>

                        {session ? (
                            <div className="flex items-center gap-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-white/10 hover:bg-white/5">
                                            <Avatar className="h-full w-full">
                                                <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                                                <AvatarFallback className="bg-blue-600 text-white font-bold">
                                                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56 bg-[#0b1120] border border-white/10 text-white" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none text-white">{session.user?.name}</p>
                                                <p className="text-xs leading-none text-gray-400 mt-1">
                                                    {session.user?.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-white/10" />
                                        {userRole === 'ADMIN' && (
                                            <>
                                                <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-blue-300">
                                                    <Link href="/admin" className="cursor-pointer flex items-center">
                                                        <Shield className="mr-2 h-4 w-4 text-blue-400" />
                                                        <span className="font-semibold text-blue-400">Yönetim Paneli</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-white/10" />
                                            </>
                                        )}
                                        <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white">
                                            <Link href="/profile" className="cursor-pointer flex items-center">
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Profilim</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-white/10" />
                                        <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="text-red-400 focus:text-red-300 focus:bg-white/5 cursor-pointer flex items-center">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Çıkış Yap</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : null}
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none text-white hover:text-blue-400">
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                        className={cn("md:hidden py-4 px-4 shadow-lg", mobileMenuBgClass)}
                    >
                        <nav className="flex flex-col space-y-3">
                            <Link href="/" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 rounded-lg text-base font-medium transition-colors", mobileLinkClass)}>Ana Sayfa</Link>
                            <Link href="/about" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 rounded-lg text-base font-medium transition-colors", mobileLinkClass)}>Hakkımızda</Link>
                            <Link href="/projects" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 rounded-lg text-base font-medium transition-colors", mobileLinkClass)}>Projeler</Link>
                            <Link href="/ideas" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 rounded-lg text-base font-medium transition-colors", mobileLinkClass)}>Fikirler</Link>
                            <Link href="/bulletins" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 rounded-lg text-base font-medium transition-colors", mobileLinkClass)}>Bültenler</Link>
                            <Link href="/events" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 rounded-lg text-base font-medium transition-colors", mobileLinkClass)}>Etkinlikler</Link>
                            {session ? (
                                <>
                                    <div className="h-px bg-white/10 my-2" />
                                    {userRole === 'ADMIN' && (
                                        <Link href="/admin" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 rounded-lg text-base font-semibold text-blue-400 transition-colors", mobileLinkClass)}>Yönetim Paneli</Link>
                                    )}
                                    <Link href="/profile" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 rounded-lg text-base font-medium transition-colors", mobileLinkClass)}>Profilim</Link>
                                    <button onClick={() => { signOut({ callbackUrl: '/' }); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:bg-white/5 transition-colors">Çıkış Yap</button>
                                </>
                            ) : null}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
