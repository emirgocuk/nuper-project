import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, CheckSquare, Users } from "lucide-react";
import { prisma } from "@/lib/db";

export default async function AdminDashboard() {


    const stats = [
        {
            title: "Toplam Etkinlik",
            value: await prisma.event.count(),
            icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
        },
        {
            title: "Toplam Bülten",
            value: await prisma.bulletin.count(),
            icon: <FileText className="h-4 w-4 text-muted-foreground" />,
        },
        {
            title: "Bekleyen Projeler",
            value: await prisma.project.count({ where: { status: 'SUBMITTED' } }),
            icon: <CheckSquare className="h-4 w-4 text-muted-foreground" />,
        },
        {
            title: "Kayıtlı Kullanıcılar",
            value: await prisma.user.count(),
            icon: <Users className="h-4 w-4 text-muted-foreground" />,
        }
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            {stat.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity Section could go here */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Son Projeler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Henüz proje gönderilmedi.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
