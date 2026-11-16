import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteTicketPrice } from "@/services/ticket-prices.service";

export const runtime = "nodejs";

// POST /api/admin/ticket-prices/delete
// Endpoint terpisah karena reverse proxy / WAF bisa memblokir HTTP DELETE.
export async function POST(request: NextRequest) {
  let session;
  try {
    session = await auth.api.getSession({ headers: request.headers });
  } catch (error) {
    console.error("verifyAdmin session error:", error);
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

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Field 'id' wajib diisi" },
        { status: 400 }
      );
    }

    const price = await deleteTicketPrice(Number(body.id));

    if (!price) {
      return NextResponse.json(
        { success: false, error: "Harga tiket tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: price });
  } catch (error) {
    console.error("POST /api/admin/ticket-prices/delete error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus harga tiket" },
      { status: 500 }
    );
  }
}
