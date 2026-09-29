import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteFeedback } from "@/services/feedback.service";

export const runtime = "nodejs";

// POST /api/admin/feedback/delete
// Endpoint terpisah karena reverse proxy / WAF bisa memblokir HTTP DELETE.
export async function POST(request: NextRequest) {
  let session;
  try {
    session = await auth.api.getSession({ headers: request.headers });
  } catch (error) {
    console.error("[admin/feedback/delete] getSession error:", error);
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

    const id = Number(body?.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json(
        { success: false, error: "ID kritik dan saran tidak valid" },
        { status: 400 }
      );
    }

    const deleted = await deleteFeedback(id);

    return NextResponse.json({ success: true, data: deleted });
  } catch (error: any) {
    console.error("POST /api/admin/feedback/delete error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal menghapus kritik dan saran" },
      { status: 500 }
    );
  }
}
