import { prisma } from "@/lib/db";
import { ProjectCard } from "@/components/ProjectCard";
import { Lightbulb, Compass, Sparkle, Beaker, Crosshair } from "lucide-react";

interface ProjectWithUser {
    id: string;
    title: string;
    description: string | null;
    status: string;
    visibility: string;
    accessPassword?: string | null;
    aiBudgetEstimate?: string | null;
    aiTimeEstimate?: string | null;
    aiDifficultyScore?: number | null;
    aiFeasibilityReport?: string | null;
    user: { name: string | null } | null;
}

const FALLBACK_IDEAS: ProjectWithUser[] = [
    {
        id: "idea-concept-01",
        title: "DÜŞ-01 // Çorabın Söküğü Problem Radarı",
        description: "Endüstride herkesin kanıksadığı ve 'bu böyledir' dediği görünmez verimsizlik noktalarını tarayan ve kavramsal çözüm hipotezleri üreten Düş Mühendisliği algoritması.",
        status: "IDEA",
        visibility: "PUBLIC",
        aiBudgetEstimate: "30.000 USD",
        aiTimeEstimate: "2 Ay",
        user: { name: "Nuper Systems & Ar-Ge" }
    },
    {
        id: "idea-concept-02",
        title: "DÜŞ-02 // Otonom Sürü İtiş & Navigasyon Hipotezi",
        description: "GPS sinyallerinin karıştırıldığı veya tamamen kesildiği elektronik harp koşullarında yalnızca görsel ve manyetik telemetriyle rota çizen sürü zekası modeli.",
        status: "IDEA",
        visibility: "SEMI_PUBLIC",
        accessPassword: "nuper",
        aiBudgetEstimate: "60.000 USD",
        aiTimeEstimate: "5 Ay",
        user: { name: "Nuper Skunkworks" }
    },
    {
        id: "idea-concept-03",
        title: "DÜŞ-03 // Egemen Mikro-Veri Merkezi Modülü",
        description: "Şebeke elektriği ve internet omurgası çöktüğünde kendi enerjisini üreten, yerel fiziksel yapay zekayı izole olarak çalıştıran zırhlı konteyner bilişim ünitesi.",
        status: "IDEA",
        visibility: "PUBLIC",
        aiBudgetEstimate: "110.000 USD",
        aiTimeEstimate: "8 Ay",
        user: { name: "Nuper Hardware Engineering" }
    }
];

export default async function IdeasPage() {
    let ideas: ProjectWithUser[] = [];
    try {
        ideas = await prisma.project.findMany({
            where: {
                status: 'IDEA',
                visibility: {
                    in: ['PUBLIC', 'SEMI_PUBLIC']
                }
            },
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } } }
        });
        if (ideas.length === 0) {
            ideas = FALLBACK_IDEAS;
        }
    } catch (e) {
        console.warn("Database connection offline, using sovereign concepts cache:", e);
        ideas = FALLBACK_IDEAS;
    }

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[#080B11] text-white relative overflow-hidden font-sans">
            {/* Subtle Blueprint Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

            <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
                {/* Header Block */}
                <div className="mb-12 border-b border-white/10 pb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded mb-4">
                        <Crosshair className="w-3.5 h-3.5 text-amber-400" />
                        METODOLOJİ // BİRİNCİ PRENSİPLER &amp; DÜŞ MÜHENDİSLİĞİ
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white uppercase mb-4">
                        DÜŞ MÜHENDİSLİĞİ &amp; KONSEPT LABORATUVARI
                    </h1>
                    <p className="text-gray-400 text-base sm:text-lg max-w-3xl leading-relaxed">
                        Mevcut endüstriyel kalıpların ötesinde, henüz çözülmemiş kritik problemleri teşhis ederek tasarladığımız vizyoner mühendislik hipotezleri ve erken aşama konseptler.
                    </p>

                    {/* Methodology Doctrine Quote Box */}
                    <div className="mt-8 p-5 bg-[#0C101A] border-l-2 border-amber-400 border-t border-r border-b border-white/10 rounded-r-lg max-w-3xl">
                        <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-1 font-bold">
                            DOKTRİN // RADİKAL PROBLEM ÇÖZÜMLEME
                        </div>
                        <p className="text-sm text-gray-300 italic font-sans leading-relaxed">
                            &ldquo;Kavramsal mühendislik; sektörün kanıksadığı ve görmezden geldiği kritik sistemik darboğazları saptamak ve tavizsiz bir disiplinle deterministik çözümü inşa etmektir. Buradaki tüm konseptler, geleceğin operasyonel savunma ve derin teknoloji sistemlerine aday birer mimari çekirdektir.&rdquo;
                        </p>
                    </div>

                    {/* Telemetry Summary Stats */}
                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl">
                        <div className="p-3.5 rounded-lg bg-[#0C101A] border border-white/10">
                            <div className="text-[10px] font-mono text-gray-500 uppercase">AKTİF HİPOTEZ</div>
                            <div className="text-lg font-mono font-bold text-white mt-0.5">{ideas.length} KONSEPT</div>
                        </div>
                        <div className="p-3.5 rounded-lg bg-[#0C101A] border border-white/10">
                            <div className="text-[10px] font-mono text-gray-500 uppercase">METODOLOJİ</div>
                            <div className="text-lg font-mono font-bold text-amber-400 mt-0.5">PROBLEM BULMA</div>
                        </div>
                        <div className="p-3.5 rounded-lg bg-[#0C101A] border border-white/10">
                            <div className="text-[10px] font-mono text-gray-500 uppercase">DOĞRULAMA</div>
                            <div className="text-lg font-mono font-bold text-sky-400 mt-0.5">AR-GE AŞAMASI</div>
                        </div>
                    </div>
                </div>

                {/* Ideas Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {ideas.length === 0 ? (
                        <div className="col-span-full py-24 text-center bg-[#0C101A] rounded-xl border border-white/10 p-8">
                            <Beaker className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-mono font-bold text-white uppercase tracking-wider mb-2">
                                LABORATUVARDA YENİ HİPOTEZLER İŞLENİYOR
                            </h3>
                            <p className="text-sm font-mono text-gray-500 max-w-md mx-auto">
                                Ar-Ge ekibi mevcut konseptlerin matematiksel ve mimari fizibilite testlerini sürdürmektedir.
                            </p>
                        </div>
                    ) : (
                        ideas.map((idea: ProjectWithUser) => (
                            <ProjectCard key={idea.id} project={idea} isIdea={true} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}


