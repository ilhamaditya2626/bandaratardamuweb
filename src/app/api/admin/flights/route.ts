import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  createFlight,
  updateFlight,
  deleteFlight,
} from "@/services/flights.service";

// ─── Auth middleware helper ───────────────────────────────────
async function verifyAdmin(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  return session;
}

// POST /api/admin/flights — Create flight
export async function POST(request: NextRequest) {
  const session = await verifyAdmin(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // Validate required fields
    const required = ["flight_no", "airline", "type", "scheduled_time", "flight_date"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Field '${field}' wajib diisi` },
          { status: 400 }
        );
      }
    }

    const flight = await createFlight(body);
    return NextResponse.json({ success: true, data: flight }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/flights error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan penerbangan" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/flights — Update flight
export async function PUT(request: NextRequest) {
  const session = await verifyAdmin(request);
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

    const { id, ...data } = body;
    const flight = await updateFlight(id, data);

    if (!flight) {
      return NextResponse.json(
        { success: false, error: "Penerbangan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: flight });
  } catch (error) {
    console.error("PUT /api/admin/flights error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui penerbangan" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/flights — Delete flight
export async function DELETE(request: NextRequest) {
  const session = await verifyAdmin(request);
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

    const flight = await deleteFlight(body.id);

    if (!flight) {
      return NextResponse.json(
        { success: false, error: "Penerbangan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: flight });
  } catch (error) {
    console.error("DELETE /api/admin/flights error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus penerbangan" },
      { status: 500 }
    );
  }
}
