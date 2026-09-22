import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArsenalToolBySlug, INITIAL_ARSENAL_TOOLS } from '@/lib/arsenalData';
import { ArrowLeft, CheckCircle2, Shield, Cpu, TrendingUp, Layers, Mail, Terminal, ExternalLink } from 'lucide-react';

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
  }

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#080B11] text-white relative overflow-hidden font-sans selection:bg-sky-500/30">
      {/* Taktik Mühendislik Izgarası */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10 space-y-12">
        {/* Üst Geri Dönüş Butonu */}
        <div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-sky-300 transition-colors py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Çözümlerimize Dön</span>
          </Link>
        </div>

        {/* 1. MARKA BAŞLIK BÖLÜMÜ */}
        <div className="p-8 sm:p-12 rounded-2xl bg-[#0C101A] border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-sky-400" />
          <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-sky-400" />

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-mono font-bold text-sky-400 px-3 py-1 rounded bg-sky-500/10 border border-sky-500/20 uppercase tracking-widest">
              {project.toolCode}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              OPERASYONEL // BİTMİŞ SİSTEM
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-white uppercase mb-3">
            {project.brandName}
          </h1>
          <p className="text-lg sm:text-xl font-mono text-sky-300/90 mb-6">
            {project.tagline}
          </p>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl">
            {project.description}
          </p>

          {/* Yatırım & Katma Değer Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#080B11] border border-white/10">
              <span className="text-[10px] text-gray-500 uppercase block mb-1">SAHA KAZANCI / ROI:</span>
              <span className="text-sm font-bold text-emerald-400">{project.marketValue.roiImpact}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#080B11] border border-white/10">
              <span className="text-[10px] text-gray-500 uppercase block mb-1">ENTEGRASYON SÜRESİ:</span>
              <span className="text-sm font-bold text-sky-300">{project.marketValue.deploymentTime}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#080B11] border border-white/10">
              <span className="text-[10px] text-gray-500 uppercase block mb-1">STANDART PROTOKOLÜ:</span>
              <span className="text-sm font-bold text-amber-300 truncate block">{project.marketValue.compliance}</span>
            </div>
          </div>
        </div>

        {/* 2. SİSTEM ÖZELLİKLERİ VE TASLAK ÇALIŞMA ALANI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sol: Kabiliyetler */}
          <div className="md:col-span-2 p-8 rounded-2xl bg-[#0C101A] border border-white/10 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">
                KABİLİYET MATRİSİ
              </span>
              <h3 className="text-2xl font-bold font-heading text-white uppercase">
                Temel Mimari Özellikleri
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {project.capabilities.map((cap, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-gray-200 leading-relaxed">{cap}</span>
                </div>
              ))}
            </div>

            {/* Taslak Bildirim Kutusu */}
            <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/20 text-xs font-mono text-gray-400 space-y-2">
              <span className="text-sky-400 font-bold uppercase block">
                [PROJE SAYFASI TASLAĞI]
              </span>
              <p>
                Bu sayfa her projenin bağımsız bir marka olarak sunulması için oluşturulmuş ilk taslak şablonudur. Bir sonraki adımda projeye özel derin interaktif konsol, CAD görüntüleyici ve şartname test motoru burada tasarlanacaktır.
              </p>
            </div>
          </div>

          {/* Sağ: Dağıtım & Yatırımcı Bilgisi */}
          <div className="p-8 rounded-2xl bg-[#0C101A] border border-white/10 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-2">
                DAĞITIM SINIFI
              </span>
              <h4 className="text-lg font-bold font-mono text-white uppercase mb-4">
                {project.tier}
              </h4>

              <div className="space-y-3 text-xs font-mono text-gray-300">
                <div className="pb-2 border-b border-white/5">
                  <span className="text-gray-500 block text-[10px]">HEDEF KULLANICI:</span>
                  <span className="font-semibold text-white">{project.targetAudience}</span>
                </div>
                <div className="pb-2 border-b border-white/5">
                  <span className="text-gray-500 block text-[10px]">GÜVENLİK MODELİ:</span>
                  <span className="text-emerald-400 font-semibold">Air-Gapped &amp; Yerel Dağıtım</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">DURUM:</span>
                  <span className="text-sky-400 font-semibold">Sahada Doğrulanmış</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-3">
              <a
                href={`mailto:contact@nuper.industries?subject=${encodeURIComponent(project.brandName + ' Brifing ve Lisans Talebi')}`}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-[#080B11] font-mono text-xs font-bold uppercase tracking-wider transition-colors min-h-[44px]"
              >
                <Mail className="w-4 h-4" />
                <span>Brifing Talep Et</span>
              </a>
              <Link
                href="/projects"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs uppercase tracking-wider transition-colors min-h-[44px]"
              >
                <span>Tüm Envanter</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
