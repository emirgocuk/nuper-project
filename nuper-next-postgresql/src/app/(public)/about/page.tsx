import { NuperLogo } from "@/components/brand/NuperLogo";
import { Crosshair, Terminal, Shield, Cpu, BookOpen, Flame, Compass } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-28 pb-20 bg-[#080B11] text-white relative overflow-hidden font-sans">
            {/* Subtle Blueprint Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

            <div className="max-w-5xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
                {/* Header Block */}
                <div className="mb-16 border-b border-white/10 pb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono uppercase tracking-widest bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded mb-4">
                        <Crosshair className="w-3.5 h-3.5 text-sky-400" />
                        DOKTRİN &amp; MANİFESTO // NUPER INDUSTRIES
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white uppercase mb-4">
                        EGEMEN AZINLIKLAR ÇAĞI &amp; BİRİNCİ PRENSİPLER
                    </h1>
                    <p className="text-gray-400 text-base sm:text-lg max-w-3xl leading-relaxed">
                        Hantal bürokrasilerin, şişirilmiş organizasyonların ve yüzeysel yapay zeka klişelerinin ötesinde; 
                        bağımsız irade, deterministik mühendislik ve köklü problem çözme doktrini.
                    </p>
                </div>

                {/* Doctrine Pillars - 3 Tactical Columns */}
                <div className="grid gap-6 md:grid-cols-3 mb-16">
                    <div className="bg-[#0C101A] border border-white/10 hover:border-sky-500/30 transition-all duration-300 rounded-xl p-6 relative overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4 text-sky-400">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                            SÜTUN 01 // VİZYON
                        </div>
                        <h3 className="text-lg font-bold font-heading text-white mb-2">Düş Mühendisliği</h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            Kavramsal problem çözme metodolojisi: Başkalarının kanıksadığı ve görmezden geldiği kritik sistemik darboğazları birinci prensiplerle saptamak ve radikal bir mimari hipotez inşa etmek.
                        </p>
                    </div>

                    <div className="bg-[#0C101A] border border-white/10 hover:border-emerald-500/30 transition-all duration-300 rounded-xl p-6 relative overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                            <Flame className="w-5 h-5" />
                        </div>
                        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                            SÜTUN 02 // MÜHENDİSLİK
                        </div>
                        <h3 className="text-lg font-bold font-heading text-white mb-2">Derin Sistem Mimarisi</h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            Bürokratik toplantılar yerine doğrudan sistem çekirdeğine odaklanan, savunma teknolojileri ve fiziksel yapay zeka alanında çalışan yüksek kaldıraçlı mühendislik gücü.
                        </p>
                    </div>

                    <div className="bg-[#0C101A] border border-white/10 hover:border-amber-500/30 transition-all duration-300 rounded-xl p-6 relative overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                            SÜTUN 03 // İCRAAT
                        </div>
                        <h3 className="text-lg font-bold font-heading text-white mb-2">Egemen Sermaye</h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            Dış kaynak bağımlılığı ve fon hiyerarşisi olmaksızın, kendi yarattığı artı değerle kendini finanse eden ve tam bağımsız kararlar alan egemen kurucu modeli.
                        </p>
                    </div>
                </div>

                {/* Detailed Manifesto Narrative */}
                <div className="bg-[#0C101A] border border-white/10 rounded-xl p-8 sm:p-12 space-y-8 relative">
                    <div className="flex items-center justify-between pb-6 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <NuperLogo size={28} showText={false} variant="nexus" centerCore="eye" className="text-white" />
                            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                                NUPER SOVEREIGN SYSTEMS // MANIFESTO
                            </span>
                        </div>
                        <span className="text-[10px] font-mono text-sky-400 border border-sky-400/30 px-2 py-0.5 rounded uppercase">
                            DE-CLASSIFIED
                        </span>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold font-heading text-white mb-3">
                            I. Neden &ldquo;Egemen Azınlıklar&rdquo;?
                        </h2>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            Tarih boyunca dönüştürücü teknolojiler hiçbir zaman yüzlerce kişilik komitelerin, bürokratik hiyerarşilerin veya riskten kaçan kurumsal yapıların mutabakatıyla doğmadı. Dönüşüm; sahayı doğrudan tanıyan, problemi derinlemesine hisseden ve yüksek icraat disipliniyle ürün üreten küçük, hiper-uzman bir avuç kurucunun (Sovereign Founder) iradesiyle gerçekleşti.
                        </p>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Nuper Industries, bu egemen azınlık doktrininin teknolojik somutlaşmış halidir. Bizler, hantal yapılar yerine yüksek kaldıraçlı çekirdek mühendislik odağıyla hareket eder; aylar süren bürokratik döngüleri günler içinde sahada çalışan deterministik sistemlere dönüştürürüz.
                        </p>
                    </div>

                    <div className="pt-6 border-t border-white/[0.06]">
                        <h2 className="text-2xl font-bold font-heading text-white mb-3">
                            II. Düş Mühendisliği ve Birinci Prensipler
                        </h2>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            Kavramsal mühendislik yaklaşımımız, Nuper&apos;in problem çözme DNA&apos;sını tanımlar:
                        </p>
                        <blockquote className="p-4 bg-[#080B11] border-l-2 border-sky-400 rounded-r text-sm text-gray-300 italic mb-4 leading-relaxed font-sans">
                            &ldquo;Kavramsal mühendislik, endüstrinin kanıksadığı ve çözülemez sandığı en temel darboğazları birinci prensiplerle parçalara ayırmak ve tavizsiz bir disiplinle deterministik çözümü inşa etmektir. Bir kez o sistemik kilidi kırdığınızda, tüm yapı yeniden şekillenir.&rdquo;
                        </blockquote>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Bu yaklaşım gereği bizler, hazır şablonları taklit etmeyiz. Her projede doğrudan çözülmemiş, görmezden gelinen veya çözülmesi imkansız zannedilen temel mühendislik darboğazlarına odaklanırız.
                        </p>
                    </div>

                    <div className="pt-6 border-t border-white/[0.06]">
                        <h2 className="text-2xl font-bold font-heading text-white mb-3">
                            III. Gelecek ve Fiziksel Yapay Zeka
                        </h2>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Hedefimiz yalnızca ekranda kalan arayüzler değil; savunma, fiziksel dünya sensör ağları, otonom karar destek mekanizmaları ve sahada deterministik çalışan derin teknoloji altyapılarını büyütmektir. Nuper Industries, dış sermayeye bağımlı olmadan, kendi öz kaynaklarıyla ürettiği değerle büyümeye ve egemen teknolojiler inşa etmeye devam edecektir.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

