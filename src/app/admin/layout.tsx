import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import { AdminShell } from "./_components/admin-shell";

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

    return (
        <div className={inter.className}>
            <AdminShell
                userName={session.user.name}
                userEmail={session.user.email}
            >
                {children}
            </AdminShell>
        </div>
    );
}
