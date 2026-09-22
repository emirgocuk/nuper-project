import Link from 'next/link';
import SpaceHero from '@/components/SpaceHero';
import HowItWorks from '@/components/HowItWorks';
import { NuperAiTerminal } from '@/components/brand/NuperAiTerminal';
import { ArrowRight, Terminal, Compass } from 'lucide-react';

export default async function Home() {

  return (
    <main className="min-h-screen bg-[#080B11] text-white selection:bg-sky-500/30 font-sans">
      {/* 1. HERO BÖLÜMÜ: MONUMENTAL TİPOGRAFİ VE TAKTİK SAHA */}
      <section id="home" className="relative flex items-center min-h-[92vh] overflow-hidden pt-28 pb-20">
        <SpaceHero />
        
        <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Sol Anlatım Sütunu */}
            <div className="text-center lg:text-left lg:col-span-7">
              {/* Egemen Başlık */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight font-heading text-white">
                EGEMEN AZINLIKLAR ÇAĞI.
                <span className="block mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-400">
                  BİRİNCİ PRENSİPLERLE DERİN TEKNOLOJİ.
                </span>
              </h1>

              {/* Kurucu Doktrin Metni */}
              <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
                Ezberlenmiş kalıpların ve yapay zeka sıradanlığının ötesinde; birinci prensiplerden türetilen yerli problem tespiti ve doğrudan sahaya inen mühendislik yaklaşımıyla geliştirilmiş bağımsız sistemler ve modüler mühendislik cephaneliği.
              </p>

              {/* Taktik Aksiyon Butonları */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/projects" 
                  className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold tracking-wider uppercase transition-all duration-200 bg-white text-[#080B11] hover:bg-gray-200 rounded font-heading min-h-[44px]"
                >
                  <Terminal className="w-4 h-4 mr-2 text-[#080B11]" />
                  Çözümlerimizi İncele
                </Link>
                <Link 
                  href="#manifesto" 
                  className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold tracking-wider uppercase transition-all duration-200 bg-[#0C101A] text-white border border-white/20 hover:border-sky-400 hover:text-sky-300 rounded font-heading group min-h-[44px]"
                >
                  Biz Kimiz <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1 text-sky-400" />
                </Link>
              </div>
            </div>

            {/* Sağ Taktik Komuta Paneli (Nuper Sentinel AI Aktif Ekranı) */}
            <div className="hidden lg:block lg:col-span-5">
              <NuperAiTerminal />
            </div>
          </div>
        </div>
      </section>

      {/* 2. BÖLÜM: BİZİ ANLATAN BÖLÜM (HAKKIMIZDA // DOKTRİN) */}
      <section id="manifesto" className="relative py-28 bg-[#06080D] border-t border-b border-white/10 overflow-hidden">
        {/* Arka plan ızgara vurgusu */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10 space-y-20">
          {/* Bölüm Başlığı */}
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono uppercase tracking-widest bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded mb-4">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              BİZ KİMİZ
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-white uppercase leading-[1.08]">
              SAHAYA, MÜHENDİSLİĞE VE FİZİK KURALLARINA ODAKLIYIZ.
            </h2>
            <p className="mt-6 text-lg sm:text-xl text-gray-300 leading-relaxed font-sans">
              Zaman kaybettiren süreçlerin ve ezberlerin ötesinde; işini en iyi yapan, modern teknolojiler ve yapay zeka ile yüksek kaldıraç kazanan çevik mühendislik ekipleri fark yaratır. Nuper, derin teknoloji ve yüksek katma değerli üretimi yerinde ve tavizsiz bir disiplinle hayata geçirir.
            </p>
          </div>

          {/* 3 Büyük Anlatım Bloğu (Büyük Başlıklar ve Derin İçerik) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Blok 1 */}
            <div className="p-8 rounded-xl bg-[#0C101A] border border-white/10 hover:border-sky-500/40 transition-colors flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-sky-400 tracking-widest uppercase block mb-3">
                  01 // İSİM VE KÖKEN
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-heading text-white uppercase leading-snug mb-4">
                  LATİNCE &apos;YENİ&apos;, TAVIR OLARAK &apos;ÖZGÜN&apos;.
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Nuper, doğrudan Latince bir sözcüktür: taze, yeni, az önce doğmuş. Biz sıradan danışmanlık sloganlarını geride bıraktık; doğrudan sahada çalışan, üreten ve yüksek katma değer yaratan bir mühendislik iradesiyiz.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 text-xs font-mono text-gray-500">
                KÖKEN: LATİNCE NOVUS &bull; CREARE
              </div>
            </div>

            {/* Blok 2 */}
            <div className="p-8 rounded-xl bg-[#0C101A] border border-white/10 hover:border-sky-500/40 transition-colors flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase block mb-3">
                  02 // DÜŞ MÜHENDİSLİĞİ
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-heading text-white uppercase leading-snug mb-4">
                  KRİTİK DARBOĞAZLAR VE DOĞRUDAN ÇÖZÜM.
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Büyük sistemlerin başarısı, sahadaki mühendisin ve üreticinin önünü tıkayan en kritik darboğazı doğrudan çözmekte yatar. Zaman kaybettiren süreçlere girmeden, doğrudan ihtiyacın kalbine odaklanan zekice yazılım ve algoritmalarla mühendislik verimliliğini katbekat artırıyoruz.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 text-xs font-mono text-gray-500">
                METOD: BİRİNCİ PRENSİPLER &bull; SAHA ODAKLI ÇÖZÜM
              </div>
            </div>

            {/* Blok 3 */}
            <div className="p-8 rounded-xl bg-[#0C101A] border border-white/10 hover:border-sky-500/40 transition-colors flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 tracking-widest uppercase block mb-3">
                  03 // ÇİFT BEYİNLİ ÜRETİM
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-heading text-white uppercase leading-snug mb-4">
                  SAĞ BEYİNLE DÜŞLE, SOL BEYİNLE HASSAS KODLA.
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Fikir aşamasında hiçbir tabuyu tanımayan sınırsız yaratıcı düşünce, imalat ve kodlama aşamasında AS9100 askeri toleransında tavizsiz bir disiplinle buluşur. Deterministik, hatasız ve dış bağımlılığı sıfıra indirilmiş kod üretiriz.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 text-xs font-mono text-gray-500">
                DOKTRİN: BICAMERAL ENGINEERING &bull; MIL-STD
              </div>
            </div>
          </div>

          {/* Büyük İfade Alıntısı */}
          <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-sky-500/10 via-[#0C101A] to-emerald-500/10 border border-white/10 text-center max-w-4xl mx-auto">
            <span className="text-xs font-mono text-sky-400 tracking-widest uppercase block mb-2">
              DÜŞ MÜHENDİSLİĞİ İLKESİ
            </span>
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-white uppercase leading-tight">
              &ldquo;Tarih, olmaz diyen uzmanların enkazı üzerinde, ya olursa? diyen düş mühendislerinin zaferleriyle yazılmıştır.&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* 3. BÖLÜM: ÜRETİM DOKTRİNİ VE SACAYAKLARI */}
      <div id="pillars" className="relative z-20 bg-[#080B11]">
        <HowItWorks />
      </div>
    </main>
  );
}
