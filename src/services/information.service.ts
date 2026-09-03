import { db } from "@/db";
import { informationRequests, publicDocuments } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";

export type RequestInput = Omit<typeof informationRequests.$inferInsert, "id" | "created_at" | "updated_at" | "status">;
export async function createInformationRequest(data: RequestInput) { const [row] = await db.insert(informationRequests).values(data).$returningId(); return row; }
export async function requestStats(year?: string, month?: string) {
  const conditions = [eq(informationRequests.request_type, "information")];
  if (year && !isNaN(Number(year))) {
    conditions.push(sql`YEAR(${informationRequests.submitted_on}) = ${Number(year)}`);
  }
  if (month && !isNaN(Number(month))) {
    conditions.push(sql`MONTH(${informationRequests.submitted_on}) = ${Number(month)}`);
  }
  const condition = and(...conditions);
  const rows = await db
    .select({
      id: informationRequests.id,
      name: informationRequests.name,
      detail: informationRequests.information_detail,
      submitted_on: informationRequests.submitted_on,
      status: informationRequests.status,
    })
    .from(informationRequests)
    .where(condition)
    .orderBy(desc(informationRequests.submitted_on), desc(informationRequests.created_at))
    .limit(20);

  const [counts] = await db
    .select({
      total: sql<number>`COUNT(*)`,
      accepted: sql<number>`SUM(${informationRequests.status} = 'accepted')`,
      rejected: sql<number>`SUM(${informationRequests.status} = 'rejected')`,
    })
    .from(informationRequests)
    .where(condition);

  return {
    rows,
    total: Number(counts?.total || 0),
    accepted: Number(counts?.accepted || 0),
    rejected: Number(counts?.rejected || 0),
  };
}
export async function listRequests() { return db.select().from(informationRequests).orderBy(desc(informationRequests.created_at)); }
export async function updateRequestStatus(id: number, status: string, admin_note?: string) { await db.update(informationRequests).set({ status, admin_note, updated_at: new Date() }).where(eq(informationRequests.id, id)); }
export async function listDocuments(category?: string, latestOnly = false) {
  const where = category ? and(eq(publicDocuments.category, category), eq(publicDocuments.is_published, true)) : eq(publicDocuments.is_published, true);
  const query = db.select().from(publicDocuments).where(where).orderBy(desc(publicDocuments.document_date), desc(publicDocuments.created_at));
  return latestOnly ? query.limit(2) : query;
}
export async function listAllDocumentsAdmin() { return db.select().from(publicDocuments).orderBy(desc(publicDocuments.created_at)); }
export async function createDocument(data: typeof publicDocuments.$inferInsert) { return db.insert(publicDocuments).values(data); }
export async function deleteDocument(id: number) { return db.delete(publicDocuments).where(eq(publicDocuments.id, id)); }
export async function getDocument(id: number) { const [document] = await db.select().from(publicDocuments).where(and(eq(publicDocuments.id, id), eq(publicDocuments.is_published, true))).limit(1); return document; }
