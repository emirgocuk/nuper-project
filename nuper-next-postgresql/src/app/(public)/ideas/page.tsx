import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderGit2 } from "lucide-react";

export default async function IdeasPage() {
    // In a real scenario, fetch ideas from DB. Assuming 'Idea' model exists.
    // If not seeded, this might be empty.
    const ideas = await prisma.idea.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } }
    });

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="max-w-6xl px-4 mx-auto">
                <h1 className="mb-8 text-4xl font-bold font-heading text-nuper-dark-blue">Fikirlerimiz</h1>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {ideas.length === 0 ? (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-xl text-gray-500">Henüz listelenen fikir bulunmuyor.</p>
                        </div>
                    ) : (
                        ideas.map((idea: any) => (
                            <Card key={idea.id} className="h-full overflow-hidden border-none shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                                <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-4">
                                    <div className="flex justify-between items-start">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <FolderGit2 className="w-6 h-6 text-nuper-blue" />
                                        </div>
                                        <Badge variant={idea.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                            {idea.status === 'COMPLETED' ? 'Tamamlandı' : 'Devam Ediyor'}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl mt-4 text-nuper-dark-blue">{idea.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <p className="text-gray-600 line-clamp-3 mb-4">{idea.description}</p>
                                    {idea.user && (
                                        <div className="text-sm text-gray-500">
                                            Yürütücü: <span className="font-medium text-gray-700">{idea.user.name || 'Gizli'}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
