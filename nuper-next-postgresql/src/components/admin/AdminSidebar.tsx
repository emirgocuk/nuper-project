'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Calendar, FileText, FolderOpen, FileSignature, LogOut } from 'lucide-react';

export function AdminSidebar({ user }: { user?: { name?: string | null, email?: string | null } }) {
    const pathname = usePathname();

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/events", label: "Etkinlik Yönetimi", icon: Calendar },
        { href: "/admin/bulletins", label: "Bülten Yönetimi", icon: FileText },
        { href: "/admin/projects", label: "Proje İnceleme", icon: FolderOpen },
        // { href: "/admin/contracts", label: "Sözleşme Yönetimi", icon: FileSignature },
    ];

    return (
        <aside className="sticky top-0 flex flex-col w-64 h-screen p-6 text-white shadow-lg bg-nuper-dark-blue transition-all duration-300">
            <h1 className="mb-8 text-2xl font-bold font-heading tracking-wide">Nuper Admin</h1>

            <nav className="flex-grow overflow-y-auto pr-2 scrollbar-hide">
                <ul className="space-y-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group hover:bg-nuper-blue/50",
                                        isActive ? "bg-nuper-blue shadow-md text-white" : "text-gray-300 hover:text-white"
                                    )}
                                >
                                    <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive && "text-white")} />
                                    <span className="font-medium text-sm">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="pt-6 mt-auto border-t border-gray-700/50">
                {user && (
                    <div className="mb-4 px-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Giriş Yapıldı</p>
                        <p className="text-sm font-medium text-white truncate" title={user.email || ''}>{user.email}</p>
                    </div>
                )}
                <button
                    onClick={() => console.log('Logout clicked - implement server action')}
                    className="flex items-center justify-center w-full gap-2 px-4 py-2.5 text-sm font-bold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                    <LogOut className="w-4 h-4" />
                    Çıkış Yap
                </button>
            </div>
        </aside>
    );
}
