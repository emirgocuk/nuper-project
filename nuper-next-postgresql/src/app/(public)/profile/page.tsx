import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="max-w-2xl px-4 mx-auto">
                <Card className="shadow-lg border-none">
                    <CardHeader className="text-center pb-2">
                        <div className="flex justify-center mb-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                                <AvatarFallback className="text-2xl bg-nuper-blue text-white">
                                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <CardTitle className="text-2xl font-bold font-heading text-nuper-dark-blue">
                            {session.user.name}
                        </CardTitle>
                        <p className="text-gray-500">{session.user.email}</p>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Hesap Bilgileri</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">Kullanıcı Rolü</label>
                                    <p className="mt-1 text-gray-900 font-medium">{session.user.role === 'ADMIN' ? 'Yönetici' : 'Kullanıcı'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">Üyelik Tarihi</label>
                                    {/* Real date can be fetched if we extend session/User type further or fetch from DB */}
                                    <p className="mt-1 text-gray-900 font-medium">Aktif</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Ayarlar</h3>
                            <p className="text-sm text-gray-500">Hesap ayarları ve şifre işlemleri yakında eklenecektir.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
