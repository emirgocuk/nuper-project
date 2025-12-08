import Link from 'next/link';
import SpaceHero from '@/components/SpaceHero';
import HowItWorks from '@/components/HowItWorks';
import { prisma } from '@/lib/db';
import { cn } from '@/lib/utils';
import { ArrowRight, Calendar, Newspaper } from 'lucide-react';
import { unstable_noStore as noStore } from 'next/cache';

// async function getEvents() {
//     noStore();
//     try {
//         // const events = await prisma.event.findMany({
//         //     take: 3,
//         //     orderBy: { createdAt: 'desc' }
//         // });
//         // return events;
//         return [];
//     } catch (e) {
//         console.error("Failed to fetch events", e);
//         return [];
//     }
// }

// async function getBulletins() {
//     noStore();
//     try {
//         // const bulletins = await prisma.bulletin.findMany({
//         //     take: 3,
//         //     orderBy: { createdAt: 'desc' }
//         // });
//         // return bulletins;
//         return [];
//     } catch (e) {
//         console.error("Failed to fetch bulletins", e);
//         return [];
//     }
// }

export default async function Home() {
  // const events = await getEvents();
  // const bulletins = await getBulletins();
  const events: any[] = [];
  const bulletins: any[] = [];

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
              <p className="mt-4 font-sans text-lg md:text-xl animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200 fill-mode-forwards opacity-0" style={{ animationDelay: '200ms' }}>
                Öğrenciler için yarışmalar, etkinlikler ve fırsatlar tek platformda!
              </p>
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-500 fill-mode-forwards opacity-0" style={{ animationDelay: '500ms' }}>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
              {/* Etkinlikler Sütunu */}
              <div>
                <h3 className="mb-8 text-3xl font-bold font-heading featured-events-title">Öne Çıkan Etkinlikler</h3>
                <div className="space-y-6">
                  {events.length === 0 ? (
                    <div className="text-gray-400">Henüz etkinlik bulunmuyor.</div>
                  ) : (
                    events.map(event => (
                      <Link href={`/event/${event.slug}`} key={event.id} className="flex items-start p-4 space-x-4 transition-all duration-300 rounded-lg shadow-sm group bg-white/70 hover:bg-white hover:shadow-md backdrop-blur-sm">
                        <img src={event.cardImage || 'https://placehold.co/100x100/e2e8f0/e2e8f0?text=N'} alt={event.title} className="flex-shrink-0 object-cover w-24 h-24 rounded-md" />
                        <div className="flex-grow">
                          <p className="mb-1 text-sm text-gray-500 flex items-center gap-1"><Calendar size={12} /> {event.date}</p>
                          <h4 className="text-lg font-bold transition-colors text-nuper-dark-blue group-hover:text-nuper-blue">{event.title}</h4>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{event.description}</p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
              {/* Bültenler Sütunu */}
              <div>
                <h3 className="mb-8 text-3xl font-bold font-heading latest-news-title">En Son Bültenler</h3>
                <div className="space-y-6">
                  {bulletins.length === 0 ? (
                    <div className="text-gray-400">Henüz bülten bulunmuyor.</div>
                  ) : (
                    bulletins.map(bulletin => (
                      <Link href={`/bulletin/${bulletin.slug}`} key={bulletin.id} className="flex items-start p-4 space-x-4 transition-all duration-300 rounded-lg shadow-sm group bg-white/70 hover:bg-white hover:shadow-md backdrop-blur-sm">
                        <img src={bulletin.cardImage || 'https://placehold.co/100x100/e2e8f0/e2e8f0?text=N'} alt={bulletin.title} className="flex-shrink-0 object-cover w-24 h-24 rounded-md" />
                        <div className="flex-grow">
                          <h4 className="text-lg font-bold transition-colors text-nuper-dark-blue group-hover:text-nuper-blue flex items-center gap-2"><Newspaper size={16} /> {bulletin.title}</h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {new Date(bulletin.createdAt).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
