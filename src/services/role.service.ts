import { db } from "@/db";
import { role } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getRole() {
  return db.select().from(role).orderBy(asc(role.nama_role));
}

export async function createRole(data: { nama_role: string; deskripsi?: string }) {
  const [inserted] = await db.insert(role).values(data).$returningId();
  const [result] = await db.select().from(role).where(eq(role.id, inserted.id)).limit(1);
  return result;
}

export async function updateRole(id: number, data: Partial<{ nama_role: string; deskripsi: string }>) {
  await db.update(role).set({ ...data, updated_at: new Date() }).where(eq(role.id, id));
  const [result] = await db.select().from(role).where(eq(role.id, id)).limit(1);
  return result;
}

export async function deleteRole(id: number) {
  const [result] = await db.select().from(role).where(eq(role.id, id)).limit(1);
  if (!result) return undefined;
  await db.delete(role).where(eq(role.id, id));
  return result;
}
