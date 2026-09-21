import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BlockRenderer from "@/components/content/BlockRenderer";
import { User, Clock, ArrowLeft, Shield } from "lucide-react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

const FALLBACK_BULLETINS_MAP: Record<string, any> = {
    "sovereign-systems-v2": {
        id: "announcement-01",
        slug: "sovereign-systems-v2",
        title: "Nuper Systems V2: Yerel Yapay Zeka ve Otonom Sensör Ağları Lansmanı",
        description: "Dış ağ bağlantısı gerektirmeyen izole ortamlarda görev icra eden egemen sistem mimarimizin yeni sürüm notları ve teknik saha sonuçları.",
        cardImage: "https://placehold.co/800x600/0c101a/ffffff?text=Nuper+Announcement",
        createdAt: new Date().toISOString(),
        publisher: "Nuper Systems Ar-Ge",
        content: JSON.stringify([
            {
                type: "paragraph",
                children: [{ text: "Nuper Systems V2, dış ağ bağımlılığı olmaksızın çalışan yerel fiziksel yapay zeka ve sensör füzyonu algoritmalarının sahadaki en son versiyonudur. Bu sürümde gecikme süreleri milisaniyeler seviyesine indirilmiş ve tam izole donanım desteği eklenmiştir." }]
            }
        ])
    },
    "first-principles-architecture": {
        id: "announcement-02",
        slug: "first-principles-architecture",
        title: "Kritik Sistemlerde Birinci Prensipler Yaklaşımı: Teknik Bildiri",
        description: "Savunma teknolojileri ve derin kod altyapılarında bağımsız sermaye ile deterministik sistem inşasına ilişkin kapsamlı mimari değerlendirme.",
        cardImage: "https://placehold.co/800x600/0c101a/ffffff?text=Technical+Paper",
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        publisher: "Nuper Engineering Group",
        content: JSON.stringify([
            {
                type: "paragraph",
                children: [{ text: "Mühendislikte birinci prensipler yaklaşımı, endüstriyel ezberleri sorgulamayı ve problemin en yalın fiziksel bileşenlerine odaklanmayı gerektirir. Nuper sistemleri bu felsefeyle sıfırdan inşa edilmektedir." }]
            }
        ])
    }
};

export default async function BulletinDetailPage(props: PageProps) {
    const params = await props.params;
    const { slug } = params;

    let bulletin: any = null;
    try {
        bulletin = await prisma.bulletin.findUnique({
            where: { slug },
        });
    } catch (e) {
        console.warn("DB offline, checking fallback announcements:", e);
    }

    if (!bulletin && FALLBACK_BULLETINS_MAP[slug]) {
        bulletin = FALLBACK_BULLETINS_MAP[slug];
    }

    if (!bulletin) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-[#080B11] text-white pt-28 pb-20 font-sans relative overflow-hidden">
            {/* Subtle Blueprint Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <Link
                    href="/bulletins"
                    className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors mb-8 uppercase tracking-wider"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Tüm Duyurulara Dön
                </Link>

                {/* Header Card */}
                <div className="bg-[#0C101A] border border-white/10 rounded-2xl overflow-hidden mb-8">
                    {bulletin.cardImage && (
                        <div className="relative w-full h-[380px] border-b border-white/10">
                            <Image
                                src={bulletin.cardImage}
                                alt={bulletin.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <div className="p-8 md:p-12">
                        {/* Meta Data */}
                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400 mb-6">
                            {bulletin.publisher && (
                                <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded">
                                    <Shield className="w-3.5 h-3.5" />
                                    <span>{bulletin.publisher}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/10 px-3 py-1 rounded">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                <span>{new Date(bulletin.createdAt).toLocaleDateString('tr-TR')}</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-bold font-heading text-white leading-tight">
                            {bulletin.title}
                        </h1>
                    </div>
                </div>

                {/* Content Section */}
                <div className="bg-[#0C101A] border border-white/10 rounded-2xl p-8 md:p-12 text-gray-300 leading-relaxed">
                    {bulletin.content ? (
                        <BlockRenderer content={bulletin.content} />
                    ) : (
                        <p className="text-base text-gray-300 leading-relaxed">{bulletin.description}</p>
                    )}
                </div>
            </div>
        </article>
    );
}

