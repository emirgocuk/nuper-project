import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { BadgeCheck, Clock, XCircle } from "lucide-react";

export default async function AdminProjectsPage() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' }
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'APPROVED': return <BadgeCheck className="w-5 h-5 text-green-500" />;
            case 'REJECTED': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Clock className="w-5 h-5 text-yellow-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-heading">Projeler</h1>
            </div>

            <div className="grid gap-4">
                {projects.length === 0 ? (
                    <Card>
                        <CardContent className="py-10 text-center text-muted-foreground">
                            Henüz proje başvurusu bulunmuyor.
                        </CardContent>
                    </Card>
                ) : (
                    projects.map((project: any) => (
                        <Link href={`/admin/projects/${project.id}`} key={project.id}>
                            <Card className="hover:bg-gray-50 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl">{project.title}</CardTitle>
                                    {getStatusIcon(project.status)}
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-sm text-gray-500">Sahibi: {project.ownerEmail}</p>
                                        <p className="text-sm text-gray-500">{new Date(project.createdAt).toLocaleDateString("tr-TR")}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
