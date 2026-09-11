import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { getDocument } from "@/services/information.service";
import { ensureDocumentPreview, resolveDiskPathFromUrl } from "@/lib/pdf-preview";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const docId = Number(id);
  if (!Number.isInteger(docId)) {
    return new NextResponse("Dokumen tidak ditemukan", { status: 404 });
  }

  const doc = await getDocument(docId);
  if (!doc) {
    return new NextResponse("Dokumen tidak ditemukan", { status: 404 });
  }

  try {
    const previewUrl = await ensureDocumentPreview(doc.file_url);
    const diskPath = resolveDiskPathFromUrl(previewUrl);

    if (!diskPath) {
      return NextResponse.redirect(new URL(previewUrl, _req.url));
    }

    const fileBuffer = await fs.readFile(diskPath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${encodeURIComponent(doc.file_name.replace(/\.pdf$/i, "") + "-preview.pdf")}"`,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error) {
    console.error("Preview route error:", error);
    return new NextResponse("Gagal memuat pratinjau dokumen", { status: 500 });
  }
}
