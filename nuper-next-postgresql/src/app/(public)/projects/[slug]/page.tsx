import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArsenalToolBySlug, INITIAL_ARSENAL_TOOLS } from '@/lib/arsenalData';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Box,
  Sliders,
  Cpu,
  Activity,
  Lock,
  Terminal,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { CADPattern } from '@/components/arsenal/CADPattern';
import { CitadelSpecSimulator } from '@/components/citadel/CitadelSpecSimulator';
import { CitadelCadViewer } from '@/components/citadel/CitadelCadViewer';

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return INITIAL_ARSENAL_TOOLS.map((t) => ({
    slug: t.slug,
  }));
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getArsenalToolBySlug(slug);

  if (!project) {
    notFound();
    return null;
  }

  const isCitadel = project.slug === 'nuper-citadel';
  const theme = project.theme;

  return (
    <div className="min-h-screen bg-[#04070D] text-white relative overflow-hidden font-sans selection:bg-amber-500/30">
      {/* İnce CAD Taktik Izgara */}
      <CADPattern colorHex={theme.accentHex} opacity={0.035} />

      {/* Arka Plan Yumuşak Vurgu Işığı (Apple Ambient Lighting) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-amber-500/10 via-amber-500/2 to-transparent blur-3xl pointer-events-none -z-0" />

      {/* ─── 1. ZARİF ÜST ÇUBUK / NAVİGASYON ──────────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#04070D]/80 border-b border-white/5 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between font-mono text-xs">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors uppercase tracking-wider text-[11px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tüm Çözümler</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] tracking-widest">
              {project.toolCode}
            </span>
            <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] hidden sm:inline-block">
              {project.tier}
            </span>
            <a
              href="#cad-viewer"
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-amber-500 hover:text-black text-gray-300 font-bold transition-all text-[11px]"
            >
              3D Konsol
            </a>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* ─── 2. APPLE-STYLE HERO SECTION (FERAH VE ETKİLEYİCİ) ──────────────── */}
        <section className="pt-20 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-8">
          {/* Üst Rozet Grubu */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-bold tracking-wider uppercase">
            <Terminal className="w-3 h-3 text-amber-400" />
            <span>{theme.badgeLabel}</span>
            <span className="text-white/30">•</span>
            <span className="text-emerald-400">OPERASYONEL v1.4</span>
          </div>

          {/* Dev Başlık & Tipografi */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-heading tracking-tight text-white uppercase leading-[0.95]">
              {project.brandName}
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-heading font-medium text-amber-300/90 max-w-3xl mx-auto leading-snug">
              {project.tagline}
            </p>
          </div>

          {/* Açıklama Paragrafı (Anti-Slop: Doğrudan Mühendislik Gerçeği) */}
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed font-sans font-normal">
            {project.description}
          </p>

          {/* Eylem Butonları */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 font-mono text-xs">
            <a
              href="#cad-viewer"
              className="px-7 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(245,158,11,0.25)] flex items-center gap-2"
            >
              <span>3D Geometriyi İncele</span>
              <ChevronDown className="w-4 h-4" />
            </a>

            <a
              href="#simulator"
              className="px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <span>Parametre Simülatörü</span>
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
            </a>
          </div>

          {/* Apple-Style 4 Sütunlu Temel Metrik Şeridi */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto border-t border-white/10 font-mono text-left">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-500 uppercase block tracking-wider">AĞ İZOLASYONU</span>
              <span className="text-lg font-black text-emerald-400 block">%100 Air-Gapped</span>
              <span className="text-[10px] text-gray-400 block">Sıfır dış ağ bağlantısı</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-500 uppercase block tracking-wider">PSD ÇÖZÜNÜRLÜĞÜ</span>
              <span className="text-lg font-black text-amber-400 block">120 Nokta</span>
              <span className="text-[10px] text-gray-400 block">MIL-STD-810H Metot 514</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-500 uppercase block tracking-wider">HAZIRLIK TASARRUFU</span>
              <span className="text-lg font-black text-white block">%85 Zaman Kazancı</span>
              <span className="text-[10px] text-gray-400 block">Test planı saniyeler içinde</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-500 uppercase block tracking-wider">CIVATA ÇÖZÜMLEME</span>
              <span className="text-lg font-black text-sky-400 block">DIN 912 Normu</span>
              <span className="text-[10px] text-gray-400 block">ISO 273 tork ve ön yük</span>
            </div>
          </div>
        </section>

        {/* ─── 3. MERKEZ SAHNE: İNTERAKTİF 3D CAD B-REP GÖRÜNTÜLEYİCİ ─────────── */}
        {isCitadel && (
          <section id="cad-viewer" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-16 space-y-6">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                01 // GEOMETRİ DOĞRULAMA
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-white uppercase tracking-tight">
                Görünmeyen gerilmeleri yüzeye çıkarın.
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
                OpenCASCADE B-Rep çekirdeği ile 3D STEP geometrisi deterministik olarak çözülür. Katı model, tel kafes veya FEA von Mises gerilme haritası modları arasında geçiş yaparak yapıyı anında analiz edin.
              </p>
            </div>

            {/* 3D Model Görüntüleyici Kapsayıcısı */}
            <div className="p-1 sm:p-2 rounded-3xl bg-gradient-to-b from-amber-500/20 via-white/5 to-transparent border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.08)]">
              <CitadelCadViewer />
            </div>
          </section>
        )}

        {/* ─── 4. DÖRT AŞAMALI UÇTAN UCA AKIŞ (APPLE BÜYÜK KART DÜZENİ) ───────── */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
          <div className="space-y-3 text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
              02 // SİSTEM İŞLEYİŞİ
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-white uppercase tracking-tight">
              Dört Aşamalı Deterministik Hat.
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
              Tahmin yok, kara kutu yok. Geometriden akredite test raporuna kadar her adım doğrulanabilir mühendislik prensipleriyle çalışır.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Aşama 01 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#080C14] border border-white/10 hover:border-amber-500/40 transition-all duration-300 space-y-5 relative overflow-hidden group">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 uppercase tracking-widest">
                  AŞAMA 01
                </span>
                <span className="text-gray-500">OpenCASCADE B-Rep</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white uppercase tracking-tight">
                Katı Geometri ve DIN 912 Cıvata Ayrıştırma
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans">
                Yüklenen 3D STEP dosyasından net hacim, kütle, ağırlık merkezi (CoG) koordinatları ve montaj flanş delik aralıkları deterministik çözülür. ISO 273 normlarına göre DIN 912 cıvataların ön yük (FM) ve tork reçetesi hazırlanır.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AS9100 Kalite Standartları ile Tam Uyum</span>
              </div>
            </div>

            {/* Aşama 02 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#080C14] border border-white/10 hover:border-amber-500/40 transition-all duration-300 space-y-5 relative overflow-hidden group">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 uppercase tracking-widest">
                  AŞAMA 02
                </span>
                <span className="text-gray-500">MIL-STD-810H &amp; DO-160G</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white uppercase tracking-tight">
                Pre-FEA Sınır Koşulları ve APDL Üretimi
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans">
                Kanat altı podu, zırhlı palet veya helikopter görev profili için gereken titreşim PSD spektrumları hesaplanır. Simcenter NX, ANSYS (APDL kod bloku) ve Abaqus simülasyonları için doğrudan aktarılabilir 120-noktalı veri üretilir.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-amber-400">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>ANSYS Mechanical APDL Kod Betiği Çıktısı</span>
              </div>
            </div>

            {/* Aşama 03 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#080C14] border border-white/10 hover:border-amber-500/40 transition-all duration-300 space-y-5 relative overflow-hidden group">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 uppercase tracking-widest">
                  AŞAMA 03
                </span>
                <span className="text-gray-500">Rezonans Eşiği</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white uppercase tracking-tight">
                Post-FEA Kapalı Döngü Doğrulama
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans">
                Simülasyon çıktıları sisteme aktarılarak ilk mod frekansının sınır şartını (&quot;f1 &gt; 1.2 × f_max&quot;) sağlayıp sağlamadığı denetlenir. Dinamik büyütme (Q), akma emniyet marjı (MS) ve gerekliyse çentikleme derinliği (&Delta;dB) türetilir.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-sky-400">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>Rezonans Kaçınma ve Çentikleme Algoritması</span>
              </div>
            </div>

            {/* Aşama 04 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#080C14] border border-white/10 hover:border-amber-500/40 transition-all duration-300 space-y-5 relative overflow-hidden group">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 uppercase tracking-widest">
                  AŞAMA 04
                </span>
                <span className="text-gray-500">ReportLab A4 Engine</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white uppercase tracking-tight">
                Resmi Askeri A4 ETP Dokümantasyonu
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans">
                Akredite test merkezlerine (TÜBİTAK SAGE, TRTEST) ve ana yükleniciye doğrudan teslim edilmek üzere antetli, revizyonlu, imza bloklu ve grafikli resmi Çevresel Test Planı (ETP) saniyeler içinde A4 PDF formatında oluşturulur.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Denetime Hazır Resmi Akreditasyon Formatı</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 5. CANLI LABORATUVAR: İNTERAKTİF SİMÜLATÖR SAHNESİ ───────────── */}
        {isCitadel && (
          <section id="simulator" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-16 space-y-6">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                03 // CANLI SİMÜLATÖR
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-white uppercase tracking-tight">
                Platform ve metalurji seçimi. Anlık sonuçlar.
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
                Kanat altı podu, zırhlı palet veya helikopter profili seçin; Al 6061 veya Ti-6Al-4V metalurjisiyle rezonans sınırlarını ve APDL kodunu canlı türetin.
              </p>
            </div>

            <div className="p-1 sm:p-2 rounded-3xl bg-gradient-to-b from-white/5 via-white/[0.02] to-transparent border border-white/10 shadow-2xl">
              <CitadelSpecSimulator />
            </div>
          </section>
        )}

        {/* ─── 6. EGEMENLİK VE %100 AIR-GAPPED GÜVENLİK DOKTRİNİ ──────────────── */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
              04 // MİLLİ GÜVENLİK
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-white uppercase tracking-tight">
              Sıfır Bulut. Sıfır Veri Sızıntısı.
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
              Gizli projeleriniz hiçbir bulut sunucusuna dokunmaz. Nuper Citadel, savunma yüklenicilerinin kapalı laboratuvar standartlarına göre sıfırdan air-gapped olarak inşa edilmiştir.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-6 rounded-2xl bg-[#080C14] border border-white/10 space-y-3 hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-[10px] uppercase block tracking-wider">AĞ İZOLASYONU</span>
                <span className="text-white font-bold text-sm block">127.0.0.1 Soketi</span>
                <span className="text-gray-400 text-[11px] block leading-relaxed font-sans">
                  Sistem dış ağa kapalıdır; hiçbir telemetri veya analiz paketi dışarıya sızamaz.
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#080C14] border border-white/10 space-y-3 hover:border-amber-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-[10px] uppercase block tracking-wider">BELLEK İŞLEME</span>
                <span className="text-white font-bold text-sm block">Yerel RAM İşleme</span>
                <span className="text-gray-400 text-[11px] block leading-relaxed font-sans">
                  CAD geometrisi geçici dosyaya dökülmez, sadece yerel RAM üzerinde çözümlenir.
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#080C14] border border-white/10 space-y-3 hover:border-sky-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-[10px] uppercase block tracking-wider">LİSANSLAMA</span>
                <span className="text-white font-bold text-sm block">SHA-256 Donanım İmzası</span>
                <span className="text-gray-400 text-[11px] block leading-relaxed font-sans">
                  İnternetsiz USB donanım anahtarı ve cihaz parmak iziyle çevrimdışı aktivasyon.
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#080C14] border border-white/10 space-y-3 hover:border-purple-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Box className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-[10px] uppercase block tracking-wider">VERİTABANI</span>
                <span className="text-white font-bold text-sm block">Kriptolu SQLite Deposu</span>
                <span className="text-gray-400 text-[11px] block leading-relaxed font-sans">
                  Projeler ve kalifikasyon raporları yerel diskinizde şifreli olarak barınır.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 7. APPLE-STYLE GRAND FINALE / KURUMSAL TALEP KARTI ─────────────── */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-b from-[#0B0F19] to-[#060911] border border-amber-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
            {/* Vurgu Çerçeve Detayları */}
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-400" />

            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                SAVUNMA SANAYİİ VE TEST LABORATUVARLARI İÇİN
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-white uppercase tracking-tight">
                Havacılık test süreçlerinizi hızlandırmaya hazır mısınız?
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
                Nuper Citadel&apos;in kuruluşunuzun iç standartlarına uyarlanması, kurum içi şablonların entegrasyonu ve air-gapped deneme lisansı için doğrudan kurucu ofisimizle iletişime geçebilirsiniz.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 font-mono text-xs">
              <a
                href="mailto:contact@nuper.industries?subject=Nuper%20Citadel%20Kurumsal%20Değerlendirme%20Lisansı%20Talebi"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Mail className="w-4 h-4" />
                <span>Değerlendirme Paketi İste</span>
              </a>

              <Link
                href="/projects"
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-wider transition-colors flex items-center justify-center min-h-[48px]"
              >
                <span>Tüm Çözümlerimiz</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
