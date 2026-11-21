import { NextRequest, NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { informationRequests } from "@/db/schema";
import { downloadFromDrive, isDriveFileId } from "@/lib/google-drive";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

// Membuka KTP dan berkas pendukung permohonan dari Google Drive. Hanya untuk admin yang sudah login,
// dan hanya berkas yang benar-benar tercatat pada permohonan atau keberatan.
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await auth.api.getSession({ headers: request.headers }))) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { id } = await context.params;
  if (!isDriveFileId(id)) return new NextResponse("Not found", { status: 404 });

  const url = `/api/admin/drive-file/${id}`;
  const [owner] = await db
    .select({ id: informationRequests.id })
    .from(informationRequests)
    .where(or(eq(informationRequests.identity_file_url, url), eq(informationRequests.supporting_file_url, url)))
    .limit(1);
  if (!owner) return new NextResponse("Not found", { status: 404 });

  try {
    const file = await downloadFromDrive(id);
    if (!file) return new NextResponse("Not found", { status: 404 });
    const type = file.contentType.split(";")[0].trim();
    return new NextResponse(new Uint8Array(file.buffer), {
      headers: {
        "Content-Type": ALLOWED_TYPES.has(type) ? type : "application/octet-stream",
        "Content-Disposition": "inline",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Gagal membuka berkas Google Drive:", error);
    return new NextResponse("Berkas tidak dapat dibuka", { status: 502 });
  }
}
