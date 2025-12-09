import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";

export default async function MyProjectsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="max-w-4xl px-4 mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-heading text-nuper-dark-blue">Proje Başvurularım</h1>
                    <p className="text-gray-600 mt-2">Gönderdiğiniz tüm projelerin durumunu buradan takip edebilirsiniz.</p>
                </div>

                <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 mb-4 rounded-full bg-blue-50">
                        <FolderOpen className="w-8 h-8 text-nuper-blue" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Henüz Bir Proje Başvurunuz Yok</h3>
                    <p className="mt-1 max-w-sm text-gray-500">
                        Yeni bir fikir mi var? Hemen projenizi paylaşın ve destek alın.
                    </p>
                    {/* Add Link to Project Application form if it exists, or just leave as empty state */}
                </div>
            </div>
        </div>
    );
}
