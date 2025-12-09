import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit } from "lucide-react";
import { prisma } from "@/lib/db";
import { deleteEvent } from "@/actions/events";
import StarButton from "@/components/StarButton";

export default async function AdminEventsPage() {
    const events = await prisma.event.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-heading">Etkinlikler</h1>
                <Link href="/admin/events/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Etkinlik
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {events.length === 0 ? (
                    <Card>
                        <CardContent className="py-10 text-center text-muted-foreground">
                            Henüz etkinlik bulunmuyor. Yeni bir etkinlik ekleyin.
                        </CardContent>
                    </Card>
                ) : (
                    events.map((event: any) => (
                        <Card key={event.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-lg font-bold">{event.title}</CardTitle>
                                    {event.isFeatured && (
                                        <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                                            Öne Çıkan
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <StarButton eventId={event.id} isFeatured={event.isFeatured} />
                                    <Link href={`/admin/events/${event.id}/edit`}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="w-4 h-4 mr-1" />
                                            Düzenle
                                        </Button>
                                    </Link>
                                    <form action={async () => {
                                        'use server';
                                        await deleteEvent(event.id);
                                    }}>
                                        <Button variant="destructive" size="sm" type="submit">Sil</Button>
                                    </form>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500 mb-2">
                                    {new Date(event.createdAt).toLocaleDateString("tr-TR")} - {event.published ? 'Yayında' : 'Taslak'}
                                </p>
                                <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
