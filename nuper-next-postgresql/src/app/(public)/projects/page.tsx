import { ArsenalHub } from "@/components/arsenal/ArsenalHub";
import { Terminal } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function ProjectsPage() {
    return (
        <div className="min-h-screen pt-24 pb-16 bg-[#080B11] text-white relative overflow-hidden font-sans">
            {/* Arka Plan Hassas Mühendislik Izgarası */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.06)_0%,transparent_70%)] pointer-events-none" />

            <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10 space-y-8">
                {/* 1. MİNİMAL VE TEMİZ ÜST BAŞLIK ALANI */}
                <div className="border-b border-white/10 pb-5">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded mb-2">
                        <Terminal className="w-3 h-3 text-sky-400" />
                        <span>NUPER // ÇÖZÜMLERİMİZ</span>
                    </div>
                    
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading tracking-tight text-white uppercase">
                        ÇÖZÜMLERİMİZ
                    </h1>

                    <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl">
                        Her biri bağımsız bir teknoloji markası olarak sahada görev yapan operasyonel sistemlerimiz.
                    </p>
                </div>

                {/* 2. HER SATIRA BİR ADET PROJE SATIRI LİSTESİ */}
                <div>
                    <ArsenalHub />
                </div>

                {/* 3. MİNİMAL İLETİŞİM ŞERİDİ */}
                <div className="p-6 rounded-xl bg-[#0C101A] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
                    <div className="text-center sm:text-left">
                        <span className="text-sky-400 font-bold uppercase block">
                            SAVUNMA ENTEGRASYONU VEYA YATIRIM GÖRÜŞMESİ
                        </span>
                        <p className="text-gray-400 text-[11px] mt-0.5">
                            Çözümlerimizin filonuza entegrasyonu veya stratejik ortaklık için kurucu ofisiyle doğrudan görüşebilirsiniz.
                        </p>
                    </div>

                    <a
                        href="mailto:contact@nuper.industries?subject=Nuper%20Çözümlerimiz%20Yatırım%20ve%20Entegrasyon%20Görüşmesi"
                        className="shrink-0 px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-[#080B11] font-bold uppercase tracking-wider transition-colors min-h-[40px] flex items-center justify-center"
                    >
                        Kurucu ile Görüşün
                    </a>
                </div>
            </div>
        </div>
    );
}
