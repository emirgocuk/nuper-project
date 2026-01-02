"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit } from "lucide-react";
import StarButton from "@/components/StarButton";

const PAGE_SIZE = 10;

interface Event {
    id: string;
    title: string;
    description: string | null;
    createdAt: Date;
    published: boolean;
    isFeatured: boolean;
}

export default function AdminEventsPage() {
    const [page, setPage] = useState(1);
    const [events, setEvents] = useState<Event[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/admin/events?page=${page}&pageSize=${PAGE_SIZE}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                const data = await response.json();
                setEvents(data.events);
                setTotal(data.total);
            } catch (err) {
                console.error("Failed to fetch events", err);
                setError("Etkinlikler yüklenirken bir hata oluştu.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [page]);

    const handleDelete = async (eventId: string) => {
        if (!confirm("Bu etkinliği silmek istediğinizden emin misiniz?")) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/events/${eventId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete event');
            }

            setEvents(events.filter(e => e.id !== eventId));
            setTotal(total - 1);
        } catch (err) {
            console.error("Failed to delete event", err);
            alert("Etkinlik silinirken bir hata oluştu.");
        }
    };

    const totalPages = Math.ceil(total / PAGE_SIZE);

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

            {loading ? (
                <Card>
                    <CardContent className="py-10 text-center text-muted-foreground">
                        Yükleniyor...
                    </CardContent>
                </Card>
            ) : error ? (
                <Card>
                    <CardContent className="py-10 text-center text-destructive">
                        {error}
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid gap-4">
                        {events.length === 0 ? (
                            <Card>
                                <CardContent className="py-10 text-center text-muted-foreground">
                                    Henüz etkinlik bulunmuyor. Yeni bir etkinlik ekleyin.
                                </CardContent>
                            </Card>
                        ) : (
                            events.map((event) => (
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
                                            <Button 
                                                variant="destructive" 
                                                size="sm" 
                                                onClick={() => handleDelete(event.id)}
                                            >
                                                Sil
                                            </Button>
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

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Önceki
                            </Button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <Button
                                    key={p}
                                    variant={page === p ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setPage(p)}
                                >
                                    {p}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Sonraki
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
