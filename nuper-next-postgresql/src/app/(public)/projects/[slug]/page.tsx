import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArsenalToolBySlug, INITIAL_ARSENAL_TOOLS } from '@/lib/arsenalData';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Mail,
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
    <div className="min-h-screen pt-24 pb-24 bg-[#070A11] text-white relative overflow-hidden font-sans selection:bg-amber-500/30">
      {/* 1. Taktik CAD Arka Plan Deseni */}
      <CADPattern colorHex={theme.accentHex} opacity={0.04} />

      <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10 space-y-12">
        {/* Üst Navigasyon & Durum Çubuğu */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-amber-300 transition-colors py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Çözümlerimize Dön</span>
          </Link>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-amber-400 font-bold px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30">
              {project.toolCode}
            </span>
            <span className="text-emerald-400 font-bold px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 hidden sm:inline-block">
              {project.tier}
            </span>
          </div>
        </div>

        {/* 2. ANA MARKA & ÜRÜN KÜNYESİ (HERO SECTION) */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0B0F19] border border-amber-500/30 relative overflow-hidden shadow-2xl">
          {/* Taktik Çerçeve Köşeleri */}
          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-amber-400" />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-amber-400" />
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-amber-500/40" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-amber-500/40" />

          <div className="space-y-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-amber-400 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 uppercase tracking-widest">
                {theme.badgeLabel}
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-400 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-widest flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                OPERASYONEL KALİFİKASYON MOTORU
              </span>
              <span className="text-[11px] font-mono text-gray-500 px-2.5 py-1 rounded bg-white/5 uppercase">
                v1.4 AIR-GAPPED ENTERPRISE
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-white uppercase">
              {project.brandName}
            </h1>

            <p className="text-base sm:text-xl font-mono text-amber-400/90 font-semibold leading-relaxed">
              {project.tagline}
            </p>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed pt-2">
              {project.description}
            </p>
          </div>

          {/* 3 Kolonlu Saha Katma Değeri & ROI Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10 font-mono text-xs">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-gray-500 uppercase block mb-1">TEST HAZIRLIK SÜRESİ:</span>
              <span className="text-sm font-bold text-emerald-400">{project.marketValue.roiImpact}</span>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-gray-500 uppercase block mb-1">KURULUM &amp; ORTAM:</span>
              <span className="text-sm font-bold text-white">{project.marketValue.deploymentTime}</span>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-gray-500 uppercase block mb-1">UYUMLU STANDARTLAR:</span>
              <span className="text-sm font-bold text-amber-300 block">{project.marketValue.compliance}</span>
            </div>
          </div>
        </div>

        {/* 3. İNTERAKTİF 3D CAD GÖRÜNTÜLEYİCİ KONSOLU */}
        {isCitadel && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                  01 // GEOMETRİ DOĞRULAMA
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-heading text-white uppercase">
                  İnteraktif 3D CAD B-Rep Analiz Konsolu
                </h2>
              </div>
              <span className="text-xs font-mono text-gray-500 hidden sm:inline">
                OpenCASCADE B-Rep • Three.js WebGL
              </span>
            </div>

            <CitadelCadViewer />
          </div>
        )}

        {/* 4. DÖRT SÜTUNLU DETERMINİSTİK MİMARİ HATTI */}
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
              02 // SİSTEM İŞLEYİŞİ
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-heading text-white uppercase">
              Uçtan Uca Kalifikasyon Hattı
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sütun 1 */}
            <div className="p-6 rounded-2xl bg-[#0B0F19] border border-white/10 hover:border-amber-500/40 transition-colors space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 font-bold uppercase">AŞAMA 01</span>
                <span className="text-gray-500 text-[10px]">OpenCASCADE B-Rep</span>
              </div>
              <h3 className="text-lg font-bold font-heading text-white uppercase">
                Katı Geometri ve DIN 912 Cıvata Ayrıştırma
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Yüklenen 3D STEP dosyasından net hacim, kütle, ağırlık merkezi (CoG) koordinatları ve montaj flanş delik aralıkları deterministik çözülür. ISO 273 normlarına göre DIN 912 cıvataların ön yük (FM) ve tork reçetesi hazırlanır.
              </p>
            </div>

            {/* Sütun 2 */}
            <div className="p-6 rounded-2xl bg-[#0B0F19] border border-white/10 hover:border-amber-500/40 transition-colors space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 font-bold uppercase">AŞAMA 02</span>
                <span className="text-gray-500 text-[10px]">MIL-STD-810H Metot 514 &amp; 516</span>
              </div>
              <h3 className="text-lg font-bold font-heading text-white uppercase">
                Pre-FEA Sınır Koşulları ve APDL Üretimi
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Kanat altı podu, zırhlı palet veya helikopter görev profili için gereken titreşim PSD spektrumları hesaplanır. Simcenter NX, ANSYS (APDL kod bloku) ve Abaqus simülasyonları için doğrudan aktarılabilir 120-noktalı veri üretilir.
              </p>
            </div>

            {/* Sütun 3 */}
            <div className="p-6 rounded-2xl bg-[#0B0F19] border border-white/10 hover:border-amber-500/40 transition-colors space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 font-bold uppercase">AŞAMA 03</span>
                <span className="text-gray-500 text-[10px]">Rezonans &amp; Çentikleme</span>
              </div>
              <h3 className="text-lg font-bold font-heading text-white uppercase">
                Post-FEA Kapalı Döngü Doğrulama
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Simülasyon çıktıları sisteme aktarılarak ilk mod frekansının sınır şartını (&quot;f1 &gt; 1.2 × f_max&quot;) sağlayıp sağlamadığı denetlenir. Dinamik büyütme (Q), akma emniyet marjı (MS) ve gerekliyse çentikleme derinliği (&Delta;dB) türetilir.
              </p>
            </div>

            {/* Sütun 4 */}
            <div className="p-6 rounded-2xl bg-[#0B0F19] border border-white/10 hover:border-amber-500/40 transition-colors space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 font-bold uppercase">AŞAMA 04</span>
                <span className="text-gray-500 text-[10px]">ReportLab Vektörel PDF</span>
              </div>
              <h3 className="text-lg font-bold font-heading text-white uppercase">
                Resmi Askeri A4 ETP Dokümantasyonu
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Akredite test merkezlerine (TÜBİTAK SAGE, TRTEST) ve ana yükleniciye doğrudan teslim edilmek üzere antetli, revizyonlu, imza bloklu ve grafikli resmi Çevresel Test Planı (ETP) saniyeler içinde A4 PDF formatında oluşturulur.
              </p>
            </div>
          </div>
        </div>

        {/* 5. İNTERAKTİF ŞARTNAME VE MALZEME SİMÜLATÖRÜ */}
        {isCitadel && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                03 // CANLI SİMÜLASYON
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-white uppercase">
                Şartname Parametre Simülatörü
              </h2>
            </div>

            <CitadelSpecSimulator />
          </div>
        )}

        {/* 6. GÜVENLİK VE AIR-GAPPED DOKTRİNİ */}
        <div className="p-8 rounded-2xl bg-[#080C14] border border-white/10 space-y-6 font-mono text-xs">
          <div className="flex items-center gap-3 text-amber-400 pb-3 border-b border-white/10 font-bold">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="text-sm uppercase tracking-wider">
              %100 AIR-GAPPED VE ITAR GÜVENLİK STANDARDI
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-300">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-gray-500 text-[10px] uppercase block">AĞ BAĞLANTISI:</span>
              <span className="text-emerald-400 font-bold block">127.0.0.1 İzolasyonu</span>
              <span className="text-[10px] text-gray-400 block">Dış ağ soketi açılamaz.</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-gray-500 text-[10px] uppercase block">CAD VE GİZLİLİK:</span>
              <span className="text-white font-bold block">Yerel RAM İşleme</span>
              <span className="text-[10px] text-gray-400 block">Buluta veri aktarılmaz.</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-gray-500 text-[10px] uppercase block">LİSANSLAMA:</span>
              <span className="text-amber-300 font-bold block">SHA-256 Donanım İmzası</span>
              <span className="text-[10px] text-gray-400 block">İnternetsiz çevrimdışı lisans.</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-gray-500 text-[10px] uppercase block">YEREL VERİTABANI:</span>
              <span className="text-sky-300 font-bold block">SQLite Kriptolu Depo</span>
              <span className="text-[10px] text-gray-400 block">Tamamen cihazınızda kalır.</span>
            </div>
          </div>
        </div>

        {/* 7. KURUMSAL LİSANS VE BRİFİNG TALEBİ */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0C101A] to-amber-500/5 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 font-mono">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              SAVUNMA YÜKLENİCİLERİ VE TEST EKİPLERİ İÇİN
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-heading text-white uppercase">
              Kurumunuza Özel Brifing veya Değerlendirme Paketi
            </h3>
            <p className="text-xs text-gray-400 max-w-xl font-sans">
              Nuper Citadel&apos;in kuruluşunuzun iç standartlarına uyarlanması, şirket içi şablonların entegrasyonu ve air-gapped deneme lisansı için doğrudan kurucu ofisimizle iletişime geçebilirsiniz.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href="mailto:contact@nuper.industries?subject=Nuper%20Citadel%20Kurumsal%20Değerlendirme%20Lisansı%20Talebi"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#080B11] font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 text-center flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Mail className="w-4 h-4" />
              <span>Değerlendirme Paketi İste</span>
            </a>

            <Link
              href="/projects"
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-colors text-center flex items-center justify-center min-h-[44px]"
            >
              Tüm Çözümler
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
