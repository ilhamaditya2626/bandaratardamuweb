import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllFeedback } from "@/services/feedback.service";

async function verifyAdmin(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  return session;
}

export async function GET(request: NextRequest) {
  const session = await verifyAdmin(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const result = await getAllFeedback(page, limit);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("GET /api/admin/feedback error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil kritik dan saran" },
      { status: 500 },
    );
  }
}
