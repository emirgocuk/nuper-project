import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";

export default async function AdminBulletinsPage() {
    const bulletins = await prisma.bulletin.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-heading">Bültenler</h1>
                <Link href="/admin/bulletins/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Bülten
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {bulletins.length === 0 ? (
                    <Card>
                        <CardContent className="py-10 text-center text-muted-foreground">
                            Henüz bülten bulunmuyor. Yeni bir bülten ekleyin.
                        </CardContent>
                    </Card>
                ) : (
                    bulletins.map((bulletin: any) => (
                        <Card key={bulletin.id}>
                            <CardHeader>
                                <CardTitle>{bulletin.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500">{new Date(bulletin.createdAt).toLocaleDateString("tr-TR")}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
