import React from 'react';
import Link from 'next/link';

export const Footer = () => (
    <footer className="py-8 text-white bg-nuper-dark-blue">
        <div className="max-w-6xl px-4 mx-auto text-center sm:px-6 lg:px-8">
            <p className="font-sans text-sm">&copy; {new Date().getFullYear()} Nuper. Tüm Hakları Saklıdır.</p>
            <div className="flex justify-center mt-4 space-x-4">
                <Link href="/legal/privacy" className="transition-colors duration-200 hover:text-nuper-blue">Gizlilik Politikası</Link>
                <Link href="/legal/terms" className="transition-colors duration-200 hover:text-nuper-blue">Kullanım Koşulları</Link>
                <Link href="/legal/cookies" className="transition-colors duration-200 hover:text-nuper-blue">Çerez Politikası</Link>
            </div>
        </div>
    </footer>
);
