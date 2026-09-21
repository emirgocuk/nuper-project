import { prisma } from "@/lib/db";
import { ProjectCard } from "@/components/ProjectCard";
import { Shield, Terminal, Activity, Layers } from "lucide-react";
import { unstable_noStore as noStore } from 'next/cache';

const FALLBACK_PROJECTS = [
    {
        id: "prj-tactical-01",
        title: "NUPER-OS // Sovereign Defense & Sensor Grid",
        description: "Fiziksel dünya sensörleri ve otonom karar destek mekanizmaları için yerel, deterministik ve dış bağımlılığı sıfıra indirilmiş taktik savunma işletim çekirdeği.",
        status: "COMPLETED",
        visibility: "PUBLIC",
        aiBudgetEstimate: "145.000 USD",
        aiTimeEstimate: "6 Ay",
        user: { name: "Nuper Defense Skunkworks" }
    },
    {
        id: "prj-tactical-02",
        title: "ARES-AI // Tehdit Tespit & Karşı Tedbir Çekirdeği",
        description: "Kritik veri hatları üzerindeki asimetrik saldırı vektörlerini milisaniyeler seviyesinde saptayan ve otonom izolasyon uygulayan yapay zeka savunma sistemi.",
        status: "IN_PROGRESS",
        visibility: "SEMI_PUBLIC",
        accessPassword: "nuper",
        aiBudgetEstimate: "95.000 USD",
        aiTimeEstimate: "4 Ay",
        user: { name: "Nuper Defense Skunkworks" }
    },
    {
        id: "prj-tactical-03",
        title: "HYPERION // Kuantum Dayanıklı Şifreli Haberleşme",
        description: "Merkezi sunuculara ihtiyaç duymadan, eşler arası (P2P) çalışan ve uçtan uca asimetrik şifreleme sunan kapalı devre güvenli haberleşme protokolü.",
        status: "IN_PROGRESS",
        visibility: "PUBLIC",
        aiBudgetEstimate: "80.000 USD",
        aiTimeEstimate: "3 Ay",
        user: { name: "Nuper Core Labs" }
    }
];

export default async function ProjectsPage() {
    noStore();
    let projects: any[] = [];
    try {
        projects = await prisma.project.findMany({
            where: {
                NOT: {
                    status: 'IDEA'
                },
                visibility: {
                    in: ['PUBLIC', 'SEMI_PUBLIC']
                }
            },
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } } }
        });
        if (projects.length === 0) {
            projects = FALLBACK_PROJECTS;
        }
    } catch (e) {
        console.warn("Database connection offline, using sovereign systems cache:", e);
        projects = FALLBACK_PROJECTS;
    }

    const publicCount = projects.filter(p => p.visibility === 'PUBLIC').length;
    const restrictedCount = projects.filter(p => p.visibility === 'SEMI_PUBLIC').length;

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[#080B11] text-white relative overflow-hidden font-sans">
            {/* Subtle Blueprint Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

            <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
                {/* Header Block */}
                <div className="mb-12 border-b border-white/10 pb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono uppercase tracking-widest bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded mb-4">
                        <Terminal className="w-3.5 h-3.5 text-sky-400" />
                        ENVANTER // OPERASYONEL SİSTEMLER
                    </div>
                    
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white uppercase mb-4">
                        SAVUNMA &amp; DERİN TEKNOLOJİ SİSTEMLERİ
                    </h1>
                    <p className="text-gray-400 text-base sm:text-lg max-w-3xl leading-relaxed">
                        Nuper bünyesinde sıfır bürokrasi ve egemen mühendislik iradesiyle geliştirilen operasyonel yazılım mimarileri, savunma teknolojileri ve derin kod sistemleri.
                    </p>

                    {/* Telemetry Summary Stats */}
                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
                        <div className="p-3.5 rounded-lg bg-[#0C101A] border border-white/10">
                            <div className="text-[10px] font-mono text-gray-500 uppercase">AKTİF SİSTEMLER</div>
                            <div className="text-lg font-mono font-bold text-white mt-0.5">{projects.length} SİSTEM</div>
                        </div>
                        <div className="p-3.5 rounded-lg bg-[#0C101A] border border-white/10">
                            <div className="text-[10px] font-mono text-gray-500 uppercase">SEVİYE 01 (AÇIK)</div>
                            <div className="text-lg font-mono font-bold text-sky-400 mt-0.5">{publicCount} MODÜL</div>
                        </div>
                        <div className="p-3.5 rounded-lg bg-[#0C101A] border border-white/10">
                            <div className="text-[10px] font-mono text-gray-500 uppercase">SEVİYE 02 (ŞİFRELİ)</div>
                            <div className="text-lg font-mono font-bold text-amber-400 mt-0.5">{restrictedCount} ÖZEL</div>
                        </div>
                        <div className="p-3.5 rounded-lg bg-[#0C101A] border border-white/10">
                            <div className="text-[10px] font-mono text-gray-500 uppercase">DOKTRİN</div>
                            <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">BOOTSTRAP</div>
                        </div>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.length === 0 ? (
                        <div className="col-span-full py-24 text-center bg-[#0C101A] rounded-xl border border-white/10 p-8">
                            <Layers className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-mono font-bold text-white uppercase tracking-wider mb-2">
                                ENVANTERDE YAYINLANMIŞ PROJE BULUNMUYOR
                            </h3>
                            <p className="text-sm font-mono text-gray-500 max-w-md mx-auto">
                                Yeni operasyonel sistemler geliştirilme ve güvenlik denetimi aşamasındadır.
                            </p>
                        </div>
                    ) : (
                        projects.map((project: any) => (
                            <ProjectCard key={project.id} project={project} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}


