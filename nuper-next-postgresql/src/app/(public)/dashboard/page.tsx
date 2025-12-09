import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="max-w-6xl px-4 mx-auto space-y-8">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-heading text-nuper-dark-blue">
                            Hoş Geldin, {session.user.name || "Kullanıcı"}
                        </h1>
                        <p className="text-gray-600 mt-2">Projelerini ve aktivitelerini buradan yönetebilirsin.</p>
                    </div>
                    <Link href="/projects/new">
                        <Button className="bg-nuper-blue hover:bg-nuper-dark-blue">
                            <Plus className="w-4 h-4 mr-2" />
                            Proje Paylaş
                        </Button>
                    </Link>
                </div>

                {/* Stats or Quick Info */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Toplam Proje</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Onaylanan Projeler</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">0</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Yıldız Puanı</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-500">0</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Projects List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">Projelerim</h2>
                    <Card>
                        <CardContent className="py-10 text-center text-muted-foreground">
                            Henüz göndermiş olduğun bir proje yok. Yeni bir fikirle başla!
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
