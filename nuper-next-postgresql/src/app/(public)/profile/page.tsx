import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, Shield, Camera, AlertCircle, CheckCircle, Clock } from "lucide-react";
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
                    <Card className="overflow-hidden border-none shadow-md">
                        <CardHeader className="pb-3 bg-white">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Shield className="w-6 h-6 text-nuper-blue" />
                                {roleText} Doğrulaması
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white">
                            {user.isVerified ? (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-4 items-start">
                                    <div className="p-2 bg-green-100 rounded-full shrink-0">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-green-800">Hesabınız Doğrulandı</h4>
                                        <p className="text-green-700 mt-1">
                                            Tebrikler! Hesabınız başarıyla doğrulandı. {roleText} olarak platformun tüm özelliklerine erişebilirsiniz.
                                        </p>
                                    </div>
                                </div>
                            ) : (user.verificationData && Object.keys(user.verificationData as object).length > 0) ? (
                                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex gap-4 items-start">
                                    <div className="p-2 bg-orange-100 rounded-full shrink-0">
                                        <Clock className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-orange-800">Doğrulama İnceleniyor</h4>
                                        <p className="text-orange-700 mt-1">
                                            Başvurunuz alındı ve ekibimiz tarafından inceleniyor. Bu süreç genellikle 24-48 saat sürmektedir. Sonuçlandığında size bildirim gönderilecektir.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-4 items-start">
                                    <div className="p-2 bg-yellow-100 rounded-full shrink-0">
                                        <AlertCircle className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-yellow-800">Doğrulama Gerekli</h4>
                                        <p className="text-yellow-700 mt-1">
                                            Henüz doğrulama işlemini tamamlamadınız. Profilinizi güvenilir kılmak ve öne çıkmak için lütfen aşağıdaki formu eksiksiz doldurarak onaya gönderin.
                                        </p>
                                    </div>
                                </div>
                            )}
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
