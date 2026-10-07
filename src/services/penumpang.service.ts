import { db } from "@/db";
import { penumpang } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getPenumpang() {
  return db.select().from(penumpang).orderBy(asc(penumpang.nama));
}

export async function createPenumpang(data: { nama: string; nomor_identitas?: string; kontak?: string }) {
  const [inserted] = await db.insert(penumpang).values(data).$returningId();
  const [result] = await db.select().from(penumpang).where(eq(penumpang.id, inserted.id)).limit(1);
  return result;
}

export async function updatePenumpang(id: number, data: Partial<{ nama: string; nomor_identitas: string; kontak: string }>) {
  await db.update(penumpang).set({ ...data, updated_at: new Date() }).where(eq(penumpang.id, id));
  const [result] = await db.select().from(penumpang).where(eq(penumpang.id, id)).limit(1);
  return result;
}

export async function deletePenumpang(id: number) {
  const [result] = await db.select().from(penumpang).where(eq(penumpang.id, id)).limit(1);
  if (!result) return undefined;
  await db.delete(penumpang).where(eq(penumpang.id, id));
  return result;
}
