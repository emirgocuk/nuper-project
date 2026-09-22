'use client';

import React from 'react';
import Link from 'next/link';
import { ArsenalTool } from '@/lib/arsenalData';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface ToolCardProps {
  tool: ArsenalTool;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={`/projects/${tool.slug}`}
      className="block w-full bg-[#0C101A] border border-white/10 hover:border-sky-500/50 hover:bg-[#0E1422] transition-all duration-200 rounded-2xl p-6 sm:p-8 relative overflow-hidden group shadow-lg"
    >
      {/* Taktik Köşe Çentikleri */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/20 group-hover:border-sky-400 transition-colors" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/20 group-hover:border-sky-400 transition-colors" />

      <div className="space-y-6">
        {/* Üst Kısım: Marka Bilgisi ve Tanıtım */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-wider text-sky-400 uppercase px-2.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
              {tool.toolCode}
            </span>
            <span className="text-[10px] font-mono font-bold text-gray-400 px-2.5 py-0.5 rounded bg-white/5 uppercase">
              {tool.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 uppercase">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              OPERASYONEL // BİTMİŞ SİSTEM
            </span>
          </div>

          <div className="pt-1">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight text-white group-hover:text-sky-300 transition-colors uppercase">
              {tool.brandName}
            </h3>
            <span className="text-xs sm:text-sm font-mono text-sky-400/90 block mt-1 font-semibold">
              {tool.tagline}
            </span>
          </div>

          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-4xl">
            {tool.summary}
          </p>
        </div>

        {/* Orta Kısım: 4 Kolonlu Tamamen Okunabilir Taktik Metrik Rozetleri (Yazılar Kesilmez) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/5 group-hover:border-white/10 transition-colors">
            <span className="text-gray-500 block text-[10px] uppercase tracking-wider font-semibold">
              SAHA KAZANCI:
            </span>
            <span className="font-semibold text-emerald-400 block text-xs mt-1 leading-snug">
              {tool.marketValue.roiImpact}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/5 group-hover:border-white/10 transition-colors">
            <span className="text-gray-500 block text-[10px] uppercase tracking-wider font-semibold">
              ENTEGRASYON:
            </span>
            <span className="font-semibold text-gray-200 block text-xs mt-1 leading-snug">
              {tool.marketValue.deploymentTime}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/5 group-hover:border-white/10 transition-colors">
            <span className="text-gray-500 block text-[10px] uppercase tracking-wider font-semibold">
              STANDART:
            </span>
            <span className="font-semibold text-amber-300 block text-xs mt-1 leading-snug">
              {tool.marketValue.compliance}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/5 group-hover:border-white/10 transition-colors">
            <span className="text-gray-500 block text-[10px] uppercase tracking-wider font-semibold">
              GÜVENLİK SINIFI:
            </span>
            <span className="font-semibold text-sky-300 block text-xs mt-1 leading-snug">
              {tool.tier}
            </span>
          </div>
        </div>

        {/* Sağ Alt Alan: Buton Yerine Küçük Mavi Altı Çizili Yazı */}
        <div className="flex justify-end pt-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-sky-400 group-hover:text-sky-300 underline underline-offset-4 decoration-sky-400/60 group-hover:decoration-sky-300 transition-all font-semibold">
            Projeyi İncele
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
