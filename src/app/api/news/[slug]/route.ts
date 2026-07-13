import { NextRequest, NextResponse } from "next/server";
import { getNewsBySlug } from "@/services/news.service";

// GET /api/news/:slug
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug wajib diisi" },
        { status: 400 }
      );
    }

    const article = await getNewsBySlug(slug);

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Berita tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error("GET /api/news/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil detail berita" },
      { status: 500 }
    );
  }
}
