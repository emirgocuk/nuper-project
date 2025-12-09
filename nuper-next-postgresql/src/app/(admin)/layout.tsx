import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Basic role check - in a real app, check for "ADMIN" role
    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen bg-white">
            <AdminSidebar user={session?.user} />
            <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
                {children}
            </main>
        </div>
    );
}
