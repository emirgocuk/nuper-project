import React from 'react';
import { NuperLogo, NuperEmblemVariant } from '@/components/brand/NuperLogo';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, CheckCircle2, Terminal } from 'lucide-react';

interface EmblemDesign {
  id: NuperEmblemVariant;
  name: string;
  codename: string;
  geometry: string;
  philosophy: string;
  antiSlopVerification: string[];
}

const EMBLEMS: EmblemDesign[] = [
  {
    id: 'arch',
    name: 'Sovereign Arch',
    codename: 'ROTA 01 // ANITSAL KEMER',
    geometry: 'İki anıtsal dikey sütun, üst lintel ve negatif alanda asılı duran merkez çekirdek (singularity).',
    philosophy: 'Anduril ve klasik anıt mimarisinin ruh eşi. Bir kapı (gateway), sarsılmaz bir temel ve devletlerin zapt edemeyeceği egemen bir kaledir.',
    antiSlopVerification: [
      'N harfi kesinlikle içermez (Monogram değildir)',
      'Kalkan veya zırh klişesi değildir',
      'Uçak veya somut silah silüeti değildir',
      'Matematiksel monoline simetri',
    ],
  },
  {
    id: 'nexus',
    name: 'Trilateral Delta Nexus',
    codename: 'ROTA 02 // ÜÇLÜ PRİZMA',
    geometry: '120 derecelik radyal simetriye sahip 3 prizmatik kanat ve merkezde negatif eşkenar vakum alanı.',
    philosophy: 'Kurucu doktrininin üç sacayağı: 1. Düş (Vizyon), 2. Bilgi (Derin Ar-Ge & Kod), 3. İcraat (Kendi kendini fonlayan egemen üretim). Üç güç birleştiğinde ortaya çıkan nükleer denge.',
    antiSlopVerification: [
      '3 yönlü radyal geometri (Harf formundan tamamen bağımsız)',
      'Aerodinamik veya askeri araç taklidi değildir',
      'Yüksek kontrastta (16px favicon ve devasa bina cephesinde) kusursuz okunur',
    ],
  },
  {
    id: 'meridian',
    name: 'Kinetic Meridian',
    codename: 'ROTA 03 // TELEMETRİ MERİDYENİ',
    geometry: '45 derecelik diyagonal yarık ile ayrılmış iki yarım daire ve merkezde kilitlenen prizmatik odak noktası.',
    philosophy: 'Palantir ve Roketsan disiplininde optik hassasiyet. Fiziksel yapay zekanın sensör füzyonunu, hedefe kilitlenen otonom sistemleri ve küresel görüşü (omnipresence) simgeler.',
    antiSlopVerification: [
      'Optik/küresel reticle mimarisi',
      'Sıfır harf çağrışımı',
      'Bulanık glow değil, keskin saf vektör kesim',
    ],
  },
  {
    id: 'apex',
    name: 'Monolith Apex',
    codename: 'ROTA 04 // İKİZ DİKİLİTAŞ',
    geometry: 'Tabandan göğe yükselen iki açılı monolit sütun ve aralarında yerçekimsiz havada asılı duran tepe elması.',
    philosophy: 'Kadim dikilitaşların geleceğe uzanan fütüristik yorumu. İki sütun yazılım ve donanımı temsil eder; aralarındaki asılı elmas ise "Düş Mühendisliği" kıvılcımıdır.',
    antiSlopVerification: [
      'Dikey monolitik denge',
      'Harf veya ok ucu değildir, iki bağımsız sütun ve havada asılı kristaldir',
      'Anıtsal ve zamansız (baki)',
    ],
  },
  {
    id: 'matrix',
    name: 'Hexagonal Singularity',
    codename: 'ROTA 05 // KRİSTAL HÜCRESEL MATRİS',
    geometry: '3 eşit izometrik eşkenar dörtgenden oluşan, James Webb ayna matrisine benzer altıgen kristal projeksiyon.',
    philosophy: 'Fiziksel donanım, kuantum çip mimarisi ve mikro-fabrikasyonun yapı taşı. Büyük hantal yapıların aksine, atomik hassasiyette çalışan egemen azınlıkların yoğun gücü.',
    antiSlopVerification: [
      'İzometrik saf kristal geometri',
      'Geleneksel teknoloji logolarından (daire/ok) tamamen ayrışır',
      'Savunma sanayii ve derin teknoloji ağırlığı taşır',
    ],
  },
  {
    id: 'pulsar',
    name: 'Cardinal Pulsar',
    codename: 'ROTA 06 // KOORDİNAT ODAĞI',
    geometry: 'Dört ana yöne (Kuzey, Güney, Doğu, Batı) bakan hassas telemetri kanatları, kesikli halka ve merkez elmas.',
    philosophy: 'Küresel ölçekte yön belirleme, navigasyon ve derin uzay telemetrisi. "Çorabın söküğünü yakalamak" için her yöne bakan araştırma gözü.',
    antiSlopVerification: [
      'Dört eksenli koordinat hassasiyeti',
      'Harf içermez, pusula veya artı işaretinin fütüristik stilizasyonu',
      'Mikro boyutlarda dahi dağılmayan net silüet',
    ],
  },
];

export default function BrandShowcasePage() {
  return (
    <main className="min-h-screen bg-[#080B11] text-white selection:bg-white/20 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigasyon & Başlık */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors mb-6 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Ana Sayfaya Dön
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 text-[11px] font-mono font-semibold uppercase tracking-widest bg-white/5 border border-white/10 text-gray-300 rounded mb-3">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                ANTI-SLOP BRAND ARSENAL // NUPER EMBLER
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-sans uppercase">
                SAF GEOMETRİK AMBLEM KATALOĞU
              </h1>
              <p className="mt-3 text-base text-gray-400 max-w-3xl leading-relaxed">
                N harfi, kalkan ve uçak klişelerinden arındırılmış; Anduril, Roketsan ve Palantir disiplininde 
                zamansız (baki), monolitik ve 100% matematiksel 6 soyut savunma/derin teknoloji rotası.
              </p>
            </div>

            {/* Anti-Slop Güvence Rozeti */}
            <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/10 rounded-lg shrink-0">
              <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <div className="font-mono font-bold text-white uppercase">Sıfır AI-Slop Garantisi</div>
                <div className="text-gray-400">Harf yok • Kalkan yok • Uçak yok • Saf 2D Vektör</div>
              </div>
            </div>
          </div>
        </div>

        {/* RESMİ SEÇİM VE NİHAİ MÜHÜR: TRILATERAL DELTA & SPACE GROTESK */}
        <section className="mb-20 p-8 sm:p-10 bg-[#0C101A] border border-blue-500/40 rounded-2xl relative overflow-hidden shadow-[0_0_50px_rgba(56,189,248,0.05)]">
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-blue-500/10 border-b border-l border-blue-500/30 text-blue-400 font-mono text-xs font-bold uppercase tracking-widest rounded-bl-xl">
            RESMİ MARKA MÜHRÜ // ONAYLANAN ROTA
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Sol: Kusursuz Orantılanmış Zarif Amblem Sahnesi */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-[#05070B] border border-white/10 rounded-xl relative">
              <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2">
                TRILATERAL DELTA NEXUS // ÜSTTE EŞKENAR YAMUK İKİZ KANAT
              </div>
              <div className="text-[10px] font-mono text-blue-400 mb-4">
                Üstte 2 Parçalı Eşkenar Yamuk + Altta 2 Dışa Bakan Üçgen & Merkez Singularity
              </div>
              
              {/* Amblem Vektör */}
              <div className="my-6 transition-transform duration-300 hover:scale-105">
                <NuperLogo variant="nexus" size={120} showText={false} />
              </div>

              {/* Farklı Boyutlarda Denge Testi */}
              <div className="w-full pt-6 border-t border-white/10 flex items-center justify-around text-center">
                <div>
                  <div className="text-[10px] font-mono text-gray-500 mb-2">24px (Favicon)</div>
                  <NuperLogo variant="nexus" size={24} showText={false} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-gray-500 mb-2">36px (Navbar)</div>
                  <NuperLogo variant="nexus" size={36} showText={false} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-gray-500 mb-2">48px (Başlık)</div>
                  <NuperLogo variant="nexus" size={48} showText={false} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-gray-500 mb-2">72px (Kart)</div>
                  <NuperLogo variant="nexus" size={72} showText={false} />
                </div>
              </div>
            </div>

            {/* Sağ: Seçilen Tipografi & Resmi Lockup */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest block mb-1">
                  RESMİ WORDMARK & AMBLEM KİLİDİ
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                  NUPER // ANDURIL ORANTILI RESMİ KİLİT
                </h2>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                  Yazı yüksekliği, amblem yüksekliğinin tam <strong className="text-white">%82&apos;sine</strong> eşitlenerek 
                  Anduril gibi başa baş ve monolitik bir blok oluşturuldu. Harf aralığı geniş ve kopuk olmaktan çıkarılıp 
                  kompakt (<code className="text-blue-400 font-mono">0.03em</code>) askeri-endüstriyel dokuya kavuşturuldu.
                </p>
              </div>

              {/* Resmi Lockup (Anduril Oranları & Merkez Çekirdek Karşılaştırması) */}
              <div className="p-6 bg-white/[0.03] border border-blue-500/50 rounded-xl space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">
                      YENİ İSTEK: YERE BAKAN KESKİN GÖZ (centerCore=&quot;eye&quot;):
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded">
                      ŞU AN AKTİF
                    </span>
                  </div>
                  <div className="py-2 flex flex-col sm:flex-row sm:items-center gap-8">
                    <div>
                      <div className="text-[10px] font-mono text-gray-500 mb-2">NAVBAR (28px):</div>
                      <NuperLogo
                        variant="nexus"
                        centerCore="eye"
                        size={28}
                        showText={true}
                        fontFamily="heading"
                        tracking="anduril"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-gray-500 mb-2">BÜYÜK BOY (44px):</div>
                      <NuperLogo
                        variant="nexus"
                        centerCore="eye"
                        size={44}
                        showText={true}
                        fontFamily="heading"
                        tracking="anduril"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                      ÖNCEKİ TASARIM: DAİRESEL ÇEKİRDEK (centerCore=&quot;circle&quot;):
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">
                      Gerektiğinde tek kelimeyle geri dönülebilir
                    </span>
                  </div>
                  <div className="py-2 flex flex-col sm:flex-row sm:items-center gap-8 opacity-80 hover:opacity-100 transition-opacity">
                    <div>
                      <div className="text-[10px] font-mono text-gray-500 mb-2">NAVBAR (28px):</div>
                      <NuperLogo
                        variant="nexus"
                        centerCore="circle"
                        size={28}
                        showText={true}
                        fontFamily="heading"
                        tracking="anduril"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-gray-500 mb-2">BÜYÜK BOY (44px):</div>
                      <NuperLogo
                        variant="nexus"
                        centerCore="circle"
                        size={44}
                        showText={true}
                        fontFamily="heading"
                        tracking="anduril"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Açık Zemin / Zıt Kontrast Testi (Zamansızlık Kanıtı) */}
              <div className="p-5 bg-white text-black rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-1 font-bold">
                    AÇIK ZEMİN TESTİ (MONOKROM ONAY)
                  </div>
                  <div className="text-xs text-gray-500">
                    Baskı, CNC freze, lazer kazıma ve resmi evrak için saf siyah test
                  </div>
                </div>
                {/* SVG fill ile siyah logo */}
                <div className="filter invert">
                  <NuperLogo
                    variant="nexus"
                    size={38}
                    showText={true}
                    fontFamily="heading"
                    tracking="wide"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6 Amblem Karşılaştırma Izgarası */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EMBLEMS.map((emblem) => (
            <div
              key={emblem.id}
              className="group bg-[#0C101A] border border-white/10 hover:border-white/30 transition-all duration-300 rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                {/* Kod Adı & Etiket */}
                <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mb-6 pb-3 border-b border-white/5">
                  <span className="text-blue-400 font-bold">{emblem.codename}</span>
                  <span className="uppercase tracking-widest">{emblem.id}</span>
                </div>

                {/* Büyük Önizleme Sahnesi (Koyu Obsidian Üzerinde Saf Beyaz) */}
                <div className="h-44 w-full bg-[#05070B] border border-white/5 rounded-lg flex items-center justify-center relative overflow-hidden mb-6 group-hover:border-white/20 transition-colors">
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none" />
                  <NuperLogo variant={emblem.id} size={84} showText={false} />
                </div>

                {/* Başlık ve Wordmark Kilidi */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold tracking-tight text-white">{emblem.name}</h3>
                  <div className="px-2 py-0.5 text-[10px] font-mono bg-white/5 border border-white/10 text-gray-300 rounded">
                    NUPER // LOCKUP
                  </div>
                </div>

                {/* Mini Wordmark Önizleme */}
                <div className="p-3 bg-white/[0.03] border border-white/5 rounded-md mb-5 flex items-center justify-center">
                  <NuperLogo variant={emblem.id} size={28} showText={true} />
                </div>

                {/* Felsefe & Geometri Açıklaması */}
                <div className="space-y-3 mb-6 text-xs leading-relaxed">
                  <div>
                    <span className="font-mono font-bold text-gray-300 uppercase tracking-wider block mb-1">Geometri:</span>
                    <p className="text-gray-400">{emblem.geometry}</p>
                  </div>
                  <div>
                    <span className="font-mono font-bold text-gray-300 uppercase tracking-wider block mb-1">Felsefe & Doktrin:</span>
                    <p className="text-gray-400">{emblem.philosophy}</p>
                  </div>
                </div>
              </div>

              {/* Anti-Slop Doğrulama Listesi */}
              <div className="pt-4 border-t border-white/5">
                <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Tasarım Kriterleri:
                </div>
                <ul className="space-y-1.5 text-[11px] text-gray-400">
                  {emblem.antiSlopVerification.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Ölçek Testi (Boyutlar: 16px, 24px, 32px, 48px) */}
                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-gray-400">
                  <span className="text-[10px] font-mono">ÖLÇEK TESTİ:</span>
                  <div className="flex items-center gap-3">
                    <NuperLogo variant={emblem.id} size={16} showText={false} />
                    <NuperLogo variant={emblem.id} size={24} showText={false} />
                    <NuperLogo variant={emblem.id} size={32} showText={false} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RESMİ VEKTÖR VARLIKLARI & DOSYA DEPOSU */}
        <section className="mt-20 p-8 sm:p-10 bg-[#0C101A] border border-white/10 rounded-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest block mb-1">
                RESMİ ÜRETİM ARŞİVİ // PUBLIC/BRAND
              </span>
              <h3 className="text-2xl font-bold uppercase tracking-tight text-white font-sans">
                VEKTÖREL SVG LOGO & AMBLEM PAKETİ
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Eski taslaklar temizlendi; tüm üretim ve baskı formatları saf vektör olarak kaydedildi.
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-400 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg shrink-0">
              ✓ 7 RESMİ VEKTÖR AKTİF
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1: Beyaz Sembol */}
            <a
              href="/brand/nuper-symbol-white.svg"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 bg-[#05070B] border border-white/10 hover:border-blue-500/50 rounded-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-28 flex items-center justify-center border-b border-white/5 pb-4 mb-4">
                  <img src="/brand/nuper-symbol-white.svg" alt="Nuper White Symbol" className="h-16 w-16" />
                </div>
                <div className="font-mono text-xs font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  nuper-symbol-white.svg
                </div>
                <p className="text-[11px] text-gray-400">Şeffaf zemin üzerinde saf beyaz ana amblem.</p>
              </div>
              <div className="mt-4 text-[10px] font-mono text-blue-400 flex items-center gap-1">
                GÖRÜNTÜLE / İNDİR →
              </div>
            </a>

            {/* 2: Siyah Sembol (Baskı) */}
            <a
              href="/brand/nuper-symbol-black.svg"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 bg-white text-black border border-gray-200 hover:border-black rounded-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-28 flex items-center justify-center border-b border-gray-100 pb-4 mb-4">
                  <img src="/brand/nuper-symbol-black.svg" alt="Nuper Black Symbol" className="h-16 w-16" />
                </div>
                <div className="font-mono text-xs font-bold text-black mb-1">
                  nuper-symbol-black.svg
                </div>
                <p className="text-[11px] text-gray-600">Açık zemin, monokrom baskı ve evraklar için siyah amblem.</p>
              </div>
              <div className="mt-4 text-[10px] font-mono text-black font-bold flex items-center gap-1">
                GÖRÜNTÜLE / İNDİR →
              </div>
            </a>

            {/* 3: Obsidian Avatar / App Icon */}
            <a
              href="/brand/nuper-symbol-obsidian.svg"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 bg-[#05070B] border border-white/10 hover:border-blue-500/50 rounded-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-28 flex items-center justify-center border-b border-white/5 pb-4 mb-4">
                  <img src="/brand/nuper-symbol-obsidian.svg" alt="Nuper App Icon" className="h-16 w-16" />
                </div>
                <div className="font-mono text-xs font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  nuper-symbol-obsidian.svg
                </div>
                <p className="text-[11px] text-gray-400">Kare obsidyen zeminli uygulama ikonu ve profil avatarı.</p>
              </div>
              <div className="mt-4 text-[10px] font-mono text-blue-400 flex items-center gap-1">
                GÖRÜNTÜLE / İNDİR →
              </div>
            </a>

            {/* 4: Yatay Beyaz Logo (Anduril Oranları) */}
            <a
              href="/brand/nuper-logo-white.svg"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 bg-[#05070B] border border-white/10 hover:border-blue-500/50 rounded-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-28 flex items-center justify-center border-b border-white/5 pb-4 mb-4 px-2">
                  <img src="/brand/nuper-logo-white.svg" alt="Nuper Full Logo White" className="h-8 max-w-full" />
                </div>
                <div className="font-mono text-xs font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  nuper-logo-white.svg
                </div>
                <p className="text-[11px] text-gray-400">Yatay logo kilidi (Anduril %82 altın oranı, Space Grotesk).</p>
              </div>
              <div className="mt-4 text-[10px] font-mono text-blue-400 flex items-center gap-1">
                GÖRÜNTÜLE / İNDİR →
              </div>
            </a>

            {/* 5: Yatay Siyah Logo (Baskı) */}
            <a
              href="/brand/nuper-logo-black.svg"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 bg-white text-black border border-gray-200 hover:border-black rounded-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-28 flex items-center justify-center border-b border-gray-100 pb-4 mb-4 px-2">
                  <img src="/brand/nuper-logo-black.svg" alt="Nuper Full Logo Black" className="h-8 max-w-full" />
                </div>
                <div className="font-mono text-xs font-bold text-black mb-1">
                  nuper-logo-black.svg
                </div>
                <p className="text-[11px] text-gray-600">Açık zemin ve antetli kağıt için siyah yatay kilit.</p>
              </div>
              <div className="mt-4 text-[10px] font-mono text-black font-bold flex items-center gap-1">
                GÖRÜNTÜLE / İNDİR →
              </div>
            </a>

            {/* 6: Dikey / Stacked Logo */}
            <a
              href="/brand/nuper-logo-stacked.svg"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 bg-[#05070B] border border-white/10 hover:border-blue-500/50 rounded-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-28 flex items-center justify-center border-b border-white/5 pb-4 mb-4">
                  <img src="/brand/nuper-logo-stacked.svg" alt="Nuper Stacked Logo" className="h-20 max-w-full" />
                </div>
                <div className="font-mono text-xs font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  nuper-logo-stacked.svg
                </div>
                <p className="text-[11px] text-gray-400">Merkezi dikey kilit (Amblem üstte, NUPER altta).</p>
              </div>
              <div className="mt-4 text-[10px] font-mono text-blue-400 flex items-center gap-1">
                GÖRÜNTÜLE / İNDİR →
              </div>
            </a>
          </div>
        </section>

        {/* Karar ve Entegrasyon Bilgi Notu */}
        <div className="mt-16 p-8 bg-[#0C101A] border border-white/10 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold text-white mb-1">
              Nuper Resmi Marka Mührü Onaylandı ve Mühürlendi
            </h4>
            <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
              Tüm eski taslak görseller temizlenmiş; resmi amblem, favicon, navbar ve yatay kilitler 
              üretim standartlarında sisteme işlenmiştir.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/"
              className="px-6 py-3 bg-white text-black font-semibold text-sm rounded-lg hover:bg-gray-200 transition-colors uppercase tracking-wider font-mono"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

