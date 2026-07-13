import { NextRequest, NextResponse } from "next/server";
import { getFlightsByDate } from "@/services/flights.service";

// GET /api/flights?date=YYYY-MM-DD&type=arrival|departure
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date =
      searchParams.get("date") || new Date().toISOString().split("T")[0];
    const type = searchParams.get("type") || undefined;

    const flights = await getFlightsByDate(date, type);

    return NextResponse.json({
      success: true,
      data: flights,
      meta: { date, type: type || "all", count: flights.length },
    });
  } catch (error) {
    console.error("GET /api/flights error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data penerbangan" },
      { status: 500 }
    );
  }
}
