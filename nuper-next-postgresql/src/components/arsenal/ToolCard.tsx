'use client';

import React from 'react';
import Link from 'next/link';
import { ArsenalTool } from '@/lib/arsenalData';
import { ArrowRight, CheckCircle2, ShieldCheck, Terminal } from 'lucide-react';
import { CADPattern } from './CADPattern';

interface ToolCardProps {
  tool: ArsenalTool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const theme = tool.theme || {
    primaryColor: 'amber',
    accentHex: '#F59E0B',
    accentGlow: 'rgba(245, 158, 11, 0.16)',
    borderHex: 'rgba(245, 158, 11, 0.40)',
    patternType: 'cad-blueprint',
    badgeLabel: 'MIL-STD-810H SAVUNMA KALİFİKASYONU',
  };

  return (
    <Link
      href={`/projects/${tool.slug}`}
      className="group block w-full bg-[#0B0F19] border border-amber-500/30 hover:border-amber-400/80 transition-all duration-300 rounded-2xl p-6 sm:p-9 relative overflow-hidden shadow-2xl hover:shadow-[0_0_35px_rgba(245,158,11,0.12)]"
      style={{
        borderColor: undefined, // Tailwind handles hover & base
      }}
    >
      {/* 1. Özel CAD Blueprint Arka Plan Deseni */}
      <CADPattern colorHex={theme.accentHex} opacity={0.06} />

      {/* 2. Taktik Amber Köşe Nişangah Çentikleri */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500/60 group-hover:border-amber-400 transition-colors" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500/60 group-hover:border-amber-400 transition-colors" />
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500/40" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500/40" />

      {/* 3. İçerik Katmanı */}
      <div className="relative z-10 space-y-6">
        {/* Üst Şerit: Kod, Standart ve Durum Rozetleri */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-amber-400 uppercase px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30">
              <Terminal className="w-3 h-3 text-amber-400" />
              {tool.toolCode}
            </span>

            <span className="text-[11px] font-mono font-bold text-gray-400 px-2.5 py-1 rounded bg-white/5 uppercase">
              {tool.category}
            </span>

            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 uppercase">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              OPERASYONEL // BİTMİŞ SİSTEM
            </span>

            <span className="text-[10px] font-mono text-gray-500 uppercase px-2 py-0.5 border border-white/5 rounded hidden md:inline-block">
              {theme.badgeLabel}
            </span>
          </div>

          {/* Marka Adı & Başlık */}
          <div className="pt-1">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight text-white group-hover:text-amber-300 transition-colors uppercase">
              {tool.brandName}
            </h3>
            <span className="text-xs sm:text-sm font-mono text-amber-400/90 block mt-1 font-semibold">
              {tool.tagline}
            </span>
          </div>

          {/* Özet Metin (No-AI-Slop: Doğrudan Mühendislik Açıklaması) */}
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-4xl">
            {tool.summary}
          </p>
        </div>

        {/* 4 Kolonlu Metrik Tablosu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 group-hover:border-amber-500/20 transition-colors">
            <span className="text-gray-500 block text-[10px] uppercase tracking-wider font-semibold">
              SAHA KAZANCI:
            </span>
            <span className="font-semibold text-emerald-400 block text-xs mt-1 leading-snug">
              {tool.marketValue.roiImpact}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 group-hover:border-amber-500/20 transition-colors">
            <span className="text-gray-500 block text-[10px] uppercase tracking-wider font-semibold">
              ENTEGRASYON:
            </span>
            <span className="font-semibold text-gray-200 block text-xs mt-1 leading-snug">
              {tool.marketValue.deploymentTime}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 group-hover:border-amber-500/20 transition-colors">
            <span className="text-gray-500 block text-[10px] uppercase tracking-wider font-semibold">
              STANDART:
            </span>
            <span className="font-semibold text-amber-300 block text-xs mt-1 leading-snug">
              {tool.marketValue.compliance}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 group-hover:border-amber-500/20 transition-colors">
            <span className="text-gray-500 block text-[10px] uppercase tracking-wider font-semibold">
              GÜVENLİK SINIFI:
            </span>
            <span className="font-semibold text-sky-300 block text-xs mt-1 leading-snug">
              {tool.tier}
            </span>
          </div>
        </div>

        {/* Temel Yetenekler Şeridi (Pills) */}
        <div className="pt-1 flex flex-wrap gap-2">
          {tool.capabilities.slice(0, 4).map((cap, i) => (
            <span
              key={i}
              className="text-[11px] font-mono text-gray-400 px-2.5 py-1 rounded bg-white/[0.03] border border-white/5"
            >
              • {cap}
            </span>
          ))}
        </div>

        {/* Alt Aksiyon Butonu / Çağrısı */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 text-[11px] font-mono text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>%100 AIR-GAPPED // VERİ SIZINTISI İMKANSIZ</span>
          </div>

          <span className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
            <span>Sistemi ve 3D Modeli İncele</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
