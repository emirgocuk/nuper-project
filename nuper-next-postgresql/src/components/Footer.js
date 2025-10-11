"use client";

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="py-8 mt-16 bg-nuper-dark-blue/50 backdrop-blur-sm">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Logo ve Açıklama */}
          <div>
            <h3 className="mb-4 text-xl font-heading font-bold text-white">Nuper</h3>
            <p className="text-gray-300">
              Geleceğin fikirleri burada şekilleniyor. Projelerini paylaş, etkinlikleri keşfet.
            </p>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h4 className="mb-4 text-lg font-bold text-white">Hızlı Linkler</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/projects" className="text-gray-300 hover:text-white transition">
                  Projeler
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-white transition">
                  Etkinlikler
                </Link>
              </li>
              <li>
                <Link href="/bulletins" className="text-gray-300 hover:text-white transition">
                  Duyurular
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="mb-4 text-lg font-bold text-white">İletişim</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">
                <a href="mailto:info@nuper.com" className="hover:text-white transition">
                  info@nuper.com
                </a>
              </li>
              <li className="text-gray-300">
                <a href="https://twitter.com/nuperapp" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  Twitter
                </a>
              </li>
              <li className="text-gray-300">
                <a href="https://linkedin.com/company/nuper" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="pt-8 mt-8 text-center text-gray-400 border-t border-gray-700">
          <p>&copy; {new Date().getFullYear()} Nuper. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;