import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default async function EventsPage() {
    const events = await prisma.event.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="max-w-6xl px-4 mx-auto">
                <h1 className="mb-8 text-4xl font-bold font-heading text-nuper-dark-blue">Etkinlikler</h1>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {events.length === 0 ? (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-xl text-gray-500">Şu an planlanan etkinlik bulunmuyor.</p>
                        </div>
                    ) : (
                        events.map((event: any) => (
                            <Link href={`/events/${event.slug}`} key={event.id} className="block transition-transform duration-300 hover:-translate-y-1">
                                <Card className="h-full overflow-hidden border-none shadow-md hover:shadow-xl">
                                    <div className="h-48 overflow-hidden bg-gray-200">
                                        <img
                                            src={event.cardImage || 'https://placehold.co/600x400/1e3a8a/ffffff?text=Nuper+Etkinlik'}
                                            alt={event.title}
                                            className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>
                                    <CardHeader>
                                        <div className="flex items-center gap-2 mb-2 text-sm text-nuper-blue font-medium">
                                            <Calendar className="w-4 h-4" />
                                            <span>{event.date || 'Tarih Belirlenmedi'}</span>
                                        </div>
                                        <CardTitle className="text-xl leading-tight text-nuper-dark-blue line-clamp-2">{event.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 line-clamp-3">{event.description}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
