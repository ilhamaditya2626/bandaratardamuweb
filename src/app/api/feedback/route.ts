import { NextRequest, NextResponse } from "next/server";
import { createFeedback } from "@/services/feedback.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !message) {
      return NextResponse.json(
        { success: false, error: "Nama serta kritik dan saran wajib diisi" },
        { status: 400 },
      );
    }

    if (name.length > 120) {
      return NextResponse.json(
        { success: false, error: "Nama maksimal 120 karakter" },
        { status: 400 },
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { success: false, error: "Kritik dan saran maksimal 2000 karakter" },
        { status: 400 },
      );
    }

    const feedback = await createFeedback({ name, message });

    return NextResponse.json({ success: true, data: feedback }, { status: 201 });
  } catch (error) {
    console.error("POST /api/feedback error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengirim aspirasi" },
      { status: 500 },
    );
  }
}
