import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPenumpang, createPenumpang, updatePenumpang, deletePenumpang } from "@/services/penumpang.service";

async function isAdmin(request: NextRequest) { return auth.api.getSession({ headers: request.headers }); }

export async function GET(request: NextRequest) {
  if (!await isAdmin(request)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const data = await getPenumpang();
  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  if (!await isAdmin(request)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const form = await request.formData();
    const nama = String(form.get("nama") || "").trim();
    if (!nama) return NextResponse.json({ success: false, error: "Nama wajib diisi" }, { status: 400 });
    const data = await createPenumpang({ nama, nomor_identitas: String(form.get("nomor_identitas") || "").trim() || undefined, kontak: String(form.get("kontak") || "").trim() || undefined });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch { return NextResponse.json({ success: false, error: "Gagal menambah penumpang" }, { status: 500 }); }
}

export async function PUT(request: NextRequest) {
  if (!await isAdmin(request)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const form = await request.formData();
    const id = Number(form.get("id"));
    if (!id) return NextResponse.json({ success: false, error: "ID tidak valid" }, { status: 400 });
    const data = await updatePenumpang(id, { nama: String(form.get("nama") || "").trim(), nomor_identitas: String(form.get("nomor_identitas") || "").trim(), kontak: String(form.get("kontak") || "").trim() });
    if (!data) return NextResponse.json({ success: false, error: "Penumpang tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch { return NextResponse.json({ success: false, error: "Gagal memperbarui penumpang" }, { status: 500 }); }
}

export async function DELETE(request: NextRequest) {
  if (!await isAdmin(request)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await request.json();
    const data = await deletePenumpang(Number(id));
    return data ? NextResponse.json({ success: true, data }) : NextResponse.json({ success: false, error: "Penumpang tidak ditemukan" }, { status: 404 });
  } catch { return NextResponse.json({ success: false, error: "Gagal menghapus penumpang" }, { status: 500 }); }
}
