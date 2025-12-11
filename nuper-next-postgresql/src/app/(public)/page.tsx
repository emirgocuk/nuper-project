import Link from 'next/link';
import SpaceHero from '@/components/SpaceHero';
import HowItWorks from '@/components/HowItWorks';
import { prisma } from '@/lib/db';
import { cn } from '@/lib/utils';
import { ArrowRight, Calendar, Newspaper } from 'lucide-react';
import { unstable_noStore as noStore } from 'next/cache';

async function getFeaturedEvent() {
  noStore();
  try {
    // @ts-ignore - isFeatured might not be in generic client type yet
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
    <main className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="relative flex items-center min-h-screen overflow-hidden bg-nuper-dark-blue hero-fade-out">
        <SpaceHero />
        <div className="relative z-10 w-full max-w-6xl px-4 mx-auto">
          <div className="grid items-center grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="text-center text-white lg:text-left">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl font-heading animate-in fade-in slide-in-from-bottom-5 duration-1000">
                Nuper ile Geleceğini Şekillendir!
              </h1>
              <p className="mt-4 font-sans text-lg md:text-xl animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200" style={{ animationDelay: '200ms' }}>
                Öğrenciler için yarışmalar, etkinlikler ve fırsatlar tek platformda!
              </p>
              <p className="mt-6 text-gray-100 font-sans text-base md:text-lg max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300" style={{ animationDelay: '300ms' }}>
                Girişimcilikten teknolojiye, sanattan inovasyona uzanan yolculuğunda sana en uygun fırsatları keşfet. Hayallerini gerçeğe dönüştürmek için ilk adımı at.
              </p>
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-500" style={{ animationDelay: '500ms' }}>
                <Link href="/login" className="inline-block px-8 py-3 text-lg font-semibold transition-colors duration-300 bg-white rounded-lg text-nuper-blue hover:bg-nuper-gray font-heading">
                  Hemen Başla
                </Link>
              </div>
            </div>
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      <HowItWorks />

      <div className="bg-gradient-to-b from-[#111827] via-blue-900 to-gray-100">
        <section className="pt-20 pb-10">
          <div className="px-4 mx-auto max-w-7xl">
            <h2 className="mb-16 text-4xl font-bold text-center future-title md:text-5xl font-heading">
              Geleceğini Şekillendirmeye var mısın?
            </h2>
          </div>
        </section>

        <section className="pb-20">
          <div className="px-4 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-white">
              {/* Featured Event Column */}
              <div>
                <h3 className="mb-8 text-3xl font-bold font-heading text-center lg:text-left">Öne Çıkan Etkinlik</h3>
                {featuredEvent ? (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 shadow-2xl hover:scale-[1.02] transition-transform duration-300">
                    <div className="relative h-64 w-full">
                      <img
                        src={featuredEvent.cardImage || 'https://placehold.co/800x600/1e293b/ffffff?text=Etkinlik'}
                        alt={featuredEvent.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-nuper-blue text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        Öne Çıkan
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-2 text-blue-300 mb-4 text-sm font-medium">
                        <Calendar size={16} />
                        <span>{featuredEvent.date || 'Tarih Belirtilmemiş'}</span>
                      </div>
                      <h4 className="text-2xl font-bold mb-4 line-clamp-2 min-h-[3.5rem]">
                        {featuredEvent.title}
                      </h4>
                      <p className="text-gray-300 mb-6 line-clamp-3 min-h-[4.5rem]">
                        {featuredEvent.description}
                      </p>
                      <Link
                        href={`/events/${featuredEvent.slug}`}
                        className="inline-flex items-center gap-2 text-white font-semibold hover:text-nuper-blue transition-colors group"
                      >
                        Detayları İncele
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="h-[450px] flex items-center justify-center bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-gray-400">Öne çıkan etkinlik bulunmuyor.</p>
                  </div>
                )}
              </div>

              {/* Latest Bulletin Column */}
              <div>
                <h3 className="mb-8 text-3xl font-bold font-heading text-center lg:text-left">En Son Bülten</h3>
                {latestBulletin ? (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 shadow-2xl hover:scale-[1.02] transition-transform duration-300">
                    <div className="relative h-64 w-full">
                      <img
                        src={latestBulletin.cardImage || 'https://placehold.co/800x600/1e293b/ffffff?text=Bülten'}
                        alt={latestBulletin.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        Yeni
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-2 text-green-300 mb-4 text-sm font-medium">
                        <Newspaper size={16} />
                        <span>{new Date(latestBulletin.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <h4 className="text-2xl font-bold mb-4 line-clamp-2 min-h-[3.5rem]">
                        {latestBulletin.title}
                      </h4>
                      <p className="text-gray-300 mb-6 line-clamp-3 min-h-[4.5rem]">
                        {latestBulletin.description || "Nuper bültenlerinde haftanın öne çıkan gelişmeleri ve fırsatları seni bekliyor."}
                      </p>
                      <Link
                        href={`/bulletins/${latestBulletin.slug}`}
                        className="inline-flex items-center gap-2 text-white font-semibold hover:text-green-400 transition-colors group"
                      >
                        Bülteni Oku
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="h-[450px] flex items-center justify-center bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-gray-400">Henüz bülten yayınlanmadı.</p>
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
