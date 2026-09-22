import React from 'react';
import Link from 'next/link';
import { NuperLogo } from '@/components/brand/NuperLogo';

export const Footer = () => (
  <footer className="py-10 text-gray-400 bg-[#05070B] border-t border-white/10 font-sans">
    <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Lockup */}
        <div className="flex items-center gap-3">
          <NuperLogo size={22} showText={false} variant="nexus" centerCore="eye" className="text-white" />
          <div className="flex flex-col">
            <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">
              NUPER INDUSTRIES
            </span>
            <span className="text-[10px] font-mono text-gray-500 uppercase">
              SOVEREIGN DEFENSE &amp; DEEP TECHNOLOGY
            </span>
          </div>
        </div>



        {/* Right Legal Links */}
        <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-gray-400">
          <Link href="/about" className="hover:text-white transition-colors">BİZ KİMİZ</Link>
          <Link href="/projects" className="hover:text-white transition-colors">ÇÖZÜMLERİMİZ</Link>
          <Link href="/contact" className="hover:text-white transition-colors">İLETİŞİM</Link>
          <Link href="/legal/privacy" className="hover:text-white transition-colors">GİZLİLİK</Link>
          <Link href="/legal/terms" className="hover:text-white transition-colors">KOŞULLAR</Link>
        </div>
      </div>

      {/* Bottom Sub-row */}
      <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-gray-600">
        <span>&copy; {new Date().getFullYear()} NUPER INDUSTRIES. EGEMEN AZINLIKLAR ÇAĞI. TÜM HAKLARI SAKLIDIR.</span>
      </div>
    </div>
  </footer>
);

