'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Cpu, Layers, ShieldCheck, Zap } from 'lucide-react';

interface BranchData {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
  subChips: string[];
  mainCoord: { x: number; y: number };
  subCoords: { x: number; y: number; textAnchor: 'start' | 'end' }[];
  mainPath: string;
  subPaths: string[];
  pulseDur: string;
}

const BRANCHES: BranchData[] = [
  // 1. SOL ÜST: DÜŞ MÜHENDİSLİĞİ
  {
    id: 'dus',
    title: 'DÜŞ MÜHENDİSLİĞİ',
    icon: <Sparkles className="w-4 h-4 text-sky-400" />,
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.35)',
    subChips: ['1. Prensipler', 'Darboğaz Keşfi'],
    mainCoord: { x: 140, y: 85 },
    subCoords: [
      { x: 10, y: 40, textAnchor: 'start' },
      { x: 10, y: 130, textAnchor: 'start' },
    ],
    mainPath: 'M 270 210 C 210 210, 190 85, 140 85',
    subPaths: [
      'M 80 85 C 50 85, 45 40, 15 40',
      'M 80 85 C 50 85, 45 130, 15 130',
    ],
    pulseDur: '3.2s',
  },

  // 2. SAĞ ÜST: DERİN MİMARİ
  {
    id: 'kod',
    title: 'DETERMİNİSTİK KOD',
    icon: <Cpu className="w-4 h-4 text-indigo-400" />,
    color: '#818cf8',
    glowColor: 'rgba(129, 140, 248, 0.35)',
    subChips: ['MIL-STD Toleransı', 'Hatasız Yazılım'],
    mainCoord: { x: 400, y: 85 },
    subCoords: [
      { x: 530, y: 40, textAnchor: 'end' },
      { x: 530, y: 130, textAnchor: 'end' },
    ],
    mainPath: 'M 270 210 C 330 210, 350 85, 400 85',
    subPaths: [
      'M 460 85 C 490 85, 495 40, 525 40',
      'M 460 85 C 490 85, 495 130, 525 130',
    ],
    pulseDur: '3.5s',
  },

  // 3. SOL ALT: SENTEZ KÖPRÜSÜ
  {
    id: 'sentez',
    title: 'SENTEZ KÖPRÜSÜ',
    icon: <Layers className="w-4 h-4 text-emerald-400" />,
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.35)',
    subChips: ['Bilgi × Hayalgücü', 'Modüler Cephanelik'],
    mainCoord: { x: 140, y: 335 },
    subCoords: [
      { x: 10, y: 290, textAnchor: 'start' },
      { x: 10, y: 380, textAnchor: 'start' },
    ],
    mainPath: 'M 270 210 C 210 210, 190 335, 140 335',
    subPaths: [
      'M 80 335 C 50 335, 45 290, 15 290',
      'M 80 335 C 50 335, 45 380, 15 380',
    ],
    pulseDur: '3.8s',
  },

  // 4. SAĞ ALT: EGEMEN İCRAAT
  {
    id: 'icraat',
    title: 'EGEMEN İCRAAT',
    icon: <ShieldCheck className="w-4 h-4 text-amber-400" />,
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.35)',
    subChips: ['Saha Doğrulaması', 'Mission Verified'],
    mainCoord: { x: 400, y: 335 },
    subCoords: [
      { x: 530, y: 290, textAnchor: 'end' },
      { x: 530, y: 380, textAnchor: 'end' },
    ],
    mainPath: 'M 270 210 C 330 210, 350 335, 400 335',
    subPaths: [
      'M 460 335 C 490 335, 495 290, 525 290',
      'M 460 335 C 490 335, 495 380, 525 380',
    ],
    pulseDur: '3.4s',
  },
];

export const PhilosophyMindMap: React.FC = () => {
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);

  return (
    <div className="w-full max-w-[560px] mx-auto lg:ml-auto relative select-none flex items-center justify-center py-2">
      {/* Arka Plan Ambient Parlama */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* Ana Zihin Haritası SVG Çizimi */}
      <svg
        viewBox="0 0 540 420"
        className="w-full h-auto overflow-visible drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]"
      >
        <defs>
          {/* Işıltı Filtresi */}
          <filter id="xmind-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="core-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Dinamik Radyal ve Çizgisel Gradyanlar */}
          <radialGradient id="core-rad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0c192c" />
            <stop offset="70%" stopColor="#080e1a" />
            <stop offset="100%" stopColor="#030712" />
          </radialGradient>
        </defs>

        {/* 1. DALLANMA HATLARI (ORGANIC XMIND BEZIER CURVES) */}
        {BRANCHES.map((b) => {
          const isHovered = hoveredBranch === b.id;
          const isOtherHovered = hoveredBranch !== null && !isHovered;

          return (
            <g
              key={`lines-${b.id}`}
              className="transition-opacity duration-300"
              opacity={isOtherHovered ? 0.3 : 1}
            >
              {/* Ana Gövde Dalı (Merkez -> Ana Düğüm) */}
              <path
                d={b.mainPath}
                fill="none"
                stroke={b.color}
                strokeWidth={isHovered ? '3.5' : '2.5'}
                strokeOpacity={isHovered ? '1' : '0.65'}
                filter={isHovered ? 'url(#xmind-glow)' : undefined}
                className="transition-all duration-300"
              />

              {/* Alt Filiz Dalları (Ana Düğüm -> Alt Çipler) */}
              {b.subPaths.map((p, idx) => (
                <path
                  key={`subpath-${b.id}-${idx}`}
                  d={p}
                  fill="none"
                  stroke={b.color}
                  strokeWidth={isHovered ? '2' : '1.5'}
                  strokeOpacity={isHovered ? '0.9' : '0.45'}
                  strokeDasharray={isHovered ? 'none' : '3 2'}
                  className="transition-all duration-300"
                />
              ))}

              {/* Dal Üzerinde Sürekli Akan Işık Parçacığı (Energy Pulse) */}
              <circle r={isHovered ? '3.5' : '2.5'} fill={b.color} filter="url(#xmind-glow)">
                <animateMotion
                  dur={b.pulseDur}
                  repeatCount="indefinite"
                  path={b.mainPath}
                />
              </circle>
            </g>
          );
        })}

        {/* 2. ALT FİLİZ ÇİPLERİ (SUB-TOPICS) */}
        {BRANCHES.map((b) => {
          const isHovered = hoveredBranch === b.id;
          const isOtherHovered = hoveredBranch !== null && !isHovered;

          return (
            <g
              key={`subchips-${b.id}`}
              className="transition-opacity duration-300"
              opacity={isOtherHovered ? 0.3 : 1}
              onMouseEnter={() => setHoveredBranch(b.id)}
              onMouseLeave={() => setHoveredBranch(null)}
            >
              {b.subChips.map((chip, idx) => {
                const coord = b.subCoords[idx];
                const isLeft = coord.textAnchor === 'start';
                const rectX = isLeft ? coord.x : coord.x - 120;

                return (
                  <g
                    key={`chip-${b.id}-${idx}`}
                    className="cursor-pointer transition-transform duration-200 hover:scale-105"
                  >
                    {/* Çip Arka Planı */}
                    <rect
                      x={rectX}
                      y={coord.y - 14}
                      width="120"
                      height="28"
                      rx="8"
                      fill="#0C101A"
                      stroke={b.color}
                      strokeWidth={isHovered ? '2' : '1.2'}
                      strokeOpacity={isHovered ? '1' : '0.6'}
                      filter={isHovered ? 'url(#xmind-glow)' : undefined}
                    />
                    {/* Çip Metni */}
                    <text
                      x={isLeft ? rectX + 60 : rectX + 60}
                      y={coord.y + 4}
                      fill={isHovered ? '#ffffff' : '#f1f5f9'}
                      fontSize="11"
                      fontWeight="700"
                      fontFamily="system-ui, sans-serif"
                      textAnchor="middle"
                      className="select-none tracking-wide"
                    >
                      {chip}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* 3. ANA DALLANMA DÜĞÜMLERİ (PRIMARY BRANCH CARDS) */}
        {BRANCHES.map((b) => {
          const isHovered = hoveredBranch === b.id;
          const isOtherHovered = hoveredBranch !== null && !isHovered;
          const cardW = 140;
          const cardH = 40;
          const cardX = b.mainCoord.x - cardW / 2;
          const cardY = b.mainCoord.y - cardH / 2;

          return (
            <g
              key={`node-${b.id}`}
              className="cursor-pointer transition-all duration-300"
              opacity={isOtherHovered ? 0.35 : 1}
              onMouseEnter={() => setHoveredBranch(b.id)}
              onMouseLeave={() => setHoveredBranch(null)}
            >
              {/* Kart Arka Planı */}
              <rect
                x={cardX}
                y={cardY}
                width={cardW}
                height={cardH}
                rx="10"
                fill="#0A0E17"
                stroke={b.color}
                strokeWidth={isHovered ? '2.5' : '1.5'}
                filter={isHovered ? 'url(#xmind-glow)' : undefined}
                className="transition-all duration-200"
              />

              {/* Sol Vurgu Çubuğu */}
              <rect
                x={cardX}
                y={cardY + 6}
                width="3.5"
                height={cardH - 12}
                rx="2"
                fill={b.color}
              />

              {/* Düğüm Metni */}
              <text
                x={cardX + 14}
                y={cardY + 24}
                fill="#ffffff"
                fontSize="11"
                fontWeight="800"
                fontFamily="system-ui, monospace"
                letterSpacing="0.5"
              >
                {b.title}
              </text>
            </g>
          );
        })}

        {/* 4. MERKEZİ DÜŞ MÜHENDİSLİĞİ ÇEKİRDEĞİ (ROOT NUCLEUS) */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setHoveredBranch(null)}
        >
          {/* Dış Radar Halkaları */}
          <circle
            cx="270"
            cy="210"
            r="60"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1"
            strokeOpacity="0.15"
            strokeDasharray="4 4"
            className="animate-spin"
            style={{ animationDuration: '30s' }}
          />
          <circle
            cx="270"
            cy="210"
            r="52"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />

          {/* Çekirdek Gövdesi */}
          <circle
            cx="270"
            cy="210"
            r="44"
            fill="url(#core-rad)"
            stroke="#38bdf8"
            strokeWidth="2.5"
            filter="url(#core-glow)"
          />

          {/* İç Çember */}
          <circle
            cx="270"
            cy="210"
            r="36"
            fill="#080E1A"
            stroke="#ffffff"
            strokeOpacity="0.1"
          />

          {/* Çekirdek İkonu */}
          <g transform="translate(262, 184)">
            <Zap className="w-4 h-4 text-sky-400" />
          </g>

          {/* Çekirdek Metinleri */}
          <text
            x="270"
            y="214"
            fill="#ffffff"
            fontSize="14"
            fontWeight="900"
            fontFamily="system-ui, sans-serif"
            textAnchor="middle"
            letterSpacing="2"
          >
            NUPER
          </text>
          <text
            x="270"
            y="228"
            fill="#38bdf8"
            fontSize="7"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
            letterSpacing="1"
          >
            DÜŞ MÜHENDİSLİĞİ
          </text>
        </g>
      </svg>
    </div>
  );
};

export default PhilosophyMindMap;
