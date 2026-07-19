import Link from 'next/link';
import SpaceHero from '@/components/SpaceHero';
import HowItWorks from '@/components/HowItWorks';
import { prisma } from '@/lib/db';
import { ArrowRight, Newspaper, Sparkles, BrainCircuit, TrendingUp } from 'lucide-react';
import { unstable_noStore as noStore } from 'next/cache';

async function getTopTrend() {
  noStore();
  try {
    // En yüksek puanlı APPROVED trendi getir, yoksa herhangi bir analiz edilmişi
    const trend = await prisma.trendFeed.findFirst({
      where: {
        aiScore: { gt: 0 },
        aiSummary: { not: null },
      },
      orderBy: [
        { status: 'desc' }, // APPROVED önce
        { aiScore: 'desc' },
      ],
      include: { source: { select: { name: true } } },
    });
    return trend;
  } catch (e) {
    console.error("Failed to fetch top trend", e);
    return null;
  }
}

async function getLatestBulletin() {
  noStore();
  try {
    const bulletin = await prisma.bulletin.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    return bulletin;
  } catch (e) {
    console.error("Failed to fetch latest bulletin", e);
    return null;
  }
}

export default async function Home() {
  const topTrend = await getTopTrend();
  const latestBulletin = await getLatestBulletin();


  return (
    <main className="min-h-screen bg-[#0b1120] text-white selection:bg-blue-500/30">
      {/* Hero Section */}
      <section id="home" className="relative flex items-center min-h-screen overflow-hidden">
        <SpaceHero />
        <div className="hero-overlay absolute inset-0 z-0"></div>
        <div className="relative z-10 w-full max-w-7xl px-4 mx-auto pt-20">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="text-center text-white lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium border rounded-full border-blue-500/30 bg-blue-500/10 text-blue-200 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="font-heading">NUPER INDUSTRIES // İNOVASYON & AR-GE MERKEZİ</span>
              </div>
              <h1 className="text-5xl font-bold leading-tight md:text-6xl lg:text-7xl font-heading animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150" style={{ animationDelay: '150ms' }}>
                Geleceğin <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-white">Teknolojilerini Üretiyoruz</span>
              </h1>
              <p className="mt-6 font-sans text-lg md:text-xl text-gray-300 max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300" style={{ animationDelay: '300ms' }}>
                Kendi vizyonumuzdan ve fikirlerimizden beslenen; derin teknoloji, inovasyon ve mühendislik odaklı yenilikçi projeleri hayata geçirdiğimiz dijital üretim üssümüz.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-500" style={{ animationDelay: '500ms' }}>
                <Link href="/projects" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold transition-all duration-300 bg-white rounded-xl text-nuper-dark-blue hover:bg-transparent hover:text-white hover:border-white border-2 border-transparent font-heading shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                  Projelerimizi İncele
                </Link>
                <Link href="/ideas" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold transition-all duration-300 bg-glass text-white rounded-xl hover:bg-[rgba(30,41,59,0.7)] hover:border-white/30 font-heading group">
                  Fikirler & Ar-Ge <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
            {/* Visual Balance element */}
            <div className="hidden lg:block relative">
               <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full animate-pulse-slow"></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float text-blue-400/50">
           <ArrowRight className="w-8 h-8 rotate-90" />
        </div>
      </section>

      <div id="explore" className="relative z-20 bg-[#0b1120]">
        <HowItWorks />

        <section className="py-24 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0b1120] to-[#0b1120]">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>
          
          <div className="px-4 mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <h2 className="text-4xl font-bold md:text-5xl font-heading mb-6 tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-blue-400">Vizyoner</span> Gelişmeler
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                Nuper Industries bünyesinde yürütülen en güncel lansmanlar, teknoloji bültenleri ve Ar-Ge etkinlikleri.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-white">
              {/* Top Trend Column */}
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <BrainCircuit className="text-blue-400 w-6 h-6" />
                  <h3 className="text-2xl font-bold font-heading">İstihbarat Özeti</h3>
                </div>
                {topTrend ? (
                  <div className="bg-glass hover:bg-[rgba(30,41,59,0.5)] transition-all duration-500 rounded-3xl overflow-hidden border border-white/10 group flex-1 flex flex-col p-8">
                    {/* Score + Category */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-2xl font-bold text-xl shrink-0 ${
                        topTrend.aiScore >= 80 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        topTrend.aiScore >= 50 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {topTrend.userScore ?? topTrend.aiScore}
                      </div>
                      <div>
                        <p className="text-xs text-blue-300 font-semibold tracking-wider uppercase">{topTrend.source.name}</p>
                        {topTrend.category && (
                          <span className="text-[10px] font-bold text-blue-200/60 uppercase tracking-widest">{topTrend.category}</span>
                        )}
                      </div>
                      {topTrend.status === 'APPROVED' && (
                        <span className="ml-auto px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/30 uppercase tracking-wider">
                          Sinyal
                        </span>
                      )}
                    </div>

                    <h4 className="text-xl font-bold mb-4 text-white font-heading group-hover:text-blue-200 transition-colors leading-snug line-clamp-3">
                      {topTrend.title}
                    </h4>

                    {topTrend.aiSummary && (
                      <p className="text-gray-400 leading-relaxed text-sm line-clamp-4 flex-1 mb-6">
                        {topTrend.aiSummary}
                      </p>
                    )}

                    <div className="flex items-center justify-between border-t border-white/10 pt-5 mt-auto">
                      <a
                        href={topTrend.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors text-sm"
                      >
                        Kaynağa Git
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </a>
                      <span className="text-xs text-gray-600 font-medium">
                        {topTrend.publishedAt ? new Date(topTrend.publishedAt).toLocaleDateString('tr-TR') : ''}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[450px] flex flex-col items-center justify-center bg-glass rounded-3xl border border-white/5 gap-3">
                    <TrendingUp className="w-10 h-10 text-gray-600" />
                    <p className="text-gray-500 font-medium text-sm">Henüz analiz edilmiş trend yok.</p>
                    <p className="text-gray-600 text-xs">Admin panelinden haber çekin ve AI analizi başlatın.</p>
                  </div>
                )}
              </div>

              {/* Latest Bulletin Column */}
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <Newspaper className="text-green-400 w-6 h-6" />
                  <h3 className="text-2xl font-bold font-heading">En Son Bülten</h3>
                </div>
                {latestBulletin ? (
                  <div className="bg-glass hover:bg-[rgba(30,41,59,0.5)] transition-all duration-500 rounded-3xl overflow-hidden border-white/10 group flex-1 flex flex-col">
                    <div className="relative h-72 w-full overflow-hidden">
                      <img
                        src={latestBulletin.cardImage || 'https://placehold.co/800x600/0f172a/ffffff?text=B%C3%BClten'}
                        alt={latestBulletin.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80"></div>
                      <div className="absolute top-4 right-4 bg-green-500/20 backdrop-blur-md border border-green-400/30 text-green-100 px-4 py-1.5 rounded-full text-sm font-semibold shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                        Yeni Yayında
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-green-300 mb-4 text-sm font-medium tracking-wide">
                        <Newspaper size={18} />
                        <span>{new Date(latestBulletin.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <h4 className="text-3xl font-bold mb-4 line-clamp-2 text-white font-heading group-hover:text-green-200 transition-colors">
                        {latestBulletin.title}
                      </h4>
                      <p className="text-gray-400 mb-8 line-clamp-3 leading-relaxed flex-1">
                        {latestBulletin.description || "Nuper ekosistemindeki en güncel gelişmeleri, yatırım turlarını ve başarılı girişim hikayelerini keşfedin."}
                      </p>
                      <Link
                        href={`/bulletins/${latestBulletin.slug}`}
                        className="inline-flex items-center gap-2 text-green-400 font-semibold hover:text-green-300 transition-colors"
                      >
                        Bülteni Oku
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[450px] flex items-center justify-center bg-glass rounded-3xl border border-white/5">
                    <p className="text-gray-500 font-medium">Henüz bülten yayınlanmadı.</p>
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
