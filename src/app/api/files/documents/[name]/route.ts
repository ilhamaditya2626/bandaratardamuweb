import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { publicDocuments } from "@/db/schema";

export async function GET(request: NextRequest, context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params;
  if (!/^[a-zA-Z0-9._-]+\.pdf$/.test(name)) return new NextResponse("Not found", { status: 404 });

  const [doc] = await db
    .select({ access_type: publicDocuments.access_type, is_published: publicDocuments.is_published })
    .from(publicDocuments)
    .where(eq(publicDocuments.file_url, `/api/files/documents/${name}`))
    .limit(1);

  const isPublic = Boolean(doc && doc.is_published && doc.access_type === "umum");
  if (!isPublic) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return new NextResponse("Not found", { status: 404 });
  }

  try {
    const file = await fs.readFile(path.join(process.cwd(), "storage", "documents", name));
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${name}"`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": isPublic ? "public, max-age=3600" : "private, no-store",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}