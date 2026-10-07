import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getPenerbangan, getPenerbanganOptions, createPenerbangan, updatePenerbangan, deletePenerbangan,
} from "@/services/penerbangan.service";

const unauthorized = () => NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
const isAdmin = (request: NextRequest) => auth.api.getSession({ headers: request.headers });

const text = (form: FormData, key: string) => String(form.get(key) || "").trim();
const num = (form: FormData, key: string) => {
  const value = text(form, key);
  return value === "" ? null : Number(value);
};

function readInput(form: FormData) {
  return {
    maskapai_id: num(form, "maskapai_id"),
    pilot_id: num(form, "pilot_id"),
    destinasi_id: num(form, "destinasi_id"),
    penumpang_id: num(form, "penumpang_id"),
    tanggal: text(form, "tanggal") || null,
    jam: text(form, "jam") || null,
    seat: text(form, "seat") || null,
    harga_tiket: num(form, "harga_tiket"),
  };
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();
  const [data, options] = await Promise.all([getPenerbangan(), getPenerbanganOptions()]);
  return NextResponse.json({ success: true, data, options });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();
  try {
    const input = readInput(await request.formData());
    if (!input.maskapai_id || !input.pilot_id || !input.destinasi_id) {
      return NextResponse.json({ success: false, error: "Maskapai, pilot, dan destinasi wajib dipilih" }, { status: 400 });
    }
    const data = await createPenerbangan(input);
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal menambah data" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();
  try {
    const form = await request.formData();
    const id = Number(form.get("id"));
    if (!id) return NextResponse.json({ success: false, error: "ID tidak valid" }, { status: 400 });
    const data = await updatePenerbangan(id, readInput(form));
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memperbarui data" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();
  try {
    const { id } = await request.json();
    const data = await deletePenerbangan(Number(id));
    if (!data) return NextResponse.json({ success: false, error: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal menghapus data" }, { status: 500 });
  }
}