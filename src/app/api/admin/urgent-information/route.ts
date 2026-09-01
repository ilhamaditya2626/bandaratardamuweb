import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createUrgentInformation, deleteUrgentInformation, updateUrgentInformation } from "@/services/urgent-information.service";

async function isAdmin(request: NextRequest) { return auth.api.getSession({ headers: request.headers }); }
function parseDate(value: FormDataEntryValue | null) { return value ? new Date(String(value)) : undefined; }

export async function POST(request: NextRequest) {
  if (!await isAdmin(request)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const form = await request.formData(); const title = String(form.get("title") || "").trim(); const description = String(form.get("description") || "").trim();
    if (!title || !description) return NextResponse.json({ success: false, error: "Judul dan deskripsi wajib diisi" }, { status: 400 });
    const data = await createUrgentInformation({ title, description, attachment_url: String(form.get("attachment_url") || "") || undefined, published_at: parseDate(form.get("published_at")) });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch { return NextResponse.json({ success: false, error: "Gagal menambah informasi" }, { status: 500 }); }
}

export async function PUT(request: NextRequest) {
  if (!await isAdmin(request)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const form = await request.formData(); const id = Number(form.get("id"));
    if (!id) return NextResponse.json({ success: false, error: "ID tidak valid" }, { status: 400 });
    const data = await updateUrgentInformation(id, { title: String(form.get("title") || "").trim(), description: String(form.get("description") || "").trim(), attachment_url: String(form.get("attachment_url") || ""), published_at: parseDate(form.get("published_at")) });
    if (!data) return NextResponse.json({ success: false, error: "Informasi tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch { return NextResponse.json({ success: false, error: "Gagal memperbarui informasi" }, { status: 500 }); }
}

export async function DELETE(request: NextRequest) {
  if (!await isAdmin(request)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try { const { id } = await request.json(); const data = await deleteUrgentInformation(Number(id)); return data ? NextResponse.json({ success: true, data }) : NextResponse.json({ success: false, error: "Informasi tidak ditemukan" }, { status: 404 }); }
  catch { return NextResponse.json({ success: false, error: "Gagal menghapus informasi" }, { status: 500 }); }
}
