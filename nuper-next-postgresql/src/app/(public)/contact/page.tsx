'use client';

import React, { useState } from 'react';
import {
  Mail,
  Building2,
  Shield,
  Clock,
  Send,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    category: 'Sistem Entegrasyonu & Tedarik',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        organization: '',
        email: '',
        category: 'Sistem Entegrasyonu & Tedarik',
        message: ''
      });
    }, 600);
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#080B11] text-white relative overflow-hidden font-sans selection:bg-sky-500/30">
      {/* Taktik Mühendislik Izgarası ve Ambient Işıklar */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10 space-y-12">
        {/* ========================================================================= */}
        {/* 1. ÜST BAŞLIK ALANI */}
        {/* ========================================================================= */}
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white uppercase">
            İLETİŞİM &amp; KURUCU OFİSİ
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
            Sistem entegrasyonu, savunma tedariği, kurumsal lisanslama veya yatırımcı ilişkileri için bize ulaşın.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 2. FORM VE İLETİŞİM KANALLARI (DENGELİ 2 KOLONLU DÜZEN) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sol Kolon: İletişim Formu (7 Kolon) */}
          <div className="lg:col-span-7 bg-[#0C101A] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-sky-400" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-sky-400" />

            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-white uppercase tracking-tight">
                İletişim Formu
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                Talebinizi iletmek için formu doldurun. Mesajınız doğrudan kurucu ofisine ulaştırılacaktır.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white font-heading uppercase">
                  Talebiniz Alındı
                </h3>
                <p className="text-xs font-mono text-gray-300 max-w-md mx-auto leading-relaxed">
                  Mesajınız kurucu ofisine ulaştırıldı. Talebinizin kapsamına göre 24 saat içerisinde teknik veya kurumsal geri dönüş sağlanacaktır.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  Yeni Mesaj Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Ad Soyad */}
                  <div>
                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">
                      Ad Soyad <span className="text-sky-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Adınız ve Soyadınız"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#080B11] border border-white/15 focus:border-sky-400 rounded-lg p-3 text-xs sm:text-sm text-white font-mono outline-none transition-colors"
                    />
                  </div>

                  {/* Kurum / Şirket */}
                  <div>
                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">
                      Kurum / Şirket / Görev
                    </label>
                    <input
                      type="text"
                      placeholder="Savunma Sanayii / Girişim / Kurum"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full bg-[#080B11] border border-white/15 focus:border-sky-400 rounded-lg p-3 text-xs sm:text-sm text-white font-mono outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* E-posta */}
                  <div>
                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">
                      E-Posta Adresi <span className="text-sky-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="adiniz@kurum.com.tr"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#080B11] border border-white/15 focus:border-sky-400 rounded-lg p-3 text-xs sm:text-sm text-white font-mono outline-none transition-colors"
                    />
                  </div>

                  {/* Konu / Kategori */}
                  <div>
                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">
                      İletişim Konusu
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-[#080B11] border border-white/15 focus:border-sky-400 rounded-lg p-3 text-xs sm:text-sm text-white font-mono outline-none transition-colors"
                    >
                      <option value="Sistem Entegrasyonu & Tedarik">Sistem Entegrasyonu &amp; Tedarik</option>
                      <option value="Yatırımcı İlişkileri & Fonlama">Yatırımcı İlişkileri &amp; Fonlama</option>
                      <option value="Teknik Ortaklık & Ar-Ge">Teknik Ortaklık &amp; Ar-Ge</option>
                      <option value="Gizli Brifing Talebi">Gizli Brifing Talebi</option>
                      <option value="Genel Bilgi">Genel Bilgi</option>
                    </select>
                  </div>
                </div>

                {/* Mesaj */}
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">
                    Mesajınız veya Proje Talebi <span className="text-sky-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="İlgilendiğiniz sistem, iş birliği veya yatırım konusu hakkında bilgi verin..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#080B11] border border-white/15 focus:border-sky-400 rounded-lg p-3 text-xs sm:text-sm text-white font-mono outline-none transition-colors leading-relaxed"
                  />
                </div>

                {/* Güvenlik Notu ve Gönder Butonu */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-[11px] font-mono text-gray-500 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                    Bilgileriniz üçüncü taraflarla paylaşılmaz.
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-[#080B11] font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md shadow-sky-500/20 min-h-[44px]"
                  >
                    {isSubmitting ? (
                      <span>İletiliyor...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Talebi İlet</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Sağ Kolon: İletişim Kanalları (5 Kolon) */}
          <div className="lg:col-span-5 bg-[#0C101A] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-white uppercase tracking-tight">
                İletişim Kanalları
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                Doğrudan e-posta yoluyla bize ulaşabilirsiniz.
              </p>
            </div>

            <div className="space-y-4">
              {/* Kurucu Ofisi E-posta */}
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-sky-500/30 transition-colors">
                <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-500 block uppercase">KURUCU VE GENEL İLETİŞİM</span>
                  <a
                    href="mailto:contact@nuper.industries"
                    className="text-xs sm:text-sm font-mono text-white font-semibold hover:text-sky-300 transition-colors block mt-0.5"
                  >
                    contact@nuper.industries
                  </a>
                </div>
              </div>

              {/* Yatırımcı İlişkileri */}
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-colors">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-500 block uppercase">YATIRIMCI İLİŞKİLERİ</span>
                  <a
                    href="mailto:investor@nuper.industries"
                    className="text-xs sm:text-sm font-mono text-white font-semibold hover:text-emerald-300 transition-colors block mt-0.5"
                  >
                    investor@nuper.industries
                  </a>
                </div>
              </div>

              {/* Savunma Tedarik & Lisans */}
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-colors">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-500 block uppercase">SAVUNMA TEDARİK &amp; LİSANS</span>
                  <a
                    href="mailto:defense@nuper.industries"
                    className="text-xs sm:text-sm font-mono text-white font-semibold hover:text-indigo-300 transition-colors block mt-0.5"
                  >
                    defense@nuper.industries
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-xs font-mono text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Tüm talepler 24 saat içinde incelenir ve yanıtlanır.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
