import { NextResponse } from "next/server";
import { getTicketPrices } from "@/services/ticket-prices.service";

export async function GET() {
  try {
    const prices = await getTicketPrices(false);

    return NextResponse.json({
      success: true,
      data: prices,
      meta: { count: prices.length },
    });
  } catch (error) {
    console.error("GET /api/ticket-prices error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data harga tiket" },
      { status: 500 }
    );
  }
}
