'use client';

import React from 'react';

interface CADPatternProps {
  colorHex?: string;
  opacity?: number;
  className?: string;
}

export function CADPattern({
  colorHex = '#F59E0B',
  opacity = 0.07,
  className = '',
}: CADPatternProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}>
      {/* 1. Hassas Koordinat Izgarası (SVG Pattern) */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* İnce Kılavuz Kareler (32px) */}
          <pattern
            id="cad-grid-fine"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke={colorHex}
              strokeWidth="0.5"
              strokeOpacity={opacity * 0.7}
            />
          </pattern>

          {/* Ana Mühendislik Izgarası (128px) ve Artı Nişangahlar (+) */}
          <pattern
            id="cad-grid-major"
            width="128"
            height="128"
            patternUnits="userSpaceOnUse"
          >
            <rect width="128" height="128" fill="url(#cad-grid-fine)" />
            <path
              d="M 128 0 L 0 0 0 128"
              fill="none"
              stroke={colorHex}
              strokeWidth="0.8"
              strokeOpacity={opacity * 1.5}
            />
            {/* Merkez Nişangah (+) */}
            <path
              d="M 64 58 L 64 70 M 58 64 L 70 64"
              stroke={colorHex}
              strokeWidth="1"
              strokeOpacity={opacity * 2.5}
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#cad-grid-major)" />
      </svg>

      {/* 2. Sağ Arka Plan: Aviyonik Braket CAD Tel Kafes (Wireframe) İzometrik Projeksiyonu */}
      <svg
        className="absolute right-[-40px] -top-6 w-[420px] h-[320px] opacity-15 transition-opacity duration-300 group-hover:opacity-30"
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Parça Dış Konturu */}
        <polygon
          points="80,180 240,90 340,140 180,230"
          stroke={colorHex}
          strokeWidth="1.2"
          strokeDasharray="4 2"
        />
        <polygon
          points="80,130 240,40 340,90 180,180"
          stroke={colorHex}
          strokeWidth="1.5"
        />
        {/* Düşey Köşe Kenarları */}
        <line x1="80" y1="130" x2="80" y2="180" stroke={colorHex} strokeWidth="1.5" />
        <line x1="240" y1="40" x2="240" y2="90" stroke={colorHex} strokeWidth="1.2" />
        <line x1="340" y1="90" x2="340" y2="140" stroke={colorHex} strokeWidth="1.5" />
        <line x1="180" y1="180" x2="180" y2="230" stroke={colorHex} strokeWidth="1.5" />

        {/* İç Montaj Delikleri (Elips) */}
        <ellipse cx="140" cy="140" rx="14" ry="8" stroke={colorHex} strokeWidth="1.2" />
        <ellipse cx="280" cy="90" rx="14" ry="8" stroke={colorHex} strokeWidth="1.2" />
        <ellipse cx="200" cy="115" rx="20" ry="11" stroke={colorHex} strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Eksen ve Tolerans Çizgileri */}
        <line x1="50" y1="130" x2="370" y2="130" stroke={colorHex} strokeWidth="0.5" strokeDasharray="6 4" strokeOpacity="0.6" />
        <line x1="200" y1="20" x2="200" y2="250" stroke={colorHex} strokeWidth="0.5" strokeDasharray="6 4" strokeOpacity="0.6" />
        
        {/* Tolerans Notu */}
        <text x="210" y="35" fill={colorHex} fontSize="9" fontFamily="monospace" opacity="0.8">
          TOL: ±0.01mm // AS9100-D
        </text>
        <text x="210" y="48" fill={colorHex} fontSize="8" fontFamily="monospace" opacity="0.6">
          DIN 912 M4 PRELOAD: 4.8kN
        </text>
      </svg>

      {/* 3. Taktik Fiduzyal İşaretleri (Köşe Hedefleme Çentikleri) */}
      <div className="absolute top-2 left-2 text-[9px] font-mono tracking-widest uppercase opacity-40 group-hover:opacity-75 transition-opacity" style={{ color: colorHex }}>
        [ ⌖ ] GRID: METRIC 32mm
      </div>
      <div className="absolute bottom-2 right-4 text-[9px] font-mono tracking-wider opacity-40 group-hover:opacity-75 transition-opacity" style={{ color: colorHex }}>
        B-REP OPENCASCADE // D-01
      </div>
    </div>
  );
}
