import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import BlockRenderer from "@/components/content/BlockRenderer";
import { Calendar, User, Clock } from "lucide-react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function EventDetailPage(props: PageProps) {
    const params = await props.params;
    const { slug } = params;

    const event = await prisma.event.findUnique({
        where: { slug },
    });

    if (!event) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
                    {/* Hero Image */}
                    {event.cardImage && (
                        <div className="relative w-full h-[400px]">
                            <Image
                                src={event.cardImage}
                                alt={event.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <div className="p-8 md:p-12">
                        {/* Meta Data */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 font-medium">
                            {event.date && (
                                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                    <Calendar className="w-4 h-4" />
                                    <span>{event.date}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                                <Clock className="w-4 h-4" />
                                <span>{new Date(event.createdAt).toLocaleDateString('tr-TR')}</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            {event.title}
                        </h1>

                        {/* Description */}
                        {event.description && (
                            <p className="text-xl text-gray-600 leading-relaxed border-l-4 border-nuper-blue pl-6 italic">
                                {event.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                    <BlockRenderer content={event.content} />
                </div>
            </div>
        </article>
    );
}
