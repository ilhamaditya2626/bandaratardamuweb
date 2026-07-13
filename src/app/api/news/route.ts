import { NextRequest, NextResponse } from "next/server";
import { getAllNews } from "@/services/news.service";

// GET /api/news?page=1&limit=10
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await getAllNews(page, limit);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("GET /api/news error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar berita" },
      { status: 500 }
    );
  }
}
