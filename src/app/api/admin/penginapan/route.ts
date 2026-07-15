import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { ImageUploadError, saveImageAsWebp } from "@/lib/image-upload";
import {
  createPenginapan,
  deletePenginapan,
  getPenginapan,
  updatePenginapan,
} from "@/services/penginapan.service";

export const runtime = "nodejs";

async function verifyAdmin(request: NextRequest) {
  return auth.api.getSession({ headers: request.headers });
}

function unauthorized() {
  return NextResponse.json(
    { success: false, error: "Unauthorized" },
    { status: 401 },
  );
}

// Parse array yang dikirim sebagai JSON string di dalam FormData.
function parseJsonArray(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string" || value.trim() === "") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.map((item) => String(item).trim()).filter(Boolean)
      : [];
  } catch {
    return [];
  }
}

const baseSchema = z.object({
  category: z.string().trim().min(1, "Kategori wajib diisi").max(50),
  name: z.string().trim().min(1, "Nama penginapan wajib diisi").max(150),
  description: z.string().trim().optional().default(""),
  price: z.coerce.number().int().min(0, "Harga tidak valid"),
  phone: z.string().trim().max(30).optional().default(""),
  is_active: z.boolean().optional().default(true),
  facilities: z.array(z.string()).default([]),
});

// Kumpulkan foto: foto lama yang dipertahankan + file baru yang diupload.
async function collectPhotos(formData: FormData): Promise<string[]> {
  const existing = parseJsonArray(formData.get("existing_photos"));

  const files = formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  const uploaded: string[] = [];
  for (const file of files) {
    uploaded.push(await saveImageAsWebp(file, "penginapan"));
  }

  return [...existing, ...uploaded];
}

function readBaseFields(formData: FormData) {
  return baseSchema.safeParse({
    category: formData.get("category")?.toString() ?? "",
    name: formData.get("name")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    price: formData.get("price")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    is_active: formData.get("is_active")?.toString() !== "false",
    facilities: parseJsonArray(formData.get("facilities")),
  });
}

function handleError(error: unknown, fallback: string) {
  console.error(fallback, error);
  if (error instanceof ImageUploadError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
  return NextResponse.json({ success: false, error: fallback }, { status: 500 });
}

// GET /api/admin/penginapan - Daftar semua penginapan (termasuk nonaktif).
export async function GET(request: NextRequest) {
  const session = await verifyAdmin(request);
  if (!session) return unauthorized();

  try {
    const data = await getPenginapan(true);
    return NextResponse.json({
      success: true,
      data,
      meta: { count: data.length },
    });
  } catch (error) {
    return handleError(error, "Gagal memuat data penginapan");
  }
}

// POST /api/admin/penginapan - Tambah penginapan.
export async function POST(request: NextRequest) {
  const session = await verifyAdmin(request);
  if (!session) return unauthorized();

  try {
    const formData = await request.formData();
    const parsed = readBaseFields(formData);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message },
        { status: 400 },
      );
    }

    const photos = await collectPhotos(formData);
    if (photos.length === 0) {
      return NextResponse.json(
        { success: false, error: "Minimal unggah 1 foto penginapan" },
        { status: 400 },
      );
    }

    const created = await createPenginapan({ ...parsed.data, photos });
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return handleError(error, "Gagal menambahkan penginapan");
  }
}

// PUT /api/admin/penginapan - Ubah penginapan.
export async function PUT(request: NextRequest) {
  const session = await verifyAdmin(request);
  if (!session) return unauthorized();

  try {
    const formData = await request.formData();
    const idStr = formData.get("id")?.toString();
    if (!idStr) {
      return NextResponse.json(
        { success: false, error: "Field 'id' wajib diisi" },
        { status: 400 },
      );
    }
    const id = parseInt(idStr, 10);

    const parsed = readBaseFields(formData);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message },
        { status: 400 },
      );
    }

    const photos = await collectPhotos(formData);
    if (photos.length === 0) {
      return NextResponse.json(
        { success: false, error: "Minimal harus ada 1 foto penginapan" },
        { status: 400 },
      );
    }

    const updated = await updatePenginapan(id, { ...parsed.data, photos });
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Penginapan tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleError(error, "Gagal memperbarui penginapan");
  }
}

// DELETE /api/admin/penginapan - Hapus penginapan (id di body JSON).
export async function DELETE(request: NextRequest) {
  const session = await verifyAdmin(request);
  if (!session) return unauthorized();

  try {
    const body = await request.json();
    if (!body?.id) {
      return NextResponse.json(
        { success: false, error: "Field 'id' wajib diisi" },
        { status: 400 },
      );
    }

    const deleted = await deletePenginapan(Number(body.id));
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Penginapan tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    return handleError(error, "Gagal menghapus penginapan");
  }
}
