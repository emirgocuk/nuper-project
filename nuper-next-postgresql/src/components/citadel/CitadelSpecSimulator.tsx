'use client';

import React, { useState } from 'react';
import { Sliders, Shield, Zap, FileCode, CheckCircle2, AlertTriangle, ArrowRight, Copy, Check } from 'lucide-react';

interface PlatformProfile {
  id: string;
  name: string;
  code: string;
  fMin: number;
  fMax: number;
  w0: number; // g^2/Hz
  gRms: number;
  shockG?: number;
  shockDurationMs?: number;
  description: string;
}

interface MaterialSpec {
  id: string;
  name: string;
  density: number; // kg/m^3
  yieldMpa: number; // MPa
  elasticGpa: number; // GPa
}

const PLATFORMS: PlatformProfile[] = [
  {
    id: 'f16-wing',
    name: 'F-16 Kanat Altı Pod Titreşimi',
    code: 'MIL-STD-810H Metot 514.8 Kategori 14',
    fMin: 15,
    fMax: 2000,
    w0: 0.04,
    gRms: 7.7,
    description: 'Süpersonik jet harici pod montajı için geniş bant rastgele (random) titreşim profili.',
  },
  {
    id: 'armored-vehicle',
    name: 'Paletli Zırhlı Muharebe Aracı',
    code: 'MIL-STD-810H Metot 514.8 Kategori 20',
    fMin: 5,
    fMax: 500,
    w0: 0.01,
    gRms: 3.8,
    description: 'Ağır zırhlı palet gövdesine entegre aviyonik şasi için düşük frekanslı şok/titreşim profili.',
  },
  {
    id: 'functional-shock',
    name: 'Fonksiyonel Şok (Testere Dişi)',
    code: 'MIL-STD-810H Metot 516.8 Prosedür I',
    fMin: 10,
    fMax: 2000,
    w0: 0.02,
    gRms: 6.2,
    shockG: 40,
    shockDurationMs: 11,
    description: 'Acil durum iniş ve patlama sonrası aviyonik tutucunun yapısal bütünlük testi.',
  },
  {
    id: 'do160-helo',
    name: 'Taktik Helikopter Titreşim Profili',
    code: 'RTCA DO-160G Bölüm 8 Kategori S',
    fMin: 10,
    fMax: 2000,
    w0: 0.025,
    gRms: 5.4,
    description: 'Rotor pallerinden kaynaklanan harmonik piklerle zenginleştirilmiş sivil/askeri havacılık standardı.',
  },
];

const MATERIALS: MaterialSpec[] = [
  {
    id: 'al-6061',
    name: 'Alüminyum 6061-T6',
    density: 2700,
    yieldMpa: 276,
    elasticGpa: 68.9,
  },
  {
    id: 'ti-6al4v',
    name: 'Titanyum Ti-6Al-4V Gr 5',
    density: 4430,
    yieldMpa: 880,
    elasticGpa: 113.8,
  },
  {
    id: 'ss-174ph',
    name: 'Paslanmaz Çelik 17-4 PH H1150',
    density: 7800,
    yieldMpa: 724,
    elasticGpa: 196.0,
  },
];

export function CitadelSpecSimulator() {
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>('f16-wing');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('al-6061');
  const [showApdl, setShowApdl] = useState<boolean>(false);
  const [copiedApdl, setCopiedApdl] = useState<boolean>(false);

  const platform = PLATFORMS.find((p) => p.id === selectedPlatformId) || PLATFORMS[0];
  const material = MATERIALS.find((m) => m.id === selectedMaterialId) || MATERIALS[0];

  // Deterministik Matematiksel Çıkarsamalar
  const volumeMm3 = 142590; // Sabit parça hacmi
  const massKg = Number(((volumeMm3 * 1e-9) * material.density).toFixed(3));
  const targetResonanceFreqHz = Math.round(platform.fMax * 1.2); // f_1 > 1.2 * f_max
  const boltPreloadKn = Number(((material.yieldMpa * 0.9 * 8.78) / 1000).toFixed(1)); // M4 cıvata gerilme alanı As=8.78 mm2
  const tighteningTorqueNm = Number((0.2 * 4 * (boltPreloadKn / 10)).toFixed(2)); // MA = k * d * F_M

  // APDL Kodu Şablonu
  const apdlCode = `! NUPER CITADEL - ANSYS MECHANICAL APDL PRE-FEA REÇETESİ
! STANDART: ${platform.code}
! MALZEME: ${material.name} (E=${material.elasticGpa} GPa, DENS=${material.density} kg/m3)
/PREP7
MP,EX,1,${material.elasticGpa}E9
MP,DENS,1,${material.density}
MP,PRXY,1,0.33

! REZONANS KAÇINMA EŞİĞİ
! f_1_target >= ${targetResonanceFreqHz} Hz (f_max * 1.2)
ANTYPE,MODAL
MODOPT,LANB,10,1,${targetResonanceFreqHz * 1.5}
SOLVE

! SPEKTRUM ANALİZİ (PSD TABLOSU)
ANTYPE,SPECTR
SPOPT,PSD,1,1
PSDUNIT,1,ACCG,9.81
PSDFRQ,1,1,${platform.fMin},${platform.fMax}
PSDVAL,1,${platform.w0},${platform.w0}
DMPRAT,0.05 ! SÖNÜMLEME ORANI (Q=10)
SOLVE
FINISH`;

  const handleCopyApdl = () => {
    navigator.clipboard.writeText(apdlCode);
    setCopiedApdl(true);
    setTimeout(() => setCopiedApdl(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#090D16] border border-amber-500/30 space-y-8 font-sans shadow-2xl relative overflow-hidden">
      {/* Taktik Üst Başlık */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>İNTERAKTİF ŞARTNAME &amp; KALİFİKASYON SİMÜLATÖRÜ</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-white uppercase">
            Platform ve Malzeme Seçimi
          </h3>
        </div>

        <span className="text-[11px] font-mono text-gray-400 px-3 py-1 rounded bg-black/50 border border-white/10">
          CANLI DETERMINISTIK HESAPLAMA MOTORU
        </span>
      </div>

      {/* 2 Kolonlu Seçici Konsol */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sol: Platform Seçimi */}
        <div className="space-y-3 font-mono text-xs">
          <label className="text-gray-400 uppercase tracking-wider block font-bold text-[11px]">
            01 // ASKERİ GÖREV PROFİLİ (STANDART SEÇİMİ):
          </label>
          <div className="space-y-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlatformId(p.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  selectedPlatformId === p.id
                    ? 'bg-amber-500/10 border-amber-500/70 text-white shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                    : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{p.name}</span>
                  <span className="text-[10px] text-amber-400 font-semibold">{p.gRms} g_rms</span>
                </div>
                <span className="text-[10px] text-gray-500 block mt-1">{p.code}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sağ: Malzeme Seçimi */}
        <div className="space-y-3 font-mono text-xs">
          <label className="text-gray-400 uppercase tracking-wider block font-bold text-[11px]">
            02 // PARÇA HAMMADDE &amp; METALURJİ:
          </label>
          <div className="space-y-2">
            {MATERIALS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMaterialId(m.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  selectedMaterialId === m.id
                    ? 'bg-amber-500/10 border-amber-500/70 text-white shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                    : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{m.name}</span>
                  <span className="text-[10px] text-amber-400 font-semibold">{m.yieldMpa} MPa Akma</span>
                </div>
                <div className="flex gap-4 text-[10px] text-gray-500 mt-1">
                  <span>Yoğunluk: {m.density} kg/m³</span>
                  <span>Elastisite: {m.elasticGpa} GPa</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Deterministik Hesaplanan Canlı Sonuç Matrisi */}
      <div className="space-y-4 pt-4 border-t border-white/10 font-mono">
        <span className="text-xs text-amber-400 uppercase tracking-widest font-bold block">
          03 // ANLIK TÜRETİLEN PRE-FEA VE KALİFİKASYON PARAMETRELERİ
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* 1. Rezonans Kaçınma */}
          <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
              HEDEF 1. MOD FREKANSI:
            </span>
            <span className="text-base font-bold text-amber-400 block">
              f₁ ≥ {targetResonanceFreqHz} Hz
            </span>
            <span className="text-[10px] text-gray-400 block">
              f_max × 1.2 Kaçınma Kriteri
            </span>
          </div>

          {/* 2. Parça Net Kütlesi */}
          <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
              HESAPLANAN NET KÜTLE:
            </span>
            <span className="text-base font-bold text-emerald-400 block">
              {massKg} kg
            </span>
            <span className="text-[10px] text-gray-400 block">
              V = 142.590 mm³ B-Rep Hacmi
            </span>
          </div>

          {/* 3. DIN 912 Ön Yük */}
          <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
              M4 CIVATA ÖN YÜKÜ (FM):
            </span>
            <span className="text-base font-bold text-white block">
              {boltPreloadKn} kN
            </span>
            <span className="text-[10px] text-gray-400 block">
              Tork: {tighteningTorqueNm} N·m (DIN 912)
            </span>
          </div>

          {/* 4. Titreşim İvme Seviyesi */}
          <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
              GENEL TİTREŞİM (G_RMS):
            </span>
            <span className="text-base font-bold text-sky-400 block">
              {platform.gRms} g_rms
            </span>
            <span className="text-[10px] text-gray-400 block">
              {platform.fMin} - {platform.fMax} Hz Aralığı
            </span>
          </div>
        </div>

        {/* Canlı SVG Titreşim PSD Spektrum Eğrisi */}
        <div className="p-5 rounded-xl bg-black/60 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300 font-bold">
              TİTREŞİM İVME SPEKTRAL YOĞUNLUĞU (PSD EĞRİSİ)
            </span>
            <span className="text-amber-400 text-[11px]">
              W₀ = {platform.w0} g²/Hz
            </span>
          </div>

          {/* SVG Grafik */}
          <div className="w-full h-28 relative">
            <svg className="w-full h-full" viewBox="0 0 600 100" fill="none" preserveAspectRatio="none">
              {/* Kılavuz Çizgiler */}
              <line x1="40" y1="20" x2="580" y2="20" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1="40" y1="50" x2="580" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1="40" y1="80" x2="580" y2="80" stroke="#334155" strokeWidth="0.5" />
              <line x1="40" y1="10" x2="40" y2="80" stroke="#334155" strokeWidth="0.5" />

              {/* PSD Doldurma Alanı */}
              <polygon
                points="40,80 80,40 480,40 540,80"
                fill="url(#amber-psd-gradient)"
                opacity="0.3"
              />

              {/* PSD Çizgisi */}
              <polyline
                points="40,80 80,40 480,40 540,80"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Kırılma Frekans Noktaları */}
              <circle cx="80" cy="40" r="3.5" fill="#F59E0B" />
              <circle cx="480" cy="40" r="3.5" fill="#F59E0B" />

              {/* Gradyan Tanımı */}
              <defs>
                <linearGradient id="amber-psd-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                </linearGradient>
              </defs>
            </svg>

            {/* X Ekseni Frekans Etiketleri */}
            <div className="flex justify-between px-10 text-[10px] text-gray-500 pt-1">
              <span>{platform.fMin} Hz</span>
              <span>100 Hz</span>
              <span>1000 Hz</span>
              <span>{platform.fMax} Hz</span>
            </div>
          </div>
        </div>

        {/* APDL Dışa Aktarma Önizlemesi */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            onClick={() => setShowApdl(!showApdl)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs uppercase tracking-wider transition-colors"
          >
            <FileCode className="w-4 h-4 text-amber-400" />
            <span>{showApdl ? 'APDL Kodunu Gizle' : 'ANSYS APDL Kodunu Önizle'}</span>
          </button>

          <span className="text-[11px] text-gray-400 self-center">
            Simcenter NX ve Abaqus sınır koşulları otomatik türetilir.
          </span>
        </div>

        {/* APDL Kod Bloğu */}
        {showApdl && (
          <div className="p-4 rounded-xl bg-black/90 border border-amber-500/30 text-xs font-mono relative mt-3 space-y-2">
            <div className="flex items-center justify-between text-gray-400 border-b border-white/10 pb-2">
              <span className="text-amber-400 font-bold">ansys_input_deck.inp</span>
              <button
                onClick={handleCopyApdl}
                className="flex items-center gap-1.5 text-[11px] text-gray-300 hover:text-white px-2 py-1 rounded bg-white/10"
              >
                {copiedApdl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedApdl ? 'Kopyalandı' : 'Kodu Kopyala'}</span>
              </button>
            </div>
            <pre className="text-amber-200/90 overflow-x-auto text-[11px] leading-relaxed py-2">
              {apdlCode}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
