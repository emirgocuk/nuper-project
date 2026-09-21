import { prisma } from "@/lib/db";
import Link from "next/link";
import { Newspaper, ArrowRight, Activity, Bell } from "lucide-react";
import { unstable_noStore as noStore } from 'next/cache';

const FALLBACK_BULLETINS = [
    {
        id: "announcement-01",
        slug: "sovereign-systems-v2",
        title: "Nuper Systems V2: Yerel Yapay Zeka ve Otonom Sensör Ağları Lansmanı",
        description: "Dış ağ bağlantısı gerektirmeyen izole ortamlarda görev icra eden egemen sistem mimarimizin yeni sürüm notları ve teknik saha sonuçları.",
        cardImage: "https://placehold.co/800x600/0c101a/ffffff?text=Nuper+Announcement",
        createdAt: new Date().toISOString(),
        publisher: "Nuper Systems Ar-Ge",
    },
    {
        id: "announcement-02",
        slug: "first-principles-architecture",
        title: "Kritik Sistemlerde Birinci Prensipler Yaklaşımı: Teknik Bildiri",
        description: "Savunma teknolojileri ve derin kod altyapılarında bağımsız sermaye ile deterministik sistem inşasına ilişkin kapsamlı mimari değerlendirme.",
        cardImage: "https://placehold.co/800x600/0c101a/ffffff?text=Technical+Paper",
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        publisher: "Nuper Engineering Group",
    }
];

export default async function BulletinsPage() {
    noStore();
    let bulletins: any[] = [];
    try {
        bulletins = await prisma.bulletin.findMany({
            orderBy: { createdAt: 'desc' }
        });
        if (bulletins.length === 0) {
            bulletins = FALLBACK_BULLETINS;
        }
    } catch (e) {
        console.warn("Database offline, using cached strategic announcements:", e);
        bulletins = FALLBACK_BULLETINS;
    }

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[#080B11] text-white relative overflow-hidden font-sans">
            {/* Subtle Blueprint Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

            <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
                {/* Header Block */}
                <div className="mb-12 border-b border-white/10 pb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded mb-4">
                        <Bell className="w-3.5 h-3.5 text-emerald-400" />
                        GELİŞMELER // STRATEJİK BİLDİRİLER
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white uppercase mb-4">
                        STRATEJİK GELİŞMELER &amp; PROJE DUYURULARI
                    </h1>
                    <p className="text-gray-400 text-base sm:text-lg max-w-3xl leading-relaxed">
                        Nuper ekosistemindeki önemli proje lansmanları, stratejik duyurular ve kritik teknoloji güncellemeleri.
                    </p>
                </div>

                {/* Bulletins / Announcements Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {bulletins.map((bulletin: any) => (
                        <Link 
                            href={`/bulletins/${bulletin.slug}`} 
                            key={bulletin.id} 
                            className="group bg-[#0C101A] border border-white/10 hover:border-emerald-500/40 transition-all duration-300 rounded-xl overflow-hidden flex flex-col justify-between"
                        >
                            {bulletin.cardImage && (
                                <div className="h-52 overflow-hidden bg-[#080B11] border-b border-white/10 relative">
                                    <img
                                        src={bulletin.cardImage}
                                        alt={bulletin.title}
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 right-3 bg-[#080B11]/90 border border-white/10 text-emerald-400 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider">
                                        DUYURU
                                    </div>
                                </div>
                            )}
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-3 text-xs font-mono text-emerald-400 uppercase">
                                    <Newspaper className="w-3.5 h-3.5" />
                                    <span>{new Date(bulletin.createdAt).toLocaleDateString("tr-TR")}</span>
                                </div>
                                <h3 className="text-lg font-bold font-heading text-white group-hover:text-emerald-300 transition-colors mb-3 leading-snug line-clamp-2">
                                    {bulletin.title}
                                </h3>
                                <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-6 flex-1">
                                    {bulletin.description || bulletin.publisher || "Nuper derin teknoloji ve sistem ekosistemine dair önemli bildiri."}
                                </p>
                                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-emerald-400">
                                    <span>DETAYLARI İNCELE</span>
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

