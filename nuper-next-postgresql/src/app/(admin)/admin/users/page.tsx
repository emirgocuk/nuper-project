import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Users, TrendingUp, Building2, UserCheck } from 'lucide-react';
import UsersClient from '@/components/admin/UsersClient';

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            userRole: true,
            isVerified: true,
            profileImage: true,
            createdAt: true,
            profileData: true,
            verificationData: true,
            socialLinks: true,
        }
    });

    // Separation of concerns: Exclude Admins from regular lists
    const investors = users.filter(u => u.userRole === 'INVESTOR' && u.role !== 'ADMIN');
    const entrepreneurs = users.filter(u => u.userRole === 'ENTREPRENEUR' && u.role !== 'ADMIN');
    const admins = users.filter(u => u.role === 'ADMIN');

    // Metrics
    const totalUsers = users.length;
    const verifiedUsers = users.filter(u => u.isVerified).length;
    const pendingVerifications = users.filter(u => !u.isVerified && (u.verificationData as any)?.status === 'PENDING').length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Kullanıcı Yönetimi</h2>
                    <p className="text-muted-foreground mt-1">Sistemdeki tüm yatırımcı ve girişimcileri yönetin.</p>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <p className="text-xs text-muted-foreground">Aktif sisteme kayıtlı</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Onay Bekleyenler</CardTitle>
                        <AlertBadge count={pendingVerifications} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingVerifications}</div>
                        <p className="text-xs text-muted-foreground">İşlem bekleyen doğrulama</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Yatırımcılar</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{investors.length}</div>
                        <p className="text-xs text-muted-foreground">Sermaye sağlayanlar</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Girişimciler</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{entrepreneurs.length}</div>
                        <p className="text-xs text-muted-foreground">Proje sahipleri</p>
                    </CardContent>
                </Card>
            </div>

            {/* Client Component for Interactive Lists & Sheets */}
            <UsersClient
                investors={investors}
                entrepreneurs={entrepreneurs}
                admins={admins}
            />
        </div>
    );
}

function AlertBadge({ count }: { count: number }) {
    if (count === 0) return <UserCheck className="h-4 w-4 text-muted-foreground" />;
    return <span className="flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />;
}
