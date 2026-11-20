import { NextRequest, NextResponse } from "next/server";
import { createFeedback } from "@/services/feedback.service";
import { InputValidationError, cleanField } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Isian dibersihkan di backend: karakter khusus (< > ; " ' & `) dinetralkan
    // dan alamat web dijinakkan, sehingga skrip yang dikirim hanya tersimpan sebagai teks biasa.
    const name = cleanField(body.name, "Nama", { required: true, maxLength: 120 });
    const message = cleanField(body.message, "Kritik dan saran", { required: true });

    if (!name || !message) {
      return NextResponse.json(
        { success: false, error: "Nama serta kritik dan saran wajib diisi" },
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
    if (error instanceof InputValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    console.error("POST /api/feedback error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengirim aspirasi" },
      { status: 500 },
    );
  }
}
