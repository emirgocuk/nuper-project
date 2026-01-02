import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, CheckSquare, Users } from "lucide-react";
import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
    let eventCount = 0;
    let bulletinCount = 0;
    let projectCount = 0;
    let userCount = 0;
    let hasError = false;

    try {
        [eventCount, bulletinCount, projectCount, userCount] = await Promise.all([
            prisma.event.count(),
            prisma.bulletin.count(),
            prisma.project.count({ where: { status: 'SUBMITTED' } }),
            prisma.user.count(),
        ]);
    } catch (error) {
        console.error("Failed to fetch admin stats", error);
        hasError = true;
    }

    if (hasError) {
        return (
            <div className="space-y-8">
                <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
                <Card>
                    <CardContent className="py-10 text-center text-destructive">
                        İstatistikler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
                    </CardContent>
                </Card>
            </div>
        );
    }

    const stats = [
        {
            title: "Toplam Etkinlik",
            value: eventCount,
            icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
        },
        {
            title: "Toplam Bülten",
            value: bulletinCount,
            icon: <FileText className="h-4 w-4 text-muted-foreground" />,
        },
        {
            title: "Bekleyen Projeler",
            value: projectCount,
            icon: <CheckSquare className="h-4 w-4 text-muted-foreground" />,
        },
        {
            title: "Kayıtlı Kullanıcılar",
            value: userCount,
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
