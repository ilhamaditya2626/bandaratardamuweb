import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  syncDailyPassengers,
  updatePassengerLog,
  deletePassengerLog,
} from "@/services/passengers.service";
import { z } from "zod";

// ─── Auth middleware helper ───────────────────────────────────
async function verifyAdmin(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  return session;
}

// Zod schema for validation
const passengerSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format date harus YYYY-MM-DD"),
  airline: z.string().min(1, "Maskapai wajib diisi"),
  flight_type: z.enum(["arrival", "departure"], {
    message: "Tipe penerbangan harus arrival atau departure",
  }),
  city: z.string().min(1, "Kota wajib dipilih"),
  passenger_count: z.number().int().nonnegative("Jumlah penumpang tidak boleh negatif"),
});

const passengerUpdateSchema = passengerSchema.extend({
  id: z.coerce.number().int().positive("ID data tidak valid"),
});

const passengerDeleteSchema = z.object({
  id: z.coerce.number().int().positive("ID data tidak valid"),
});

// ─── POST ───────────────────────────────────────────────────
// Sync passenger data
export async function POST(request: NextRequest) {
  try {
    const session = await verifyAdmin(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();


    const parsed = passengerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Invalid format",
        },
        { status: 400 }
      );
    }

    const val = parsed.data;

    const result = await syncDailyPassengers(
      val.date,
      val.airline,
      val.flight_type,
      val.city,
      val.passenger_count
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("POST /api/admin/passengers error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyinkronkan data penumpang" },
      { status: 500 }
    );
  }
}
export async function PUT(request: NextRequest) {
  try {
    const session = await verifyAdmin(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const parsed = passengerUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Invalid format",
        },
        { status: 400 }
      );
    }

    const val = parsed.data;

    const result = await updatePassengerLog(
      val.id,
      val.date,
      val.airline,
      val.flight_type,
      val.city,
      val.passenger_count
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("PUT /api/admin/passengers error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengubah data penumpang" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await verifyAdmin(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const parsed = passengerDeleteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Invalid format",
        },
        { status: 400 }
      );
    }

    const result = await deletePassengerLog(parsed.data.id);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("DELETE /api/admin/passengers error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus data penumpang" },
      { status: 500 }
    );
  }
}
