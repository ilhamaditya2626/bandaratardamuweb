"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plane,
  Users,
  Newspaper,
  LayoutDashboard,
  LogOut,
  TrendingUp,
  MessageSquareText,
  Tags,
  BedDouble,
  Settings,
  Siren,
  FileText,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Penerbangan", href: "/admin/flights", icon: Plane },
  { name: "Harga Tiket", href: "/admin/ticket-prices", icon: Tags },
  { name: "Penumpang", href: "/admin/passengers", icon: Users },
  { name: "Berita", href: "/admin/news", icon: Newspaper },
  { name: "Informasi Serta Merta", href: "/admin/urgent-information", icon: Siren },
  { name: "Formulir PPID", href: "/admin/information-services", icon: FileText },
  { name: "Dokumen Publik", href: "/admin/documents", icon: FileText },
  { name: "Penginapan", href: "/admin/penginapan", icon: BedDouble },
  { name: "Kritik & Saran", href: "/admin/feedback", icon: MessageSquareText },
  { name: "Stats", href: "/admin/stats", icon: TrendingUp },
  { name: "Pengaturan", href: "/admin/settings", icon: Settings },
];

interface AdminShellProps {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
}

export function AdminShell({ children, userName, userEmail }: AdminShellProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar — hidden on mobile */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900">
          <h1 className="text-xl font-bold text-white tracking-tight">Admin Console</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                  active
                    ? "bg-slate-800 text-white"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                    active ? "text-sky-400" : "text-slate-400 group-hover:text-sky-400"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center px-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{userName}</p>
              <p className="text-xs text-slate-400 truncate">{userEmail}</p>
            </div>
            <Link
              href="/api/auth/signout"
              className="ml-2 p-2 text-slate-400 hover:text-red-400 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-slate-900 text-slate-300 flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <h1 className="text-lg font-bold text-white tracking-tight">Admin Console</h1>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors group ${
                  active
                    ? "bg-slate-800 text-white"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                    active ? "text-sky-400" : "text-slate-400 group-hover:text-sky-400"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center px-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{userName}</p>
              <p className="text-xs text-slate-400 truncate">{userEmail}</p>
            </div>
            <Link
              href="/api/auth/signout"
              className="ml-2 p-2 text-slate-400 hover:text-red-400 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Header */}
        <header className="h-14 sm:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors md:hidden"
              aria-label="Buka menu navigasi"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base sm:text-lg font-semibold text-slate-800 truncate">
              <span className="md:hidden">Admin Panel</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-slate-500 hidden sm:inline-block">
              Status: <span className="text-green-600 font-medium">Online</span>
            </span>
            <Link
              href="/"
              className="text-xs sm:text-sm text-sky-600 hover:underline font-medium whitespace-nowrap"
            >
              View Website
            </Link>
          </div>
        </header>
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-10 bg-slate-50 min-h-0">
          <div className="max-w-7xl mx-auto h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
