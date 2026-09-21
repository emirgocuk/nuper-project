import Link from 'next/link';
import SpaceHero from '@/components/SpaceHero';
import HowItWorks from '@/components/HowItWorks';
import { NuperLogo } from '@/components/brand/NuperLogo';
import { prisma } from '@/lib/db';
import { ArrowRight, Newspaper, Radar, Shield, Terminal, Activity, Lock, Cpu } from 'lucide-react';
import { unstable_noStore as noStore } from 'next/cache';

const FALLBACK_TREND = {
  title: "Gelişmiş Sensör Füzyonu & Otonom Karar Matrisleri",
  aiSummary: "Fiziksel yapay zekanın kritik donanımlarda deterministik çalışmasını sağlayan düşük gecikmeli mimari protokoller ve yerel model optimizasyonları.",
  aiScore: 92,
  userScore: 92,
  status: 'APPROVED',
  category: 'SAVUNMA TEKNOLOJİSİ',
  source: { name: 'NUPER SİSTEMLERİ' },
  link: '/projects',
  publishedAt: new Date().toISOString(),
};

const FALLBACK_BULLETIN = {
  slug: "sovereign-systems-v2",
  title: "Nuper Systems V2: Yerel Yapay Zeka ve Otonom Sensör Ağları",
  description: "Dış ağ bağlantısı gerektirmeyen izole ortamlarda görev icra eden egemen sistem mimarimizin yeni sürüm notları ve teknik saha sonuçları.",
  cardImage: "https://placehold.co/800x600/0c101a/ffffff?text=Nuper+Announcement",
  createdAt: new Date().toISOString(),
};

async function getTopTrend() {
  noStore();
  try {
    const trend = await prisma.trendFeed.findFirst({
      where: {
        aiScore: { gt: 0 },
        aiSummary: { not: null },
      },
      orderBy: [
        { status: 'desc' },
        { aiScore: 'desc' },
      ],
      include: { source: { select: { name: true } } },
    });
    return trend || FALLBACK_TREND;
  } catch (e) {
    console.warn("Using fallback trend data:", e);
    return FALLBACK_TREND;
  }
}

async function getLatestBulletin() {
  noStore();
  try {
    const bulletin = await prisma.bulletin.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    return bulletin || FALLBACK_BULLETIN;
  } catch (e) {
    console.warn("Using fallback bulletin data:", e);
    return FALLBACK_BULLETIN;
  }
}

export default async function Home() {
  const topTrend = await getTopTrend();
  const latestBulletin = await getLatestBulletin();

  return (
    <main className="min-h-screen bg-[#080B11] text-white selection:bg-sky-500/30 font-sans">
      {/* Hero Section */}
      <section id="home" className="relative flex items-center min-h-[92vh] overflow-hidden pt-24 pb-16">
        <SpaceHero />
        
        <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left Content Column */}
            <div className="text-center lg:text-left lg:col-span-7">
              {/* Tactical Status Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-mono uppercase tracking-widest border rounded border-sky-500/30 bg-sky-500/10 text-sky-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>NUPER INDUSTRIES // SAVUNMA &amp; DERİN TEKNOLOJİ SİSTEMLERİ</span>
              </div>

              {/* Sovereign Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.08] tracking-tight font-heading text-white">
                EGEMEN AZINLIKLAR ÇAĞI.
                <span className="block mt-2 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-400">
                  BİRİNCİ PRENSİPLER İLE DERİN TEKNOLOJİ.
                </span>
              </h1>

              {/* Grounded Doctrine Subtext */}
              <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
                Bürokratik hantallıkların ve yapay zeka sıradanlığının ötesinde; 
                birinci prensiplerden türetilen radikal problem tespiti ve kavramsal mühendislik yaklaşımıyla, 
                bağımsız sermayeyle geliştirilmiş kritik savunma, otonom sistemler ve derin teknoloji mimarileri.
              </p>

              {/* Tactical Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/projects" 
                  className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold tracking-wider uppercase transition-all duration-200 bg-white text-[#080B11] hover:bg-gray-200 rounded font-heading"
                >
                  <Terminal className="w-4 h-4 mr-2 text-[#080B11]" />
                  Sistemleri İncele
                </Link>
                <Link 
                  href="#pillars" 
                  className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold tracking-wider uppercase transition-all duration-200 bg-[#0C101A] text-white border border-white/20 hover:border-sky-400 hover:text-sky-300 rounded font-heading group"
                >
                  Üretim Doktrini <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1 text-sky-400" />
                </Link>
              </div>

              {/* Mil-Spec Telemetry Row */}
              <div className="mt-12 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-[11px] font-mono text-gray-500 uppercase">MİMARİ</div>
                  <div className="text-xs font-mono font-bold text-gray-200">SOVEREIGN CORE</div>
                </div>
                <div>
                  <div className="text-[11px] font-mono text-gray-500 uppercase">GİZLİLİK</div>
                  <div className="text-xs font-mono font-bold text-sky-400">LEVEL 01 / 02</div>
                </div>
                <div>
                  <div className="text-[11px] font-mono text-gray-500 uppercase">DOKTRİN</div>
                  <div className="text-xs font-mono font-bold text-emerald-400">BOOTSTRAP</div>
                </div>
              </div>
            </div>

            {/* Right Tactical HUD Telemetry Terminal */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="bg-[#0C101A] border border-white/10 rounded-xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                {/* Corner Mil-Spec Accents */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-sky-400/60" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-sky-400/60" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-sky-400/60" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-sky-400/60" />

                {/* HUD Header */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold tracking-wider text-gray-200 uppercase">
                      SYSTEM METRICS // NUPER-OS
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                    ONLINE
                  </span>
                </div>

                {/* Central Visual Focus */}
                <div className="py-6 flex flex-col items-center justify-center border border-white/5 rounded-lg bg-[#080B11]/80 mb-5 relative">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08)_0%,transparent_70%)] pointer-events-none" />
                  <NuperLogo size={56} showText={false} variant="nexus" centerCore="eye" className="mb-3 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]" />
                  <div className="text-xs font-mono font-bold tracking-widest text-white uppercase">
                    NUPER SOVEREIGN PYLON
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 mt-1">
                    AZINLIK İRADESİ • DERİN MİMARİ • KESKİN ODAK
                  </div>
                </div>

                {/* Tactical Parameters List */}
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between items-center p-2 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-sky-400" /> HEDEF ALAN:
                    </span>
                    <span className="text-gray-200 font-semibold">Savunma & Fiziksel AI</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" /> GÜVENLİK:
                    </span>
                    <span className="text-gray-200 font-semibold">Uçtan Uca İzolasyon</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" /> ERİŞİM:
                    </span>
                    <span className="text-gray-200 font-semibold">Kademeli Şifreleme</span>
                  </div>
                </div>

                {/* HUD Footer Status */}
                <div className="mt-5 pt-3 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-gray-500">
                  <span>TELEMETRY // LATENCY 1.2MS</span>
                  <span className="text-sky-400">NO DEPENDENCY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctrine Pillars Section */}
      <div id="pillars" className="relative z-20 bg-[#080B11]">
        <HowItWorks />

        {/* Operational Intelligence & Strategic Announcements Section */}
        <section className="py-24 relative bg-[#080B11] border-b border-white/5">
          <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl relative z-10">
            {/* Section Header */}
            <div className="max-w-3xl mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-mono uppercase tracking-widest bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded mb-4">
                <Radar className="w-3.5 h-3.5 text-sky-400" />
                İSTİHBARAT RADARI &amp; DUYURULAR
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-heading tracking-tight text-white uppercase">
                STRATEJİK GELİŞMELER &amp; PROJE DUYURULARI
              </h2>
              <p className="mt-3 text-base text-gray-400 leading-relaxed">
                Nuper bünyesinde yürütülen önemli proje lansmanları, stratejik duyurular ve yapay zeka tarafından taranmış kritik teknoloji sinyalleri.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-white">
              {/* Top Trend Column */}
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <Radar className="text-sky-400 w-5 h-5" />
                  <h3 className="text-xl font-bold font-heading uppercase tracking-wide">
                    Teknoloji İstihbaratı
                  </h3>
                </div>

                {topTrend ? (
                  <div className="bg-[#0C101A] border border-white/10 hover:border-sky-500/40 transition-all duration-300 rounded-xl overflow-hidden flex-1 flex flex-col p-6 sm:p-8">
                    {/* Score + Category */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex flex-col items-center justify-center px-3 py-1.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 font-mono font-bold text-lg">
                        <span className="text-[9px] uppercase tracking-wider text-gray-400">SKOR</span>
                        {topTrend.userScore ?? topTrend.aiScore}
                      </div>
                      <div>
                        <p className="text-xs text-sky-400 font-mono font-semibold uppercase tracking-wider">
                          KAYNAK: {topTrend.source.name}
                        </p>
                        {topTrend.category && (
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                            SEKTÖR: {topTrend.category}
                          </span>
                        )}
                      </div>
                      {topTrend.status === 'APPROVED' && (
                        <span className="ml-auto px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold rounded border border-emerald-500/30 uppercase tracking-wider">
                          DOĞRULANMIŞ SİNYAL
                        </span>
                      )}
                    </div>

                    <h4 className="text-xl font-bold mb-3 text-white font-heading leading-snug">
                      {topTrend.title}
                    </h4>

                    {topTrend.aiSummary && (
                      <p className="text-gray-300 leading-relaxed text-sm flex-1 mb-6">
                        {topTrend.aiSummary}
                      </p>
                    )}

                    <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                      <a
                        href={topTrend.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sky-400 font-mono text-xs uppercase font-bold hover:text-sky-300 transition-colors"
                      >
                        Kaynağa Git
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </a>
                      <span className="text-xs font-mono text-gray-500">
                        {topTrend.publishedAt ? new Date(topTrend.publishedAt).toLocaleDateString('tr-TR') : ''}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[380px] flex flex-col items-center justify-center bg-[#0C101A] rounded-xl border border-white/5 p-8 text-center gap-3">
                    <Radar className="w-10 h-10 text-gray-600" />
                    <p className="text-gray-400 font-mono text-sm">Aktif istihbarat sinyali taranıyor.</p>
                    <p className="text-gray-600 font-mono text-xs">Ar-Ge radarı otomatik olarak yeni veri bekliyor.</p>
                  </div>
                )}
              </div>

              {/* Latest Bulletin / Strategic Announcement Column */}
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <Newspaper className="text-emerald-400 w-5 h-5" />
                  <h3 className="text-xl font-bold font-heading uppercase tracking-wide">
                    Önemli Proje Duyurusu
                  </h3>
                </div>

                {latestBulletin ? (
                  <div className="bg-[#0C101A] border border-white/10 hover:border-emerald-500/40 transition-all duration-300 rounded-xl overflow-hidden flex-1 flex flex-col">
                    {latestBulletin.cardImage && (
                      <div className="relative h-60 w-full overflow-hidden border-b border-white/10">
                        <img
                          src={latestBulletin.cardImage}
                          alt={latestBulletin.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute top-3 right-3 bg-[#080B11]/90 border border-white/10 text-emerald-400 px-3 py-1 rounded text-xs font-mono font-semibold uppercase">
                          STRATEJİK BİLDİRİ
                        </div>
                      </div>
                    )}
                    <div className="p-6 sm:p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-emerald-400 mb-3 text-xs font-mono uppercase tracking-wide">
                        <Newspaper size={16} />
                        <span>{new Date(latestBulletin.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <h4 className="text-2xl font-bold mb-3 text-white font-heading">
                        {latestBulletin.title}
                      </h4>
                      <p className="text-gray-300 mb-6 text-sm leading-relaxed flex-1">
                        {latestBulletin.description || "Nuper ekosistemindeki en güncel derin teknoloji ve mühendislik raporu."}
                      </p>
                      <Link
                        href={`/bulletins/${latestBulletin.slug}`}
                        className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase font-bold hover:text-emerald-300 transition-colors mt-auto"
                      >
                        Duyuruyu İncele
                        <ArrowRight size={14} className="transition-transform hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[380px] flex items-center justify-center bg-[#0C101A] rounded-xl border border-white/5 p-8">
                    <p className="text-gray-400 font-mono text-sm">Henüz yayınlanmış duyuru bulunmuyor.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

