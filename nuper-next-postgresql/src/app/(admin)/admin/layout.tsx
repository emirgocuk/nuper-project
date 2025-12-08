import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Basic role check - in a real app, check for "ADMIN" role
    // if (!session?.user) {
    //     redirect("/login");
    // }

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block">
                <div className="p-6">
                    <h2 className="text-2xl font-bold font-heading text-nuper-dark-blue dark:text-white">Nuper Admin</h2>
                </div>
                <nav className="mt-6">
                    <div className="px-4 space-y-2">
                        <Link href="/admin" className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                            Dashboard
                        </Link>
                        <Link href="/admin/events" className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                            Etkinlikler
                        </Link>
                        <Link href="/admin/bulletins" className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                            Bültenler
                        </Link>
                        <Link href="/admin/projects" className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                            Projeler
                        </Link>
                    </div>
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                        Çıkış Yap
                    </Button>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
