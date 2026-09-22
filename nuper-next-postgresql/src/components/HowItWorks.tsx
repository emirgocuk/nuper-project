'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Terminal, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const DOCTRINE_PILLARS = [
  {
    step: '01',
    code: 'DOCTRINE // VISION',
    icon: <Crosshair className="w-6 h-6 text-sky-400" />,
    title: 'Düş Mühendisliği',
    desc: 'Mevcut endüstriyel kalıpları ve ezberleri aşmak. Kritik sistemik darboğazları saptamak ve birinci prensipler doğrultusunda doğrudan sahaya inen çözümler geliştirmek.',
    tag: 'Birinci Prensipler Metodolojisi',
  },
  {
    step: '02',
    code: 'SYSTEMS // DEEP SOFTWARE',
    icon: <Terminal className="w-6 h-6 text-sky-400" />,
    title: 'Derin Mimari & Kod',
    desc: 'Tavizsiz mühendislik iradesiyle inşa edilen egemen çekirdek. Yüksek uzmanlıkla çalışan çevik ekiplerle deterministik yazılım, hassas algoritmalar ve derin teknoloji sistemleri üretmek.',
    tag: 'Fiziksel AI & Derin Sistemler',
  },
  {
    step: '03',
    code: 'SOVEREIGN // BOOTSTRAP',
    icon: <ShieldCheck className="w-6 h-6 text-sky-400" />,
    title: 'Egemen İcraat',
    desc: 'Dışa bağımlı kalmadan; kendi kaynaklarıyla büyüyen, ürettiği değeri doğrudan sahaya ve yeni nesil teknolojiye dönüştüren bağımsız bir mühendislik ekosistemi.',
    tag: 'Egemen Azınlıklar Doktrini',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="relative bg-[#080B11] border-t border-b border-white/[0.06] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Başlık Grubu */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-mono uppercase tracking-widest bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            ÜRETİM DOKTRİNİ // DÜŞ MÜHENDİSLİĞİ
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white uppercase">
            EGEMEN ÜRETİMİN 3 SACAYAĞI
          </h2>
          <p className="mt-4 text-base text-gray-400 leading-relaxed">
            Yüksek odaklı, çevik ve sahada doğrudan sonuç üreten modern mühendislik prensiplerimiz.
          </p>
        </div>

        {/* 3 Sütunlu Kartlar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DOCTRINE_PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group bg-[#0C101A] border border-white/[0.08] hover:border-sky-500/40 rounded-xl p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
            >
              {/* Arka Plan Hafif Numara */}
              <div className="absolute top-4 right-4 text-5xl font-mono font-black text-white/[0.03] select-none pointer-events-none group-hover:text-sky-500/[0.06] transition-colors">
                {pillar.step}
              </div>

              <div>
                {/* Üst Bilgi Satırı */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
                  <div className="p-3 bg-white/[0.03] border border-white/10 rounded-lg group-hover:border-sky-500/30 transition-colors">
                    {pillar.icon}
                  </div>
                  <span className="text-[11px] font-mono text-gray-500 group-hover:text-sky-400 transition-colors">
                    {pillar.code}
                  </span>
                </div>

                {/* Başlık & Açıklama */}
                <h3 className="text-xl font-bold font-sans text-white mb-3 tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {pillar.desc}
                </p>
              </div>

              {/* Alt Etiket */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-gray-500">
                <span>{pillar.tag}</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Alt Bilgi Bandı */}
        <div className="mt-16 p-6 bg-white/[0.02] border border-white/[0.06] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Düş Mühendisliği Metodolojisini Keşfedin
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              Kitap özetleri, problem çözme yaklaşımları ve vizyonumuz.
            </div>
          </div>
          <Link
            href="/about"
            className="px-5 py-2.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-gray-200 transition-colors shrink-0"
          >
            Biz Kimiz →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
