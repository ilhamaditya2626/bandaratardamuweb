import { db } from "@/db";
import { destinasi } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getDestinasi() {
  return db.select().from(destinasi).orderBy(asc(destinasi.nama_kota));
}

export async function createDestinasi(data: { kode_bandara?: string; nama_kota: string }) {
  const [inserted] = await db.insert(destinasi).values(data).$returningId();
  const [result] = await db.select().from(destinasi).where(eq(destinasi.id, inserted.id)).limit(1);
  return result;
}

export async function updateDestinasi(id: number, data: Partial<{ kode_bandara: string; nama_kota: string }>) {
  await db.update(destinasi).set({ ...data, updated_at: new Date() }).where(eq(destinasi.id, id));
  const [result] = await db.select().from(destinasi).where(eq(destinasi.id, id)).limit(1);
  return result;
}

export async function deleteDestinasi(id: number) {
  const [result] = await db.select().from(destinasi).where(eq(destinasi.id, id)).limit(1);
  if (!result) return undefined;
  await db.delete(destinasi).where(eq(destinasi.id, id));
  return result;
}
