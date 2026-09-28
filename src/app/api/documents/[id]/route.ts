import { NextRequest, NextResponse } from "next/server";
import { getDocument } from "@/services/information.service";

export async function GET(_r: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }
  const d = await getDocument(id);
  if (!d) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }

  const isSecret = d.access_type === "rahasia";
  // Versi URL memaksa peramban mengambil ulang PDF setelah admin mengubah akses dokumen.
  const previewUrl = `/api/documents/${d.id}/preview?v=${encodeURIComponent(
    `${d.updated_at instanceof Date ? d.updated_at.toISOString() : d.updated_at}-${isSecret ? "rahasia" : "umum"}`
  )}`;
  const previewPages = isSecret
    ? Math.max(1, Math.ceil((d.total_pages || 1) * 0.2))
    : d.total_pages || 1;

  return NextResponse.json({
    success: true,
    data: {
      ...d,
      // Jangan kirim URL PDF asli untuk dokumen rahasia ke peramban.
      file_url: isSecret ? previewUrl : d.file_url,
      preview_url: previewUrl,
      preview_pages: previewPages,
    },
  });
}
