'use client';

import React, { useState } from 'react';
import { ArsenalTool, INITIAL_ARSENAL_TOOLS, ToolCategory } from '@/lib/arsenalData';
import { ToolCard } from './ToolCard';
import { Layers, Filter } from 'lucide-react';

const CATEGORIES: ToolCategory[] = ['TÜMÜ', 'SAVUNMA', 'İMALAT', 'HABERLEŞME'];

export function ArsenalHub() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('TÜMÜ');

  const filteredTools = selectedCategory === 'TÜMÜ'
    ? INITIAL_ARSENAL_TOOLS
    : INITIAL_ARSENAL_TOOLS.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Kategori Filtreleme Çubuğu */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
            FİLTRE:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all min-h-[36px] flex items-center justify-center ${
                selectedCategory === category
                  ? 'bg-sky-500 text-[#080B11] font-bold shadow-md shadow-sky-500/20'
                  : 'bg-[#0C101A] border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Her Satıra Bir Adet Proje Satırı (Single Project Per Row Stack) */}
      <div className="flex flex-col gap-5">
        {filteredTools.length === 0 ? (
          <div className="py-12 text-center bg-[#0C101A] rounded-xl border border-white/10 p-8">
            <Layers className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <h4 className="text-base font-mono font-bold text-white uppercase tracking-wider mb-1">
              BU KATEGORİDE AKTİF SİSTEM BULUNMAMAKTADIR
            </h4>
            <p className="text-xs font-mono text-gray-400">
              Farklı bir kategori seçebilir veya tüm envanteri listeleyebilirsiniz.
            </p>
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
