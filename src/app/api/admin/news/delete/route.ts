import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { deleteNews } from "@/services/news.service";

export const runtime = "nodejs";

// POST /api/admin/news/delete - Hapus berita
// Endpoint terpisah karena beberapa reverse proxy / WAF memblokir
// HTTP DELETE method, sehingga operasi hapus dilakukan via POST.
export async function POST(request: NextRequest) {
  let session;
  try {
    session = await auth.api.getSession({
      headers: request.headers,
    });
  } catch (error) {
    console.error("verifyAdmin session error:", error);
    session = null;
  }

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Sesi login tidak sah atau telah berakhir. Silakan login kembali." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "ID berita wajib diisi." },
        { status: 400 }
      );
    }

    const article = await deleteNews(body.id);

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Berita tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error: any) {
    console.error("POST /api/admin/news/delete error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal menghapus berita" },
      { status: 500 }
    );
  }
}
