import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, Shield, Camera } from "lucide-react";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";
import ProfileInfoForm from "@/components/profile/ProfileInfoForm";
import DeleteAccount from "@/components/profile/DeleteAccount";
import { prisma } from "@/lib/db";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/login");
    }

    // Fetch full user data from database
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        redirect("/login");
    }

    const memberSince = new Date(user.createdAt).toLocaleDateString("tr-TR", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const roleText = user.userRole === "INVESTOR" ? "Yatırımcı" : user.userRole === "ENTREPRENEUR" ? "Girişimci" : "Kullanıcı";

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="max-w-4xl px-4 mx-auto space-y-6">
                {/* Profile Header */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-6">
                            <ProfileImageUpload currentImage={user.profileImage} userId={user.id} />
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-nuper-dark-blue">{user.name}</h1>
                                <p className="text-gray-600">{user.email}</p>
                                <div className="flex flex-wrap gap-3 mt-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>Üyelik: {memberSince}</span>
                                    </div>
                                    {user.userRole && (
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 text-sm font-semibold bg-nuper-blue/10 text-nuper-blue rounded-full">
                                                {roleText}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Verification Section */}
                {user.userRole && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                {roleText} Doğrulaması
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    {user.isVerified ? (
                                        <span className="text-green-600 font-semibold">✓ Doğrulandı</span>
                                    ) : (
                                        <span className="text-amber-600">Doğrulama bekliyor</span>
                                    )}
                                </p>
                                <p className="mt-2 text-sm text-gray-500">
                                    Doğrulama süreciyle ilgili detaylı bilgi yakında eklenecek.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Extended Profile Information */}
                <ProfileInfoForm
                    userRole={user.userRole || ''}
                    isVerified={user.isVerified}
                    initialProfileData={user.profileData}
                    initialSocialLinks={user.socialLinks}
                />

                {/* Account Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Hesap Ayarları</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DeleteAccount />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
