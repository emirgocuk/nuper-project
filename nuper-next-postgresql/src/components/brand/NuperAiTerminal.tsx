'use client';

import React, { useState, useEffect } from 'react';
import { NuperLogo } from '@/components/brand/NuperLogo';

interface PromptPreset {
  id: string;
  command: string;
  label: string;
  response: string;
}

const PROMPT_PRESETS: PromptPreset[] = [
  {
    id: 'intro',
    command: 'intro',
    label: '01 // Kendini Tanıt',
    response:
      'Ben Nuper Core AI. Savunma sistemleri ve derin mühendislik için geliştirilmiş egemen yazılım mimarisiyim. Ezberlenmiş kalıpların ve yapay zeka sıradanlığının ötesinde; birinci prensiplerle sahadaki kritik darboğazları tespit eder, bağımsız ve deterministik çözümlere dönüştürürüm.',
  },
  {
    id: 'dus',
    command: 'philosophy',
    label: '02 // Düş Mühendisliği',
    response:
      'Düş Mühendisliği, bilginin değil hayalgücünün ve cesur inovasyonun fiziksel dünyayı şekillendirdiği doktrindir. Formülümüz: Hassas Mühendislik × Ayrışan Düşünce. İmkansız görünen problemleri önce zihinde modeller, ardından sahada deterministik olarak ayağa kaldırırız.',
  },
  {
    id: 'saha',
    command: 'verification',
    label: '03 // Saha Doğrulaması',
    response:
      'Bizim için teoride kalan kod henüz yazılmamıştır. Fikir aşamasında özgürce düşler; kodlama ve imalat aşamasında AS9100 ve MIL-STD askeri toleranslarında tavizsiz bir disiplin uygularız. Sonuç: “Düşlerle Tasarlandı, Görevle Doğrulandı.”',
  },
  {
    id: 'cephanelik',
    label: '04 // Modüler Cephanelik',
    command: 'arsenal',
    response:
      'Mühendislerin mesaisini saatlerce çalan görevleri saniyelere indiren modüler mikro-SaaS araçları. Askeri şartname analizöründen talaşlı imalat tolerans motoruna kadar doğrudan sahaya odaklanan yüksek kaldıraçlı bir cephanelik.',
  },
];

export const NuperAiTerminal: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);

  const activePreset = PROMPT_PRESETS[activeIndex];

  // Typewriter akışı
  useEffect(() => {
    setIsTyping(true);
    setDisplayedText('');
    let currentIndex = 0;
    const fullText = activePreset.response;

    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 14);

    return () => clearInterval(interval);
  }, [activeIndex]);

  // Yazma bittikten sonra 4 saniye bekle ve bir sonraki seçeneğe geç
  useEffect(() => {
    if (isTyping) return;

    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % PROMPT_PRESETS.length);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isTyping, activeIndex]);

  return (
    <div className="w-full max-w-lg mx-auto lg:ml-auto relative select-none">
      {/* Arkadaki hafif siber parlama */}
      <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/15 via-indigo-500/10 to-emerald-500/15 rounded-xl blur-xl opacity-60 pointer-events-none" />

      {/* Sabit Yükseklikli CLI Terminal Ekranı */}
      <div className="relative h-[390px] rounded-xl bg-[#080C14]/95 border border-sky-500/30 shadow-[0_0_40px_rgba(8,12,20,0.9)] backdrop-blur-xl overflow-hidden flex flex-col font-mono">
        {/* CLI Üst Başlık Çubuğu: Sadece Logo & Program Adı */}
        <div className="px-4 py-2.5 bg-[#0C1220] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <NuperLogo
              size={18}
              showText={false}
              variant="nexus"
              centerCore="eye"
              className="text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
            />
            <span className="text-xs font-mono font-bold text-gray-300 tracking-wider">
              nuper-core (cli-agent)
            </span>
          </div>

          <span className="text-[10px] font-mono text-gray-500">
            v2.6 // session:active
          </span>
        </div>

        {/* CLI Terminal Gövdesi */}
        <div className="p-5 flex-1 flex flex-col justify-between overflow-hidden">
          <div className="flex-1">
            {/* CLI Komut Satırı İstemi */}
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-3">
              <span className="text-emerald-400 font-bold">nuper@core</span>
              <span className="text-gray-600">:</span>
              <span className="text-sky-400 font-semibold">~</span>
              <span className="text-gray-600">$</span>
              <span className="text-gray-100 font-semibold">
                ./execute --protocol {activePreset.command}
              </span>
            </div>

            {/* Daktilo Akış Metni */}
            <div className="text-xs sm:text-sm font-mono text-gray-200 leading-relaxed min-h-[140px]">
              {displayedText}
              <span className="inline-block w-2 h-4 ml-1 bg-sky-400 animate-pulse align-middle" />
            </div>
          </div>

          {/* 4 Seçenek: Kendi Arasında Otomatik Dönen CLI Sekmeleri */}
          <div className="pt-3 border-t border-white/10">
            <div className="grid grid-cols-2 gap-2">
              {PROMPT_PRESETS.map((preset, index) => {
                const isSelected = activeIndex === index;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setActiveIndex(index)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono transition-all duration-200 text-left border ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-400 text-white shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                        : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-gray-200 hover:border-white/20'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-sky-400 animate-ping' : 'bg-gray-600'
                      }`}
                    />
                    <span className="truncate">{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuperAiTerminal;
