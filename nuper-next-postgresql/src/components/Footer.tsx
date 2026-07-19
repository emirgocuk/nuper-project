import React from 'react';
import Link from 'next/link';

export const Footer = () => (
    <footer className="py-8 text-gray-400 bg-[#070b14] border-t border-white/5 font-sans">
        <div className="max-w-6xl px-4 mx-auto text-center sm:px-6 lg:px-8">
            <p className="text-sm">&copy; {new Date().getFullYear()} NUPER INDUSTRIES. Tüm Hakları Saklıdır.</p>
            <div className="flex justify-center mt-4 space-x-6 text-xs">
                <Link href="/legal/privacy" className="transition-colors duration-200 hover:text-white">Gizlilik Politikası</Link>
                <Link href="/legal/terms" className="transition-colors duration-200 hover:text-white">Kullanım Koşulları</Link>
                <Link href="/legal/cookies" className="transition-colors duration-200 hover:text-white">Çerez Politikası</Link>
            </div>
        </div>
    </footer>
);
