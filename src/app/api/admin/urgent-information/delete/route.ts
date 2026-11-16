import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteUrgentInformation } from "@/services/urgent-information.service";

export const runtime = "nodejs";

// POST dipakai karena sebagian WAF/reverse proxy menolak method DELETE.
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      return NextResponse.json({ success: false, error: "ID tidak valid" }, { status: 400 });
    }

    const data = await deleteUrgentInformation(numericId);
    return data
      ? NextResponse.json({ success: true, data })
      : NextResponse.json({ success: false, error: "Informasi tidak ditemukan" }, { status: 404 });
  } catch (error) {
    console.error("POST /api/admin/urgent-information/delete error:", error);
    return NextResponse.json({ success: false, error: "Gagal menghapus informasi" }, { status: 500 });
  }
}
