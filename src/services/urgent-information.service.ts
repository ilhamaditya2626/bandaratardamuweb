import { db } from "@/db";
import { urgentInformation } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function getUrgentInformation(page = 1, limit = 10) {
  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const data = await db.select().from(urgentInformation)
    .orderBy(desc(urgentInformation.published_at), desc(urgentInformation.id))
    .limit(safeLimit).offset((safePage - 1) * safeLimit);
  const [count] = await db.select({ count: sql<number>`COUNT(*)` }).from(urgentInformation);
  const total = Number(count.count);
  return { data, pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) } };
}

export async function createUrgentInformation(data: { title: string; description: string; attachment_url?: string; published_at?: Date }) {
  const [inserted] = await db.insert(urgentInformation).values(data).$returningId();
  const [result] = await db.select().from(urgentInformation).where(eq(urgentInformation.id, inserted.id)).limit(1);
  return result;
}

export async function updateUrgentInformation(id: number, data: Partial<{ title: string; description: string; attachment_url: string; published_at: Date }>) {
  await db.update(urgentInformation).set({ ...data, updated_at: new Date() }).where(eq(urgentInformation.id, id));
  const [result] = await db.select().from(urgentInformation).where(eq(urgentInformation.id, id)).limit(1);
  return result;
}

export async function deleteUrgentInformation(id: number) {
  const [result] = await db.select().from(urgentInformation).where(eq(urgentInformation.id, id)).limit(1);
  if (!result) return undefined;
  await db.delete(urgentInformation).where(eq(urgentInformation.id, id));
  return result;
}
