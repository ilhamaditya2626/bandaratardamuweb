import { NextRequest, NextResponse } from "next/server";
import { getStats } from "@/services/passengers.service";

// GET /api/stats?range=daily|weekly|monthly|yearly
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "monthly";
    const date = searchParams.get("date") || undefined;

    // Validate range parameter
    const validRanges = ["daily", "weekly", "monthly", "yearly"];
    if (!validRanges.includes(range)) {
      return NextResponse.json(
        {
          success: false,
          error: `Range tidak valid. Gunakan: ${validRanges.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const stats = await getStats(range, date);

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil statistik penumpang" },
      { status: 500 }
    );
  }
}
