import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit } from "lucide-react";
import { prisma } from "@/lib/db";
import { deleteBulletin } from "@/actions/bulletins";

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
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-bold">{bulletin.title}</CardTitle>
                                <div className="flex items-center gap-2">
                                    <Link href={`/admin/bulletins/${bulletin.id}/edit`}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="w-4 h-4 mr-1" />
                                            Düzenle
                                        </Button>
                                    </Link>
                                    <form action={async () => {
                                        'use server';
                                        await deleteBulletin(bulletin.id);
                                    }}>
                                        <Button variant="destructive" size="sm" type="submit">Sil</Button>
                                    </form>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500 mb-2">
                                    {new Date(bulletin.createdAt).toLocaleDateString("tr-TR")} - {bulletin.published ? 'Yayında' : 'Taslak'}
                                </p>
                                <p className="text-sm text-gray-600">Yayıncı: {bulletin.publisher}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
