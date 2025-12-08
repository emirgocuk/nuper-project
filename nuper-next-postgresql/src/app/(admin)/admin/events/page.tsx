import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";

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
                            <CardHeader>
                                <CardTitle>{event.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500">{new Date(event.createdAt).toLocaleDateString("tr-TR")}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
