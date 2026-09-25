'use client';

import React, { useState } from 'react';
import { ArsenalTool, INITIAL_ARSENAL_TOOLS, ToolCategory } from '@/lib/arsenalData';
import { ToolCard } from './ToolCard';
import { Layers, Filter, Terminal } from 'lucide-react';

const CATEGORIES: ToolCategory[] = ['TÜMÜ', 'SAVUNMA', 'SİMÜLASYON'];

export function ArsenalHub() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('TÜMÜ');

  const filteredTools = selectedCategory === 'TÜMÜ'
    ? INITIAL_ARSENAL_TOOLS
    : INITIAL_ARSENAL_TOOLS.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Kategori Filtreleme Çubuğu & Durum Bilgisi */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
              PROGRAM FİLTRESİ:
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all min-h-[36px] flex items-center justify-center ${
                  selectedCategory === category
                    ? 'bg-amber-500 text-[#080B11] font-bold shadow-md shadow-amber-500/20'
                    : 'bg-[#0C101A] border border-white/10 text-gray-400 hover:text-white hover:border-amber-500/40'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="inline-flex items-center gap-2 text-[11px] font-mono text-gray-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{filteredTools.length} OPERASYONEL SİSTEM DEVREDE</span>
        </div>
      </div>

      {/* Program Kartları Listesi */}
      <div className="flex flex-col gap-6">
        {filteredTools.length === 0 ? (
          <div className="py-16 text-center bg-[#0C101A] rounded-2xl border border-white/10 p-8 space-y-4">
            <Layers className="w-10 h-10 text-gray-600 mx-auto" />
            <h4 className="text-base font-mono font-bold text-white uppercase tracking-wider">
              BU KATEGORİDE YAYINLANMIŞ AÇIK SİSTEM BULUNMAMAKTADIR
            </h4>
            <p className="text-xs font-mono text-gray-400 max-w-md mx-auto">
              Diğer sistemlerimiz kapalı devre test ortamında kalifikasyon aşamasındadır. Aktif çözümümüzü görüntülemek için filtreyi sıfırlayabilirsiniz.
            </p>
            <button
              onClick={() => setSelectedCategory('TÜMÜ')}
              className="px-4 py-2 rounded-lg bg-amber-500 text-black font-mono text-xs font-bold uppercase hover:bg-amber-400 transition-colors"
            >
              Tüm Envanteri Göster
            </button>
          </div>
        ) : (
          filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
            />
          ))
        )}
      </div>
    </div>
  );
}
