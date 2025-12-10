import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Strict access control: Only admin@nuper.com allowed as per user request
    if (!session?.user || session.user.email !== "admin@nuper.com") {
        redirect("/adminlogin");
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
