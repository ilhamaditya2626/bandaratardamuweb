import { db } from "@/db";
import { penginapan } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";

// Normalisasi kolom json (kadang MySQL/driver mengembalikan string).
function normalizeStringArray(value: unknown): string[] {
  if (typeof value === "string") {
    const trimmed = value.trim();
    try {
      return normalizeStringArray(JSON.parse(trimmed));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) return [];

  return value
    .map((item) => String(item).trim())
    .filter((item) => item.length > 0);
}

function normalizeRow<
  T extends { photos: unknown; facilities: unknown; price: unknown },
>(row: T) {
  return {
    ...row,
    photos: normalizeStringArray(row.photos),
    facilities: normalizeStringArray(row.facilities),
    price: Number(row.price),
  };
}

export interface PenginapanInput {
  category: string;
  name: string;
  description?: string | null;
  photos: string[];
  facilities: string[];
  price: number;
  phone?: string | null;
  is_active?: boolean;
}

export async function getPenginapan(includeInactive = false) {
  const rows = includeInactive
    ? await db
        .select()
        .from(penginapan)
        .orderBy(desc(penginapan.created_at))
    : await db
        .select()
        .from(penginapan)
        .where(eq(penginapan.is_active, true))
        .orderBy(asc(penginapan.id));

  return rows.map(normalizeRow);
}

export async function createPenginapan(data: PenginapanInput) {
  const [inserted] = await db
    .insert(penginapan)
    .values({
      category: data.category.trim(),
      name: data.name.trim(),
      description: data.description?.trim() || null,
      photos: normalizeStringArray(data.photos),
      facilities: normalizeStringArray(data.facilities),
      price: Number(data.price),
      phone: data.phone?.trim() || null,
      is_active: data.is_active ?? true,
    })
    .$returningId();

  const [result] = await db
    .select()
    .from(penginapan)
    .where(eq(penginapan.id, inserted.id))
    .limit(1);

  return result ? normalizeRow(result) : result;
}

export async function updatePenginapan(
  id: number,
  data: Partial<PenginapanInput>,
) {
  const payload: {
    category?: string;
    name?: string;
    description?: string | null;
    photos?: string[];
    facilities?: string[];
    price?: number;
    phone?: string | null;
    is_active?: boolean;
    updated_at: Date;
  } = {
    updated_at: new Date(),
  };

  if (data.category !== undefined) payload.category = data.category.trim();
  if (data.name !== undefined) payload.name = data.name.trim();
  if (data.description !== undefined)
    payload.description = data.description?.trim() || null;
  if (data.photos !== undefined)
    payload.photos = normalizeStringArray(data.photos);
  if (data.facilities !== undefined)
    payload.facilities = normalizeStringArray(data.facilities);
  if (data.price !== undefined) payload.price = Number(data.price);
  if (data.phone !== undefined) payload.phone = data.phone?.trim() || null;
  if (data.is_active !== undefined) payload.is_active = data.is_active;

  await db.update(penginapan).set(payload).where(eq(penginapan.id, id));

  const [result] = await db
    .select()
    .from(penginapan)
    .where(eq(penginapan.id, id))
    .limit(1);

  return result ? normalizeRow(result) : result;
}

export async function deletePenginapan(id: number) {
  const [result] = await db
    .select()
    .from(penginapan)
    .where(eq(penginapan.id, id))
    .limit(1);

  if (!result) return undefined;

  await db.delete(penginapan).where(eq(penginapan.id, id));

  return normalizeRow(result);
}
