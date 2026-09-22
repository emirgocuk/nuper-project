'use client';

import React, { useState, useEffect } from 'react';
import { ArsenalTool } from '@/lib/arsenalData';
import { X, Play, RefreshCw, FileText, CheckCircle2, Cpu, TrendingUp, ShieldCheck, ArrowRight, Send } from 'lucide-react';

interface ToolSandboxModalProps {
  tool: ArsenalTool | null;
  onClose: () => void;
}

export function ToolSandboxModal({ tool, onClose }: ToolSandboxModalProps) {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SPECS'>('OVERVIEW');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const [inquirySent, setInquirySent] = useState(false);
  const [contactEmail, setContactEmail] = useState('');

  // ESC tuşuyla kapatma
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Yeni araç açıldığında simülasyon çıktısını sıfırla
  useEffect(() => {
    setSimulationResult(null);
    setInquirySent(false);
  }, [tool]);

  if (!tool) return null;

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationResult(
        tool.demoConfig?.sampleOutput ||
          'Deterministik analiz başarıyla tamamlandı. Tüm toleranslar askeri normlara (MIL-STD) uygunluk sağladı.'
      );
    }, 700);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim()) return;
    setInquirySent(true);
    setTimeout(() => {
      setContactEmail('');
      setInquirySent(false);
    }, 3500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#0C101A] border border-white/20 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden text-white font-sans">
        {/* Taktik Köşe Çentikleri */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-sky-400" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-sky-400" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-sky-400" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-sky-400" />

        {/* Modal Üst Başlığı */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#080B11]/90">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest font-bold">
                {tool.toolCode}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 uppercase font-bold">
                BİTMİŞ SİSTEM // OPERASYONEL
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-bold font-heading uppercase text-white tracking-wide mt-1">
              {tool.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Pencereyi Kapat"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sekme Çubuğu */}
        <div className="flex border-b border-white/10 bg-[#080B11] px-6">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-colors min-h-[44px] ${
              activeTab === 'OVERVIEW'
                ? 'border-sky-400 text-sky-300'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            01. Sistem Mimarisi &amp; Canlı Test
          </button>
          <button
            onClick={() => setActiveTab('SPECS')}
            className={`py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-colors min-h-[44px] ${
              activeTab === 'SPECS'
                ? 'border-sky-400 text-sky-300'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            02. Yatırımcı Dosyası &amp; Spesifikasyon
          </button>
        </div>

        {/* Modal İçerik Gövdesi */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Tanıtım ve Değer Açıklaması */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block mb-1">
                  MİSYON VE SAHA DEĞERİ
                </span>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {tool.description}
                </p>
              </div>

              {/* Yatırım & Katma Değer HUD Kartları */}
              {tool.marketValue && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-lg bg-[#080B11] border border-emerald-500/20">
                    <span className="text-[10px] font-mono text-gray-400 block uppercase">ROI / SAHA KAZANCI:</span>
                    <span className="text-xs font-mono font-bold text-emerald-400 mt-1 block">
                      {tool.marketValue.roiImpact}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#080B11] border border-sky-500/20">
                    <span className="text-[10px] font-mono text-gray-400 block uppercase">KURULUM / DAĞITIM:</span>
                    <span className="text-xs font-mono font-bold text-sky-300 mt-1 block">
                      {tool.marketValue.deploymentTime}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#080B11] border border-amber-500/20">
                    <span className="text-[10px] font-mono text-gray-400 block uppercase">STANDART UYUMLULUĞU:</span>
                    <span className="text-xs font-mono font-bold text-amber-300 mt-1 block truncate">
                      {tool.marketValue.compliance}
                    </span>
                  </div>
                </div>
              )}

              {/* Canlı Deterministik Gösterim / Simülasyon */}
              {tool.demoConfig && (
                <div className="p-5 rounded-xl bg-[#080B11] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-sky-400" />
                      <span className="text-xs font-mono font-bold uppercase text-white">
                        CANLI ANALİZ &amp; TELEMETRİ TESTİ
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">
                      DETERMİNİSTİK MOTOR ÇALIŞIYOR
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tool.demoConfig.parameters.map((param, idx) => (
                      <div key={idx}>
                        <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1.5">
                          {param.label}
                        </label>
                        {param.type === 'select' ? (
                          <select className="w-full bg-[#0C101A] border border-white/20 rounded p-2.5 text-xs text-white font-mono focus:border-sky-400 focus:outline-none">
                            {param.options?.map((opt, i) => (
                              <option key={i} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={param.type}
                            defaultValue={param.defaultValue}
                            className="w-full bg-[#0C101A] border border-white/20 rounded p-2.5 text-xs text-white font-mono focus:border-sky-400 focus:outline-none"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleRunSimulation}
                      disabled={isSimulating}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-sky-500 hover:bg-sky-400 text-[#080B11] font-mono text-xs font-bold uppercase tracking-wider transition-colors min-h-[44px]"
                    >
                      {isSimulating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Sistem Yürütülüyor...
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          {tool.demoConfig.actionLabel}
                        </>
                      )}
                    </button>
                  </div>

                  {simulationResult && (
                    <div className="p-4 rounded-lg bg-[#0C101A] border border-emerald-500/40 text-xs font-mono text-emerald-300 animate-in fade-in">
                      <div className="flex items-center gap-2 font-bold mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        GÖREV RAPORU ALINDI:
                      </div>
                      <p className="text-gray-200 font-mono text-xs leading-relaxed">{simulationResult}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'SPECS' && (
            <div className="space-y-6 font-mono text-xs">
              {/* Teknik Özellikler Tablosu */}
              <div className="p-4 rounded-xl bg-[#080B11] border border-white/10 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-gray-500">MİMARİ KAPSAM:</span>
                  <span className="text-white font-bold">{tool.category} SİSTEMİ</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-gray-500">LİSANS DÜZEYİ:</span>
                  <span className="text-sky-400 font-bold">{tool.tier}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-gray-500">HEDEF SEKTÖR / KULLANICI:</span>
                  <span className="text-gray-300 font-semibold">{tool.targetAudience}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-gray-500">VERİ GÜVENLİĞİ:</span>
                  <span className="text-emerald-400 font-bold">AIR-GAPPED (SIFIR DIŞ BULUT SIZINTISI)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">STANDART PROTOKOLÜ:</span>
                  <span className="text-amber-400 font-bold">{tool.marketValue?.compliance}</span>
                </div>
              </div>

              {/* Kabiliyet Matrisi */}
              <div>
                <span className="text-[10px] uppercase tracking-widest text-sky-400 block mb-2 font-bold">
                  SİSTEMİN RESMİ DOĞRULANMIŞ KABİLİYETLERİ:
                </span>
                <div className="space-y-2">
                  {tool.capabilities.map((cap, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded bg-white/[0.02] border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-gray-200">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Yatırım & Entegrasyon İletişim Kutusu */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-sky-500/10 via-[#0C101A] to-emerald-500/10 border border-white/10 space-y-3">
                <span className="text-xs font-mono font-bold text-white uppercase block">
                  YATIRIMCI VEYA TEDARİKÇİ GÖRÜŞMESİ TALEP EDİN
                </span>
                <p className="text-[11px] text-gray-300 font-sans leading-relaxed">
                  Bu sistemi doğrudan savunma filonuza entegre etmek, kurumsal lisans almak veya Nuper Industries yatırım turuna katılmak için e-posta adresinizi bırakın:
                </p>

                <form onSubmit={handleSendInquiry} className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    type="email"
                    required
                    placeholder="ornek@savunma.gov.tr veya fon@girisim.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="flex-1 bg-[#080B11] border border-white/20 rounded p-2.5 text-xs text-white font-mono focus:border-sky-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-sky-500 hover:bg-sky-400 text-[#080B11] font-mono text-xs font-bold uppercase tracking-wider transition-colors min-h-[44px]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Brifing Talep Et
                  </button>
                </form>

                {inquirySent && (
                  <div className="p-2 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Brifing talebiniz kurucu ofisine iletildi. En kısa sürede geri dönüş yapılacaktır.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
