import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderGit2, Cpu, Rocket } from "lucide-react";

export default async function ProjectsPage() {
    // Fetch only actual projects (status is NOT 'IDEA')
    const projects = await prisma.project.findMany({
        where: {
            NOT: {
                status: 'IDEA'
            }
        },
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } }
    });

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#0b1120] text-white relative overflow-hidden font-sans">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] bg-blue-600/10 blur-[180px] rounded-full pointer-events-none z-0"></div>

            <div className="max-w-6xl px-4 mx-auto relative z-10">
                <div className="mb-12 text-center md:text-left">
                    <h1 className="mb-4 text-4xl font-bold font-heading tracking-wide text-white">Projelerimiz</h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Nuper Industries bünyesinde geliştirilen, teknoloji ve mühendislik odaklı aktif veya tamamlanmış inovasyonlarımız.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                            <p className="text-xl text-gray-400">Henüz yayınlanmış bir proje bulunmuyor.</p>
                        </div>
                    ) : (
                        projects.map((project: any) => (
                            <Card key={project.id} className="h-full bg-glass border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 flex flex-col justify-between">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start">
                                        <div className="p-2.5 bg-blue-500/10 border border-blue-400/20 rounded-xl text-blue-300">
                                            <Cpu className="w-6 h-6" />
                                        </div>
                                        <Badge className={
                                            project.status === 'COMPLETED' 
                                                ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                                                : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                        } variant="outline">
                                            {project.status === 'COMPLETED' ? 'Tamamlandı' : 'Devam Ediyor'}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl mt-5 text-white font-heading font-bold">{project.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 flex-1 flex flex-col justify-between">
                                    <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-1 line-clamp-4">{project.description}</p>
                                    {project.user && (
                                        <div className="text-xs text-gray-500 border-t border-white/5 pt-4 flex justify-between items-center">
                                            <span>Geliştirici</span>
                                            <span className="font-semibold text-gray-300">{project.user.name || 'Nuper Industries'}</span>
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
