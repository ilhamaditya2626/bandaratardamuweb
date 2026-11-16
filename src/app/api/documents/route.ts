import { NextRequest, NextResponse } from "next/server";
import { listDocuments } from "@/services/information.service";
export async function GET(request: NextRequest) {
  const q = new URL(request.url).searchParams;
  const documents = await listDocuments(
    q.get("category") || undefined,
    q.get("subcategory") || undefined,
    q.get("latest") === "true"
  );
  return NextResponse.json({
    success: true,
    // URL file asli dokumen rahasia tidak dikirim ke halaman publik.
    data: documents.map((document) => {
      if (document.access_type !== "rahasia") return document;
      const version = `${document.updated_at instanceof Date ? document.updated_at.toISOString() : document.updated_at}-rahasia`;
      return {
        ...document,
        file_url: `/api/documents/${document.id}/preview?v=${encodeURIComponent(version)}`,
      };
    }),
  });
}
