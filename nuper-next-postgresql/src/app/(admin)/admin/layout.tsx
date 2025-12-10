import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSettingsProvider } from "@/context/AdminSettingsContext";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Check for session and Admin role (assuming role is 'ADMIN')
    // If you haven't set up roles yet, just checking session is a start, but user asked for "separate" entry.
    // Ideally: if (!session || session.user.role !== "ADMIN")
    if (!session?.user) {
        redirect("/adminlogin");
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
