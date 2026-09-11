import { NextRequest, NextResponse } from "next/server";
import { getDocument } from "@/services/information.service";
import { ensureDocumentPreview } from "@/lib/pdf-preview";

export async function GET(_r: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }
  const d = await getDocument(id);
  if (!d) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }

  let previewUrl = d.file_url;
  try {
    previewUrl = await ensureDocumentPreview(d.file_url);
  } catch (e) {
    console.error("Gagal memastikan berkas pratinjau:", e);
  }

  const previewPages = Math.max(1, Math.ceil((d.total_pages || 1) * 0.2));

  return NextResponse.json({
    success: true,
    data: {
      ...d,
      preview_url: previewUrl,
      preview_pages: previewPages,
    },
  });
}
