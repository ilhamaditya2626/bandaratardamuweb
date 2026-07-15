import { NextResponse } from "next/server";
import { getPenginapan } from "@/services/penginapan.service";

// GET /api/penginapan - Daftar penginapan aktif untuk halaman publik.
export async function GET() {
  try {
    const data = await getPenginapan(false);
    return NextResponse.json({
      success: true,
      data,
      meta: { count: data.length },
    });
  } catch (error) {
    console.error("GET /api/penginapan error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data penginapan" },
      { status: 500 },
    );
  }
}
