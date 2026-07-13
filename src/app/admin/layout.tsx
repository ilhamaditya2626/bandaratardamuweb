import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Plane, Users, Newspaper, LayoutDashboard, LogOut, TrendingUp, MessageSquareText, Tags } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let session = null;

    try {
        session = await auth.api.getSession({
            headers: await headers(),
        });
    } catch (error) {
        console.error("Failed to get admin session:", error);
    }

    if (!session) {
        redirect("/login");
    }


    const navItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Penerbangan", href: "/admin/flights", icon: Plane },
        { name: "Harga Tiket", href: "/admin/ticket-prices", icon: Tags },
        { name: "Penumpang", href: "/admin/passengers", icon: Users },
        { name: "Berita", href: "/admin/news", icon: Newspaper },
        { name: "Kritik & Saran", href: "/admin/feedback", icon: MessageSquareText },
        { name: "Stats", href: "/admin/stats", icon: TrendingUp },
    ];

    return (
        <div className={`${inter.className} min-h-screen bg-slate-50 flex`}>
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex sticky top-0 h-screen">
                <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900">
                    <h1 className="text-xl font-bold text-white tracking-tight">Admin Console</h1>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-slate-800 hover:text-white group"
                        >
                            <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-sky-400" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                    <div className="flex items-center px-2">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{session.user.name}</p>
                            <p className="text-xs text-slate-400 truncate">{session.user.email}</p>
                        </div>
                        <Link href="/api/auth/signout" className="ml-2 p-2 text-slate-400 hover:text-red-400 rounded-md transition-colors" title="Logout">
                            <LogOut className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </aside>
            <div className="flex-1 flex flex-col min-h-screen">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-semibold text-slate-800 md:hidden">Admin Panel</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500 hidden sm:inline-block">
                            Status: <span className="text-green-600 font-medium">Online</span>
                        </span>
                        <Link href="/" className="text-sm text-sky-600 hover:underline font-medium">View Website</Link>
                    </div>
                </header>
                <main className="flex-1 p-6 md:p-10 bg-slate-50 min-h-0">
                    <div className="max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
