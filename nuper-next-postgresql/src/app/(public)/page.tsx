import Link from 'next/link';
import SpaceHero from '@/components/SpaceHero';
import HowItWorks from '@/components/HowItWorks';
import { prisma } from '@/lib/db';
import { ArrowRight, Calendar, Newspaper, Star, Sparkles } from 'lucide-react';
import { unstable_noStore as noStore } from 'next/cache';

async function getFeaturedEvent() {
  noStore();
  try {
    const event = await prisma.event.findFirst({
      where: { isFeatured: true },
      orderBy: { createdAt: 'desc' }
    });
    return event;
  } catch (e) {
    console.error("Failed to fetch featured event", e);
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
  const featuredEvent = await getFeaturedEvent();
  const latestBulletin = await getLatestBulletin();

  return (
    <main className="min-h-screen bg-nuper-dark-blue text-white selection:bg-blue-500/30">
      {/* Hero Section */}
      <section id="home" className="relative flex items-center min-h-screen overflow-hidden">
        <SpaceHero />
        <div className="hero-overlay absolute inset-0 z-0"></div>
        <div className="relative z-10 w-full max-w-7xl px-4 mx-auto pt-20">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="text-center text-white lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium border rounded-full border-blue-500/30 bg-blue-500/10 text-blue-200 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="font-heading">Geleceğin Girişimcilik Ekosistemi</span>
              </div>
              <h1 className="text-5xl font-bold leading-tight md:text-6xl lg:text-7xl font-heading animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150" style={{ animationDelay: '150ms' }}>
                Nuper ile <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-white">Geleceğini Şekillendir</span>
              </h1>
              <p className="mt-6 font-sans text-lg md:text-xl text-gray-300 max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300" style={{ animationDelay: '300ms' }}>
                Öğrenciler için fırsatlar, teknoloji ve inovasyon vizyonu. Fikrini gerçeğe dönüştürmek ve doğru yatırımcılarla eşleşmek için elit ekosisteme adım at.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-500" style={{ animationDelay: '500ms' }}>
                <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold transition-all duration-300 bg-white rounded-xl text-nuper-dark-blue hover:bg-transparent hover:text-white hover:border-white border-2 border-transparent font-heading shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                  Elit Ağa Katıl
                </Link>
                <Link href="#explore" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold transition-all duration-300 bg-glass text-white rounded-xl hover:bg-[rgba(30,41,59,0.7)] hover:border-white/30 font-heading group">
                  Keşfet <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-blue-400">Vizyoner</span> Fırsatlar
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                Özel etkinliklere katıl, yatırımcılarla buluş ve Nuper ekosisteminin prestijli dünyasında yerini al.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-white">
              {/* Featured Event Column */}
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <Star className="text-blue-400 w-6 h-6" />
                  <h3 className="text-2xl font-bold font-heading">Öne Çıkan Etkinlik</h3>
                </div>
                {featuredEvent ? (
                  <div className="bg-glass hover:bg-[rgba(30,41,59,0.5)] transition-all duration-500 rounded-3xl overflow-hidden border-white/10 group flex-1 flex flex-col">
                    <div className="relative h-72 w-full overflow-hidden">
                      <img
                        src={featuredEvent.cardImage || 'https://placehold.co/800x600/0f172a/ffffff?text=Etkinlik'}
                        alt={featuredEvent.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80"></div>
                      <div className="absolute top-4 right-4 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-100 px-4 py-1.5 rounded-full text-sm font-semibold shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        Öne Çıkan
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-blue-300 mb-4 text-sm font-medium tracking-wide">
                        <Calendar size={18} />
                        <span>{featuredEvent.date ? new Date(String(featuredEvent.date)).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tarih Belirtilmemiş'}</span>
                      </div>
                      <h4 className="text-3xl font-bold mb-4 line-clamp-2 text-white font-heading group-hover:text-blue-200 transition-colors">
                        {featuredEvent.title}
                      </h4>
                      <p className="text-gray-400 mb-8 line-clamp-3 leading-relaxed flex-1">
                        {featuredEvent.description}
                      </p>
                      <Link
                        href={`/events/${featuredEvent.slug}`}
                        className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                      >
                        Detayları İncele
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[450px] flex items-center justify-center bg-glass rounded-3xl border border-white/5">
                    <p className="text-gray-500 font-medium">Öne çıkan etkinlik bulunmuyor.</p>
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
