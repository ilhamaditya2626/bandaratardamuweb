import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createTicketPrice,
  deleteTicketPrice,
  getTicketPrices,
  updateTicketPrice,
} from "@/services/ticket-prices.service";

async function verifyAdmin(request: NextRequest) {
  return auth.api.getSession({
    headers: request.headers,
  });
}

export async function GET(request: NextRequest) {
  const session = await verifyAdmin(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const prices = await getTicketPrices(true);
    return NextResponse.json({
      success: true,
      data: prices,
      meta: { count: prices.length },
    });
  } catch (error) {
    console.error("GET /api/admin/ticket-prices error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data harga tiket" },
      { status: 500 }
    );
  }
}

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
    const required = ["origin", "destination", "flight_type", "price"];

    for (const field of required) {
      if (body[field] === undefined || body[field] === "") {
        return NextResponse.json(
          { success: false, error: `Field '${field}' wajib diisi` },
          { status: 400 }
        );
      }
    }

    const price = await createTicketPrice(body);
    return NextResponse.json({ success: true, data: price }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/ticket-prices error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error?.code === "23505"
            ? "Harga untuk rute dan jenis penerbangan ini sudah ada"
            : "Gagal menambahkan harga tiket",
      },
      { status: 500 }
    );
  }
}

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
    const price = await updateTicketPrice(Number(id), data);

    if (!price) {
      return NextResponse.json(
        { success: false, error: "Harga tiket tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: price });
  } catch (error: any) {
    console.error("PUT /api/admin/ticket-prices error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error?.code === "23505"
            ? "Harga untuk rute dan jenis penerbangan ini sudah ada"
            : "Gagal memperbarui harga tiket",
      },
      { status: 500 }
    );
  }
}

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

    const price = await deleteTicketPrice(Number(body.id));

    if (!price) {
      return NextResponse.json(
        { success: false, error: "Harga tiket tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: price });
  } catch (error) {
    console.error("DELETE /api/admin/ticket-prices error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus harga tiket" },
      { status: 500 }
    );
  }
}
