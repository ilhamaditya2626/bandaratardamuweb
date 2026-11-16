import { NextRequest, NextResponse } from "next/server";
import { count } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { pegawai } from "@/db/schema";
import { getRekapKepegawaian, saveRekapKepegawaian, validateRekap } from "@/lib/rekap-kepegawaian";

async function isAdmin(request: NextRequest) {
  return Boolean(await auth.api.getSession({ headers: request.headers }));
}

// GET: ambil rekap beserta jumlah pegawai di menu Pegawai (untuk pengecekan total).
export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const [rekap, [{ total }]] = await Promise.all([
      getRekapKepegawaian(),
      db.select({ total: count() }).from(pegawai),
    ]);
    return NextResponse.json({ success: true, data: rekap, totalPegawai: Number(total) });
  } catch (error) {
    console.error("GET /api/admin/rekap-kepegawaian error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil rekap kepegawaian" }, { status: 500 });
  }
}

// PUT: simpan rekap baru (hanya admin yang sudah login).
export async function PUT(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { data, error } = validateRekap(await request.json());
    if (!data) return NextResponse.json({ success: false, error }, { status: 400 });
    await saveRekapKepegawaian(data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("PUT /api/admin/rekap-kepegawaian error:", error);
    return NextResponse.json({ success: false, error: "Gagal menyimpan rekap kepegawaian" }, { status: 500 });
  }
}
