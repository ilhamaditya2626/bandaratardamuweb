import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getRole, createRole, updateRole, deleteRole } from "@/services/role.service";

const unauthorized = () => NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
const isAdmin = (request: NextRequest) => auth.api.getSession({ headers: request.headers });

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();
  const data = await getRole();
  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();
  try {
    const form = await request.formData();
    const nama_role = String(form.get("nama_role") || "").trim();
    if (!nama_role) return NextResponse.json({ success: false, error: "Nama role wajib diisi" }, { status: 400 });
    const data = await createRole({ nama_role, deskripsi: String(form.get("deskripsi") || "").trim() || undefined });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal menambah role" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();
  try {
    const form = await request.formData();
    const id = Number(form.get("id"));
    if (!id) return NextResponse.json({ success: false, error: "ID tidak valid" }, { status: 400 });
    const data = await updateRole(id, {
      nama_role: String(form.get("nama_role") || "").trim(),
      deskripsi: String(form.get("deskripsi") || "").trim(),
    });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memperbarui role" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();
  try {
    const { id } = await request.json();
    const data = await deleteRole(Number(id));
    if (!data) return NextResponse.json({ success: false, error: "Role tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Role masih dipakai pegawai, tidak bisa dihapus" }, { status: 409 });
  }
}