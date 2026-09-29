import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deletePenginapan } from "@/services/penginapan.service";

export const runtime = "nodejs";

// POST /api/admin/penginapan/delete
// Endpoint terpisah karena reverse proxy / WAF bisa memblokir HTTP DELETE.
export async function POST(request: NextRequest) {
  let session;
  try {
    session = await auth.api.getSession({ headers: request.headers });
  } catch (error) {
    console.error("[admin/penginapan/delete] getSession error:", error);
    session = null;
  }

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (!body?.id) {
      return NextResponse.json(
        { success: false, error: "Field 'id' wajib diisi" },
        { status: 400 }
      );
    }

    const deleted = await deletePenginapan(Number(body.id));

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Penginapan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deleted });
  } catch (error: any) {
    console.error("POST /api/admin/penginapan/delete error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal menghapus penginapan" },
      { status: 500 }
    );
  }
}
