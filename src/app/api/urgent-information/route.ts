import { NextRequest, NextResponse } from "next/server";
import { getUrgentInformation } from "@/services/urgent-information.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getUrgentInformation(Number(searchParams.get("page")) || 1, Number(searchParams.get("limit")) || 10);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("GET /api/urgent-information error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil informasi serta merta" }, { status: 500 });
  }
}
