import { prisma } from "@/lib/db";
import { ProjectCard } from "@/components/ProjectCard";

export default async function ProjectsPage() {
    // Fetch only actual projects (status is NOT 'IDEA') that are public or semi-public
    const projects = await prisma.project.findMany({
        where: {
            NOT: {
                status: 'IDEA'
            },
            visibility: {
                in: ['PUBLIC', 'SEMI_PUBLIC']
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
                            <ProjectCard key={project.id} project={project} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

