"use client";

import React, { useState } from 'react'; // Hatalı satırı düzelttim
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { name: 'Anasayfa', path: '/' },
        { name: 'Projeler', path: '/projects' },
        { name: 'Etkinlikler', path: '/events' },
        { name: 'Hakkında', path: '/about' },
        { name: 'Giriş Yap', path: '/login' },
    ];

    return (
        <nav className="sticky top-0 z-50 shadow-lg bg-gray-800/30 backdrop-blur-md">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-white">
                            Nuper
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="flex items-baseline ml-10 space-x-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                                        pathname === item.path ? 'bg-gray-900 text-white' : ''
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex -mr-2 md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 text-gray-400 bg-gray-800 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        >
                            <span className="sr-only">Open main menu</span>
                            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${
                                    pathname === item.path ? 'bg-gray-900 text-white' : ''
                                }`}
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;