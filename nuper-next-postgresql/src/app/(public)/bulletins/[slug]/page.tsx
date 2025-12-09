import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import BlockRenderer from "@/components/content/BlockRenderer";
import { User, Clock, FileText } from "lucide-react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function BulletinDetailPage(props: PageProps) {
    const params = await props.params;
    const { slug } = params;

    const bulletin = await prisma.bulletin.findUnique({
        where: { slug },
    });

    if (!bulletin) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
                    {/* Hero Image */}
                    {bulletin.cardImage && (
                        <div className="relative w-full h-[400px]">
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
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 font-medium">
                            {bulletin.publisher && (
                                <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1 rounded-full">
                                    <User className="w-4 h-4" />
                                    <span>{bulletin.publisher}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                                <Clock className="w-4 h-4" />
                                <span>{new Date(bulletin.createdAt).toLocaleDateString('tr-TR')}</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                            {bulletin.title}
                        </h1>
                    </div>
                </div>

                {/* Content Section */}
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                    <BlockRenderer content={bulletin.content} />
                </div>
            </div>
        </article>
    );
}
