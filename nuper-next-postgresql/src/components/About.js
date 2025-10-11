import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link'; // Hatalı satırı bu şekilde düzelttik

// İkonlar için SVG bileşenleri (Heroicons'tan alınmıştır)
const NewspaperIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-nuper-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-6-4h6" />
    </svg>
);
// ... (diğer ikon bileşenleri aynı kalabilir) ...

const About = () => {
    // ... (bileşenin geri kalanı aynı kalabilir) ...
    return (
        <section className="py-20 text-white bg-gray-900">
            <div className="container px-4 mx-auto">
                {/* ... */}
                <div className="mt-12 text-center">
                    <Link href="/projects" className="px-6 py-3 font-bold text-white transition duration-300 rounded-lg bg-nuper-blue hover:bg-blue-700">
                        Projeleri Keşfet
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default About;