'use client';

import React from 'react';

/**
 * Nuper Defense & DeepTech Telemetry Grid Backdrop
 *
 * Anti-Slop Felsefesi:
 * - Rastgele Three.js gezegen küreleri ve bulanık glow orbları kaldırıldı.
 * - Anduril ve Skunkworks telemetri ızgarası: Deterministik koordinat aksları,
 *   derece açıları, mil-spec hedefleme çemberleri ve pürüzsüz taktiksel radar süpürmesi.
 * - %100 CSS & SVG vektör tabanlı, sıfır GPU yükü ve anında açılış.
 */
export const SpaceHero: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#080B11] select-none pointer-events-none">
      {/* İnce Mühendislik Izgarası (Blueprint / Telemetry Grid) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Merkezli Radyal Telemetri Çemberleri */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full border border-white/[0.03] flex items-center justify-center">
        {/* Halka 2 */}
        <div className="w-[820px] h-[820px] rounded-full border border-white/[0.04] border-dashed flex items-center justify-center">
          {/* Halka 3 */}
          <div className="w-[560px] h-[560px] rounded-full border border-white/[0.06] flex items-center justify-center">
            {/* Halka 4 (İç Hedefleme Çemberi) */}
            <div className="w-[320px] h-[320px] rounded-full border border-sky-400/[0.12] border-dashed flex items-center justify-center">
              {/* Merkez Odak Çaprazı */}
              <div className="w-12 h-12 rounded-full border border-sky-400/25 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400/40 animate-ping" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ana Koordinat Eksenleri (Artı İşareti) */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-white/[0.05] to-transparent" />
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

      {/* Taktiksel Radar Süpürme Efekti (GPU Optimized) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full overflow-hidden pointer-events-none opacity-40">
        <div
          className="w-full h-full rounded-full"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, rgba(56, 189, 248, 0.08) 0deg, transparent 60deg, transparent 360deg)',
            animation: 'radar-sweep 12s linear infinite',
          }}
        />
      </div>

      {/* Köşe Telemetri Verileri (Mil-Spec UI Tags) */}
      <div className="absolute top-24 left-8 hidden lg:flex flex-col gap-1 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
        <div className="text-gray-400 font-bold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          NUPER RADAR // SECTOR 01
        </div>
        <div>GRID // LAT 41.0082° N • LON 28.9784° E</div>
        <div>STATUS // ARSENAL OPERATIONAL</div>
      </div>

      <div className="absolute top-24 right-8 hidden lg:flex flex-col items-end gap-1 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
        <div className="text-gray-400 font-bold">FREQUENCY // 9.41 GHz X-BAND</div>
        <div>DEFENSE AI CORE // SYNCHRONIZED</div>
        <div>DOCTRINE // SOVEREIGN BOOTSTRAP</div>
      </div>

      {/* Alt Karartma Gradyanı */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#080B11] via-[#080B11]/80 to-transparent" />

      <style jsx>{`
        @keyframes radar-sweep {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default SpaceHero;
