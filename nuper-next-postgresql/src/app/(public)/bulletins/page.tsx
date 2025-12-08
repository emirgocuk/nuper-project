import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FileText } from "lucide-react";

export default async function BulletinsPage() {
    const bulletins = await prisma.bulletin.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="max-w-6xl px-4 mx-auto">
                <h1 className="mb-8 text-4xl font-bold font-heading text-nuper-dark-blue">Bültenler</h1>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {bulletins.length === 0 ? (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-xl text-gray-500">Şu an yayınlanmış bülten bulunmuyor.</p>
                        </div>
                    ) : (
                        bulletins.map((bulletin: any) => (
                            <Link href={`/bulletins/${bulletin.slug}`} key={bulletin.id} className="block transition-transform duration-300 hover:-translate-y-1">
                                <Card className="h-full overflow-hidden border-none shadow-md hover:shadow-xl">
                                    <div className="h-48 overflow-hidden bg-gray-200">
                                        <img
                                            src={bulletin.cardImage || 'https://placehold.co/600x400/172554/ffffff?text=Nuper+Bulten'}
                                            alt={bulletin.title}
                                            className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>
                                    <CardHeader>
                                        <div className="flex items-center gap-2 mb-2 text-sm text-nuper-blue font-medium">
                                            <FileText className="w-4 h-4" />
                                            <span>{new Date(bulletin.createdAt).toLocaleDateString("tr-TR")}</span>
                                        </div>
                                        <CardTitle className="text-xl leading-tight text-nuper-dark-blue line-clamp-2">{bulletin.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 line-clamp-3">{bulletin.publisher}</p>
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
