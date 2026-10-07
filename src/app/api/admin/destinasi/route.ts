import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDestinasi, createDestinasi, updateDestinasi, deleteDestinasi } from "@/services/destinasi.service";

async function isAdmin(request: NextRequest) { return auth.api.getSession({ headers: request.headers }); }

export async function GET(request: NextRequest) {
  if (!await isAdmin(request)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const data = await getDestinasi();
  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  if (!await isAdmin(request)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const form = await request.formData();
    const nama_kota = String(form.get("nama_kota") || "").trim();
    if (!nama_kota) return NextResponse.json({ success: false, error: "Nama kota wajib diisi" }, { status: 400 });
    const data = await createDestinasi({ nama_kota, kode_bandara: String(form.get("kode_bandara") || "").trim() || undefined });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch { return NextResponse.json({ success: false, error: "Gagal menambah destinasi" }, { status: 500 }); }
}

export async function PUT(request: NextRequest) {
  if (!await isAdmin(request)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const form = await request.formData();
    const id = Number(form.get("id"));
    if (!id) return NextResponse.json({ success: false, error: "ID tidak valid" }, { status: 400 });
    const data = await updateDestinasi(id, { nama_kota: String(form.get("nama_kota") || "").trim(), kode_bandara: String(form.get("kode_bandara") || "").trim() });
    if (!data) return NextResponse.json({ success: false, error: "Destinasi tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch { return NextResponse.json({ success: false, error: "Gagal memperbarui destinasi" }, { status: 500 }); }
}

export async function DELETE(request: NextRequest) {
  if (!await isAdmin(request)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await request.json();
    const data = await deleteDestinasi(Number(id));
    return data ? NextResponse.json({ success: true, data }) : NextResponse.json({ success: false, error: "Destinasi tidak ditemukan" }, { status: 404 });
  } catch { return NextResponse.json({ success: false, error: "Gagal menghapus destinasi" }, { status: 500 }); }
}
