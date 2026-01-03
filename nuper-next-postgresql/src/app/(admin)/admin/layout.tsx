import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSettingsProvider } from "@/context/AdminSettingsContext";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/admin/login");
    }

    if (session.user.role !== "ADMIN") {
        redirect("/admin/login?error=unauthorized");
    }
    return (
        <div className="flex-1 overflow-y-auto bg-white">
            <AdminSettingsProvider>
                <div className="p-6">
                    {children}
                </div>
            </AdminSettingsProvider>
        </div>
    );
}
