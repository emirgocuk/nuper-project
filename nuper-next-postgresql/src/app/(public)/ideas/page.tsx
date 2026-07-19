import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";

interface ProjectWithUser {
    id: string;
    title: string;
    description: string | null;
    status: string;
    user: { name: string | null } | null;
}

export default async function IdeasPage() {
    // Fetch only ideas (status is 'IDEA')
    const ideas = await prisma.project.findMany({
        where: {
            status: 'IDEA'
        },
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } }
    });

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#0b1120] text-white relative overflow-hidden font-sans">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] bg-indigo-600/10 blur-[180px] rounded-full pointer-events-none z-0"></div>

            <div className="max-w-6xl px-4 mx-auto relative z-10">
                <div className="mb-12 text-center md:text-left">
                    <h1 className="mb-4 text-4xl font-bold font-heading tracking-wide text-white">Fikirlerimiz</h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Gelecekte hayata geçirmeyi planladığımız Ar-Ge aşamasındaki fikirlerimiz ve vizyoner konsept tasarımlarımız.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {ideas.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                            <p className="text-xl text-gray-400">Henüz listelenen fikir bulunmuyor.</p>
                        </div>
                    ) : (
                        ideas.map((idea: ProjectWithUser) => (
                            <Card key={idea.id} className="h-full bg-glass border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 flex flex-col justify-between">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start">
                                        <div className="p-2.5 bg-yellow-500/10 border border-yellow-400/20 rounded-xl text-yellow-300">
                                            <Lightbulb className="w-6 h-6" />
                                        </div>
                                        <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30" variant="outline">
                                            Fikir/Konsept
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl mt-5 text-white font-heading font-bold">{idea.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 flex-1 flex flex-col justify-between">
                                    <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-1 line-clamp-4">{idea.description}</p>
                                    {idea.user && (
                                        <div className="text-xs text-gray-500 border-t border-white/5 pt-4 flex justify-between items-center">
                                            <span>Müellif</span>
                                            <span className="font-semibold text-gray-300">{idea.user.name || 'Nuper Industries'}</span>
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
