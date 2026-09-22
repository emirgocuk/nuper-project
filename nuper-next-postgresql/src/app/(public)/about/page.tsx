'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { NuperLogo } from '@/components/brand/NuperLogo';
import {
  Brain,
  Sparkles,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Crosshair,
  ArrowRight,
  ArrowDown,
  Target,
  Clock,
  Compass,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Activity,
  Maximize2,
  Workflow,
  Radio,
  FileCheck2,
  Gauge,
  CornerDownRight,
  Check
} from 'lucide-react';

export default function AboutPage() {
  const [selectedBarometerPath, setSelectedBarometerPath] = useState<number>(2);

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#080B11] text-white relative overflow-hidden font-sans selection:bg-sky-500/30">
      {/* Taktik Grid ve Arka Plan Ambient Işıkları */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-[60%] left-1/3 w-[600px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10 space-y-24">
        {/* ========================================================================= */}
        {/* 1. HERO BÖLÜMÜ: MARKA ÖZÜ VE KİMLİK BLUEPRINT */}
        {/* ========================================================================= */}
        <div className="border-b border-white/10 pb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono uppercase tracking-widest bg-sky-500/10 border border-sky-500/30 text-sky-400 rounded-lg mb-6">
            <Compass className="w-4 h-4 text-sky-400 animate-spin-slow" />
            <span>BİZ KİMİZ // MARKA MİMARİSİ VE DÜŞ MÜHENDİSLİĞİ</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading tracking-tight text-white uppercase leading-[1.04] max-w-5xl">
            SÖZLERİN DEĞİL, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-emerald-300 to-indigo-300">
              ŞEKİLLERİN VE MODELLERİN
            </span>{' '}
            MÜHENDİSLİĞİ.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl leading-relaxed">
            Hantal kurumsal yapıların ve yapay zeka sıradanlığının ötesinde; birinci prensiplerle tasarlanan, sahada çalışan bağımsız sistemler ve derin mühendislik doktrini.
          </p>

          {/* 4 Temel Metrik Kartı (HUD Göstergeleri) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="p-4 rounded-xl bg-[#0C101A] border border-white/10 border-l-4 border-l-sky-400">
              <span className="text-[10px] font-mono text-gray-500 block uppercase tracking-wider">İSİM KÖKENİ</span>
              <span className="text-base font-bold text-white font-mono block mt-1">LATİNCE &ldquo;NUPER&rdquo;</span>
              <span className="text-xs text-sky-400 mt-1 block font-mono">Taze • Yeni • Baş Eğmez</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0C101A] border border-white/10 border-l-4 border-l-indigo-400">
              <span className="text-[10px] font-mono text-gray-500 block uppercase tracking-wider">ZİHİNSEL MODEL</span>
              <span className="text-base font-bold text-white font-mono block mt-1">BİCAMERAL CORE</span>
              <span className="text-xs text-indigo-400 mt-1 block font-mono">Sağ Beyin ⟷ Sol Beyin</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0C101A] border border-white/10 border-l-4 border-l-emerald-400">
              <span className="text-[10px] font-mono text-gray-500 block uppercase tracking-wider">DEĞER FORMÜLÜ</span>
              <span className="text-base font-bold text-white font-mono block mt-1">BİLGİ × HAYALGÜCÜ</span>
              <span className="text-xs text-emerald-400 mt-1 block font-mono">Doğrudan Çözüm Katkısı</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0C101A] border border-white/10 border-l-4 border-l-amber-400">
              <span className="text-[10px] font-mono text-gray-500 block uppercase tracking-wider">ÇIKTI PRENSİBİ</span>
              <span className="text-base font-bold text-white font-mono block mt-1">MISSION VERIFIED</span>
              <span className="text-xs text-amber-400 mt-1 block font-mono">AS9100 / MIL-STD Onaylı</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SIRALI VE ENTEGRE DOKTRİN HATTI (BİZİ ANLATAN 4 AŞAMALI YOLCULUK) */}
        {/* ========================================================================= */}
        <div className="space-y-12">
          {/* Giriş Başlığı */}
          <div className="border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 font-mono text-xs uppercase tracking-widest mb-3">
                <Workflow className="w-3.5 h-3.5" />
                <span>NUPER İCRA PROTOKOLÜ // KONSEPTTEN SAHAYA</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black font-heading text-white uppercase tracking-tight">
                BİZ NASIL DÜŞÜNÜR VE ÜRETİRİZ?
              </h2>
              <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-3xl">
                Nuper rastgele kod yazan bir yazılım evi değildir. Her bir çözümümüz, zihinden filtreye, problem çözmeden kullanıcı hissiyatına kadar birbirine bağlı 4 aşamalı deterministik bir hat üzerinden akar.
              </p>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs text-gray-400 bg-[#0C101A] px-4 py-2 rounded-lg border border-white/10 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>4 AŞAMA TAM ENTEGRE</span>
            </div>
          </div>

          {/* DİKEY BAĞLANTILI HAT KONTEYNERİ */}
          <div className="space-y-12 relative">
            
            {/* --------------------------------------------------------------------- */}
            {/* AŞAMA 01: ÇİFT BEYİN MİMARİSİ (BICAMERAL CORE) */}
            {/* --------------------------------------------------------------------- */}
            <div className="p-6 sm:p-10 rounded-2xl bg-[#090D16] border border-sky-500/30 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-sky-500/10 border-b border-l border-sky-500/30 text-sky-400 font-mono text-xs uppercase tracking-widest font-bold">
                AŞAMA 01 // ZİHİNSEL YAPI
              </div>

              <div className="max-w-3xl mb-8">
                <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-1">
                  NASIL DÜŞÜNÜRÜZ?
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-heading text-white uppercase tracking-tight">
                  Çift-Çekirdekli Mühendislik (Bicameral Core)
                </h3>
                <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                  Savunma sanayii aşırı sol beyin tutuculuğuna (denenmemişe direnç, tek bir doğru saplantısı) kilitlenmiştir. Nuper ise iki yarımküreyi aynı anda tam kapasiteyle çalıştırır:
                </p>
              </div>

              {/* 3 Sütunlu Görsel Bağlantı Şeması */}
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-stretch">
                {/* Sol Sütun: Sağ Beyin */}
                <div className="md:col-span-4 p-6 rounded-xl bg-sky-500/10 border border-sky-500/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="p-2.5 rounded-lg bg-sky-500/20 text-sky-400">
                        <Sparkles className="w-5 h-5" />
                      </span>
                      <span className="text-[10px] font-mono text-sky-400 px-2 py-0.5 rounded border border-sky-400/30 uppercase">
                        KAŞİF &amp; VİZYON
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white font-mono uppercase mb-2">
                      SAĞ BEYİN (AYRIŞAN ZİHİN)
                    </h4>
                    <p className="text-xs text-sky-200/80 mb-3 font-mono">
                      Ezber bozan hipotezler, tabuları reddetme ve büyük düşler.
                    </p>
                    <ul className="space-y-2 text-xs text-gray-300 font-mono">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        Tabuları reddeden yaratıcı hipotez
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        Birinci Prensiplerle (First Principles) düşünme
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        Edward de Bono &ldquo;PO&rdquo; kışkırtması
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        Kritik darboğazı sahada saptama
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-sky-500/20 text-[11px] font-mono text-sky-300 font-bold">
                    MOD: &ldquo;İLK FİKİR AŞAMASINDA SINIRSIZ DÜŞLE&rdquo;
                  </div>
                </div>

                {/* Merkez Köprü: Nuper Sentez Çekirdeği */}
                <div className="md:col-span-3 p-6 rounded-xl bg-[#0C1220] border-2 border-dashed border-sky-400/40 flex flex-col items-center justify-center text-center relative shadow-[inset_0_0_20px_rgba(56,189,248,0.1)]">
                  <NuperLogo size={46} showText={false} variant="nexus" centerCore="eye" className="text-white mb-3" />
                  <span className="text-xs font-mono font-bold uppercase text-white tracking-widest">
                    NUPER SENTEZ HATTI
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 mt-1 block font-bold">
                    AHA! BULUŞ NOKTASI
                  </span>
                  <div className="my-3 px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-gray-200">
                    Hassas Bilgi × Hayalgücü
                  </div>
                  <p className="text-[11px] text-gray-400 leading-snug">
                    Ham vizyonun deterministik yazılıma ve modüler cephaneliğe bağlandığı köprü.
                  </p>
                </div>

                {/* Sağ Sütun: Sol Beyin */}
                <div className="md:col-span-4 p-6 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                        <Cpu className="w-5 h-5" />
                      </span>
                      <span className="text-[10px] font-mono text-indigo-400 px-2 py-0.5 rounded border border-indigo-400/30 uppercase">
                        MÜHENDİS &amp; DENETÇİ
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white font-mono uppercase mb-2">
                      SOL BEYİN (DETERMİNİSTİK)
                    </h4>
                    <p className="text-xs text-indigo-200/80 mb-3 font-mono">
                      Askeri toleranslar, sıfır hata ve deterministik kod.
                    </p>
                    <ul className="space-y-2 text-xs text-gray-300 font-mono">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        AS9100 / MIL-STD standartları
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        Sıfır hata ve deterministik kod tabanı
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        Air-gapped izole yerel GPU mimarisi
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        Sahada doğrulanmış görev başarısı
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-indigo-500/20 text-[11px] font-mono text-indigo-300 font-bold">
                    MOD: &ldquo;İMALAT VE KODLAMADA SIFIR TAVİZ&rdquo;
                  </div>
                </div>
              </div>
            </div>

            {/* AKIŞ BAĞLANTI BANDI (CONDUIT PIPELINE) */}
            <div className="flex flex-col items-center justify-center my-6">
              <div className="w-px h-8 bg-gradient-to-b from-sky-400 to-emerald-400" />
              <div className="px-4 py-1 rounded-full bg-[#0C101A] border border-white/10 text-[10px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-2 shadow-lg">
                <ArrowDown className="w-3 h-3 text-emerald-400 animate-bounce" />
                <span>KONSEPT ONAYLANDI // ÜRÜN SÜZGECİNE AKTARILIYOR</span>
              </div>
              <div className="w-px h-8 bg-gradient-to-b from-emerald-400 to-emerald-500" />
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* AŞAMA 02: FERİDUN HÜREL ÜRÜN FİLTRESİ & PEDRICK KALKANI */}
            {/* --------------------------------------------------------------------- */}
            <div className="p-6 sm:p-10 rounded-2xl bg-[#090D16] border border-emerald-500/30 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-emerald-500/10 border-b border-l border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase tracking-widest font-bold">
                AŞAMA 02 // ÜRÜN SÜZGECİ
              </div>

              <div className="max-w-3xl mb-8">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                  NEYİ İNŞA EDERİZ?
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-heading text-white uppercase tracking-tight">
                  Feridun Hürel Üçgeni &amp; Pedrick Tuzağı Kalkanı
                </h3>
                <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                  Nuper bünyesinde geliştirilen hiçbir mikro-SaaS veya algoritma rastgele kodlanmaz. Gerçek inovasyon salt marjinallik değil; şu 3 parametrenin tam kesişimidir:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Yeni Olma */}
                <div className="p-6 rounded-xl bg-[#0C101A] border border-sky-500/30 flex flex-col justify-between hover:border-sky-400 transition-colors">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-mono font-bold text-lg mb-4">
                      01
                    </div>
                    <h4 className="text-lg font-bold font-mono text-white uppercase mb-2">YENİ OLMA</h4>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      Piyasadaki standart şablonların ve generic yapay zeka arayüzlerinin bir kopyası olmamak. Sektör ezberlerini bozan, özgün ve asimetrik bir yaklaşım getirmek.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-white/5 text-[10px] font-mono text-sky-400 uppercase font-bold">
                    KRİTER: RADİKAL FARKLILIK
                  </div>
                </div>

                {/* 2. Yararlı Olma */}
                <div className="p-6 rounded-xl bg-[#0C101A] border border-emerald-500/30 flex flex-col justify-between hover:border-emerald-400 transition-colors">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-bold text-lg mb-4">
                      02
                    </div>
                    <h4 className="text-lg font-bold font-mono text-white uppercase mb-2">YARARLI OLMA</h4>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      Savunma sanayiinde veya makine imalatında çalışan bir mühendisin mesaisini saatlerce çalan acil ve spesifik bir darboğazı doğrudan çözmek.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-white/5 text-[10px] font-mono text-emerald-400 uppercase font-bold">
                    KRİTER: SAHA DEĞERİ
                  </div>
                </div>

                {/* 3. Uygulanabilir Olma */}
                <div className="p-6 rounded-xl bg-[#0C101A] border border-amber-500/30 flex flex-col justify-between hover:border-amber-400 transition-colors">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono font-bold text-lg mb-4">
                      03
                    </div>
                    <h4 className="text-lg font-bold font-mono text-white uppercase mb-2">UYGULANABİLİR OLMA</h4>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      Salt bir hayal olarak kalmayan; bugünün sunucularında, GPU çiplerinde ve yerel donanımlarında deterministik olarak çalışan ve ticarileşebilen sistemler.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-white/5 text-[10px] font-mono text-amber-400 uppercase font-bold">
                    KRİTER: TİCARİ VE TEKNİK GERÇEKLİK
                  </div>
                </div>
              </div>

              {/* Arthur Pedrick Karşılaştırma Bandı */}
              <div className="mt-6 p-5 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-red-400 shrink-0" />
                  <div>
                    <span className="text-xs font-mono font-bold text-red-300 uppercase">
                      ARTHUR PEDRICK TUZAĞINA DÜŞMEME İLKESİ
                    </span>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Tarihte 162 patent alıp sıfır satış yapan Pedrick gibi &ldquo;marjinal ama işlevsiz&rdquo; oyuncaklar yapmıyoruz. Nuper, doğrudan sahaya inen çözümler üretir.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded uppercase shrink-0">
                  KESİŞİM: %100 SAHA UYGUNLUĞU
                </span>
              </div>
            </div>

            {/* AKIŞ BAĞLANTI BANDI (CONDUIT PIPELINE) */}
            <div className="flex flex-col items-center justify-center my-6">
              <div className="w-px h-8 bg-gradient-to-b from-emerald-400 to-indigo-400" />
              <div className="px-4 py-1 rounded-full bg-[#0C101A] border border-white/10 text-[10px] font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-2 shadow-lg">
                <ArrowDown className="w-3 h-3 text-indigo-400 animate-bounce" />
                <span>ŞARTLAR SAĞLANDI // ÇÖZÜM MATRİSİNE AKTARILIYOR</span>
              </div>
              <div className="w-px h-8 bg-gradient-to-b from-indigo-400 to-indigo-500" />
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* AŞAMA 03: BAROMETRE DOKTRİNİ (3 FARKLI ÇÖZÜM YOLU) */}
            {/* --------------------------------------------------------------------- */}
            <div className="p-6 sm:p-10 rounded-2xl bg-[#090D16] border border-indigo-500/30 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-indigo-500/10 border-b border-l border-indigo-500/30 text-indigo-400 font-mono text-xs uppercase tracking-widest font-bold">
                AŞAMA 03 // ÇÖZÜM MÜHENDİSLİĞİ
              </div>

              <div className="max-w-3xl mb-8">
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest block mb-1">
                  ZORLUKLARI NASIL AŞARIZ?
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-heading text-white uppercase tracking-tight">
                  Barometre Doktrini: Tek Bir Doğruya Mahkûm Olmama
                </h3>
                <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                  Onur Yanık&apos;ın kitabındaki meşhur barometre vakasında olduğu gibi: Nuper&apos;de karşılaşılan her zorlu problem için tek bir cevaba kilitlenilmez. En az 3 farklı eksenden çözüm masaya konur:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 0,
                    title: '1. Doğrudan Analitik Yol',
                    sub: 'Klasik Formül Çözümü',
                    desc: 'Problemi bilinen teorik formüllerle çözmek (Serbest düşme formülüyle binanın boyunu hesaplamak). Güvenli ama herkesin bildiği yol.',
                    tag: 'STANDART YOL',
                    color: 'border-sky-500/40 text-sky-400',
                  },
                  {
                    id: 1,
                    title: '2. Fiziksel / Deneysel Yol',
                    sub: 'Malzeme ve Sensör Hilesi',
                    desc: 'Barometrenin ucuna uzun ip bağlayıp çatıdan caddeye sarkıtmak. Formülü zorlamak yerine fiziksel araçla kestirmeden sonuca gitmek.',
                    tag: 'PRATİK MÜHENDİSLİK',
                    color: 'border-emerald-500/40 text-emerald-400',
                  },
                  {
                    id: 2,
                    title: '3. Asimetrik / Kökten Çözüm',
                    sub: 'Problemi Baypas Eden Zeka Hamlesi',
                    desc: 'Barometreyi bina yöneticisine hediye edip binanın boyunu sormak. Sorunu en kestirme, en ucuz ve en beklenmedik hamleyle çözmek.',
                    tag: 'ASİMETRİK KALDIRAÇ',
                    color: 'border-amber-500/40 text-amber-400',
                  },
                ].map((path) => (
                  <div
                    key={path.id}
                    onClick={() => setSelectedBarometerPath(path.id)}
                    className={`p-6 rounded-xl border transition-all cursor-pointer ${
                      selectedBarometerPath === path.id
                        ? 'bg-[#0E1526] border-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.25)] ring-1 ring-indigo-400'
                        : 'bg-[#0C101A] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold block w-fit ${path.color}`}>
                        {path.tag}
                      </span>
                      {selectedBarometerPath === path.id && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-indigo-400">
                          <Check className="w-3 h-3" />
                          <span>AKTİF SEÇİM</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-white font-mono mb-1">{path.title}</h4>
                    <span className="text-xs text-gray-400 block mb-3 font-mono">{path.sub}</span>
                    <p className="text-xs text-gray-300 leading-relaxed">{path.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-mono text-gray-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span>DOKTRİN İLKESİ: &ldquo;Tek bir çözüme aşık olan mühendis, alternatif zaferleri ıskalar.&rdquo;</span>
                <span className="text-indigo-400 font-bold uppercase shrink-0">3 EKSENLİ ÇÖZÜM HAVUZU</span>
              </div>
            </div>

            {/* AKIŞ BAĞLANTI BANDI (CONDUIT PIPELINE) */}
            <div className="flex flex-col items-center justify-center my-6">
              <div className="w-px h-8 bg-gradient-to-b from-indigo-400 to-amber-400" />
              <div className="px-4 py-1 rounded-full bg-[#0C101A] border border-white/10 text-[10px] font-mono text-amber-400 uppercase tracking-widest flex items-center gap-2 shadow-lg">
                <ArrowDown className="w-3 h-3 text-amber-400 animate-bounce" />
                <span>ÇÖZÜM TAMAMLANDI // SAHA VE KULLANICI REZONANSINA ULAŞILDI</span>
              </div>
              <div className="w-px h-8 bg-gradient-to-b from-amber-400 to-amber-500" />
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* AŞAMA 04: ARTHUR KOESTLER TRİADI (KULLANICI REZONANSI) */}
            {/* --------------------------------------------------------------------- */}
            <div className="p-6 sm:p-10 rounded-2xl bg-[#090D16] border border-amber-500/30 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-500/10 border-b border-l border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-widest font-bold">
                AŞAMA 04 // SAHA REZONANSI
              </div>

              <div className="max-w-3xl mb-8">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">
                  KULLANICIYA NE HİSSETTİRİRİZ?
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-heading text-white uppercase tracking-tight">
                  Arthur Koestler Triadı: Ürün Hissiyatı &amp; Güven
                </h3>
                <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                  Nuper platformları kullanıcısında sıradan bir arayüz hissi değil; şu 3 aşamalı entelektüel ve estetik rezonansı uyandırır:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-[#0C101A] border border-sky-500/30 relative flex flex-col justify-between hover:border-sky-400 transition-colors">
                  <div>
                    <span className="text-4xl font-black font-heading text-sky-400 block mb-2">HAHA!</span>
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block mb-3 font-bold">
                      01 // BEKLENMEDİK KIŞKIRTMA
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Savunma sanayiinin hantal, gri ve 90&apos;lardan kalma devlet ekranlarını beklerken karşısında uzay çağından fırlamış, akıcı ve parıldayan bir arayüz bulur.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-white/5 text-[10px] font-mono text-sky-400 uppercase">
                    İLK TEMAS ETKİSİ
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-[#0C101A] border border-emerald-500/30 relative flex flex-col justify-between hover:border-emerald-400 transition-colors">
                  <div>
                    <span className="text-4xl font-black font-heading text-emerald-400 block mb-2">AHA!</span>
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block mb-3 font-bold">
                      02 // ENTELEKTÜEL BULUŞ
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      1000 sayfalık şartnameyi veya karmaşık bir CAD modelini saniyeler içinde analiz eden motoru gördüğünde masaya vurup &ldquo;İşte tam aradığım şey!&rdquo; der.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-white/5 text-[10px] font-mono text-emerald-400 uppercase">
                    ÇÖZÜM AYDINLANMASI
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-[#0C101A] border border-amber-500/30 relative flex flex-col justify-between hover:border-amber-400 transition-colors">
                  <div>
                    <span className="text-4xl font-black font-heading text-amber-400 block mb-2">AH!</span>
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block mb-3 font-bold">
                      03 // ESTETİK VE GÜVEN
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Kusursuz tipografi, deterministik telemetri ve askeri hassasiyet derin bir endüstriyel aşkınlık ve sarsılmaz bir güven hissi bırakır.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-white/5 text-[10px] font-mono text-amber-400 uppercase">
                    SARSILMAZ BAĞLILIK
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. GÖRSEL TEKNOLOJİK YOL HARİTASI (TIMELINE BLUEPRINT) */}
        {/* ========================================================================= */}
        <div className="space-y-8 pt-8 border-t border-white/10">
          <div>
            <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-2">
              GELECEK TASARIMI // 10 YILLIK YOL HARİTASI
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-white uppercase tracking-tight">
              YAZILIMDAN FİZİKSEL SAVUNMA KALESİNE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-xl bg-[#0C101A] border border-white/10 border-t-4 border-t-sky-400 relative">
              <span className="text-xs font-mono text-sky-400 font-bold block mb-1">FAZ 01 // 2026</span>
              <h4 className="text-base font-bold text-white font-mono uppercase mb-2">MODÜLER CEPHANELİK</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Nuper OS, RAG tabanlı askeri şartname asistanı ve talaşlı imalat DFM mikro-SaaS araçlarının sahaya çıkışı.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0C101A] border border-white/10 border-t-4 border-t-indigo-400 relative">
              <span className="text-xs font-mono text-indigo-400 font-bold block mb-1">FAZ 02 // 2027 - 2028</span>
              <h4 className="text-base font-bold text-white font-mono uppercase mb-2">KÜRESEL B2B YAYILIM</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Tier-1 ve Tier-2 savunma sanayii KOBİ&apos;lerine doğrudan yayılım. CAD/CAM yapay zeka analiz motoru.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0C101A] border border-white/10 border-t-4 border-t-emerald-400 relative">
              <span className="text-xs font-mono text-emerald-400 font-bold block mb-1">FAZ 03 // 2029 - 2031</span>
              <h4 className="text-base font-bold text-white font-mono uppercase mb-2">OTONOMİ VE DUAL-USE</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Çift kullanımlı otonom İHA ve robotik sistem kontrol algoritmaları, sentetik sensör simülasyonları.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0C101A] border border-white/10 border-t-4 border-t-amber-400 relative">
              <span className="text-xs font-mono text-amber-400 font-bold block mb-1">FAZ 04 // 2032+</span>
              <h4 className="text-base font-bold text-white font-mono uppercase mb-2">NUPER FOUNDRY</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Mühendislerin tasarladığı donanımları otonom olarak üreten dünyanın en çevik derin teknoloji fabrikası.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. TAKTİK KARŞILAŞTIRMA MATRİSİ: HANTAL DEVLER vs NUPER */}
        {/* ========================================================================= */}
        <div className="space-y-6 pt-8 border-t border-white/10">
          <div>
            <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block mb-2">
              DOKTRİN KARŞILAŞTIRMASI
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-white uppercase tracking-tight">
              HANTAL DEVLER VS. EGEMEN NUPER
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border border-white/10 rounded-xl overflow-hidden">
              <thead className="bg-[#0C1220] text-gray-400 border-b border-white/10 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">PARAMETRE</th>
                  <th className="p-4 text-red-400">ESKİ NESİL HANTAL YAPILAR</th>
                  <th className="p-4 text-sky-400">NUPER INDUSTRIES MODELİ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#090D16]">
                <tr>
                  <td className="p-4 font-bold text-gray-300">İCRAAT HIZI</td>
                  <td className="p-4 text-gray-400">18-24 aylık toplantı ve ihale döngüleri</td>
                  <td className="p-4 text-emerald-400 font-bold">48 saatte çalışan prototip &amp; canlı kod</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-300">FİNANSAL EGEMENLİK</td>
                  <td className="p-4 text-gray-400">Dış fon bağımlılığı ve şişirilmiş maliyetler</td>
                  <td className="p-4 text-emerald-400 font-bold">Öz sermaye ile kavrulan tam bağımsız güç</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-300">YAPAY ZEKA YAKLAŞIMI</td>
                  <td className="p-4 text-gray-400">Yüzeysel ChatGPT sarmalayıcıları (Generic AI)</td>
                  <td className="p-4 text-emerald-400 font-bold">Fiziksel dünya toleranslarında deterministik AI</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-300">GÜVENLİK VE VERİ</td>
                  <td className="p-4 text-gray-400">Dış buluta bağımlı, regülasyona takılan yapılar</td>
                  <td className="p-4 text-emerald-400 font-bold">Air-gapped, yerel GPU ve sıfır veri sızıntısı</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-300">HATA PROTOKOLÜ</td>
                  <td className="p-4 text-gray-400">Hata korkusuyla felç olmuş bürokrasi</td>
                  <td className="p-4 text-emerald-400 font-bold">Hızlı hata lisansı ➔ Zafer kaydı (Aksaçlı Usta Kuralı)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. KAPANIŞ: BÜYÜK DÜŞ MÜHENDİSLİĞİ AFORİZMASI */}
        {/* ========================================================================= */}
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-sky-500/10 via-[#0C101A] to-emerald-500/10 border border-white/10 text-center relative overflow-hidden">
          <span className="text-xs font-mono text-sky-400 tracking-widest uppercase block mb-3">
            DÜŞ MÜHENDİSLİĞİ DOKTRİNİ
          </span>
          <blockquote className="text-2xl sm:text-3xl md:text-4xl font-black font-heading text-white uppercase leading-tight max-w-4xl mx-auto">
            &ldquo;Tarih, olmaz diyen uzmanların enkazı üzerinde, ya olursa? diyen düş mühendislerinin zaferleriyle yazılmıştır.&rdquo;
          </blockquote>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors"
            >
              Çözümlerimizi Keşfet
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-mono font-bold text-xs uppercase tracking-wider hover:border-sky-400 transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
