import { prisma } from "@/lib/db";
import { ProjectCard } from "@/components/ProjectCard";

interface ProjectWithUser {
    id: string;
    title: string;
    description: string | null;
    status: string;
    visibility: string;
    accessPassword?: string | null;
    aiBudgetEstimate?: string | null;
    aiTimeEstimate?: string | null;
    aiDifficultyScore?: number | null;
    aiFeasibilityReport?: string | null;
    user: { name: string | null } | null;
}

export default async function IdeasPage() {
    // Fetch only ideas (status is 'IDEA') that are public or semi-public
    const ideas = await prisma.project.findMany({
        where: {
            status: 'IDEA',
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
                            <ProjectCard key={idea.id} project={idea} isIdea={true} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

