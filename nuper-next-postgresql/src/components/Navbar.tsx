'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';


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
                        <Link href="/projects" className={cn("font-sans py-2", linkHoverClass)}>Projeler</Link>

                        {session ? (
                            <Link href="/dashboard" className={cn("px-4 py-2 font-sans border rounded-lg", isHomePage ? "border-white/50 bg-white/20 hover:bg-white/30" : "border-nuper-blue bg-nuper-blue text-white hover:bg-nuper-dark-blue")}>
                                Profil
                            </Link>
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
                                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 rounded-md text-base font-medium", mobileLinkClass)}>Profilim</Link>
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
