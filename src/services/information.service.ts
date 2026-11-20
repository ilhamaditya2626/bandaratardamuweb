import { db } from "@/db";
import { informationRequests, publicDocuments } from "@/db/schema";
import { and, desc, eq, isNull, or, sql } from "drizzle-orm";
import { decodeText } from "@/lib/sanitize";

export type RequestInput = Omit<typeof informationRequests.$inferInsert, "id" | "created_at" | "updated_at" | "status">;
// Tanggal masuk (created_at) disamakan dengan tanggal pengajuan (submitted_on).
// Jika tanggal pengajuan adalah hari ini, jam masuk yang sebenarnya tetap dipakai;
// jika tanggal pengajuan sebelumnya (misalnya data tahun 2025), tanggal masuk mengikuti tanggal tersebut.
function entryDateFor(submittedOn?: string | null): Date | undefined {
  if (!submittedOn || !/^\d{4}-\d{2}-\d{2}$/.test(submittedOn)) return undefined;
  const now = new Date();
  const todayWita = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
  if (submittedOn === todayWita) return now;
  const date = new Date(`${submittedOn}T08:00:00+08:00`);
  return isNaN(date.getTime()) ? undefined : date;
}
export async function createInformationRequest(data: RequestInput) {
  const created_at = entryDateFor(data.submitted_on);
  const [row] = await db.insert(informationRequests).values(created_at ? { ...data, created_at } : data).$returningId();
  return row;
}
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
    // Halaman publik hanya menerima tanggal dan status; ID, nama pemohon, dan rincian tidak dikirim.
    .select({
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
// Isian disimpan dalam bentuk yang sudah dinetralkan; untuk dashboard admin dikembalikan menjadi teks biasa.
const REQUEST_TEXT_FIELDS = [
  "name", "phone", "address", "occupation", "identity_type", "identity_number", "institution",
  "information_detail", "purpose", "objection_reason", "objection_reason_other", "case_position", "admin_note",
] as const;
export async function listRequests() {
  const rows = await db.select().from(informationRequests).orderBy(desc(informationRequests.created_at));
  return rows.map((row) => {
    const decoded: Record<string, unknown> = { ...row };
    for (const field of REQUEST_TEXT_FIELDS) decoded[field] = decodeText(row[field]);
    return decoded as typeof row;
  });
}
export async function updateRequestStatus(id: string, status: string, admin_note?: string, ditangani_oleh?: number | null) { await db.update(informationRequests).set({ status, admin_note, ditangani_oleh, updated_at: new Date() }).where(eq(informationRequests.id, id)); }
export async function updateInformationRequest(id: string, data: Partial<typeof informationRequests.$inferInsert>) {
  // Jika admin mengubah tanggal pengajuan, tanggal masuk ikut disesuaikan.
  const created_at = typeof data.submitted_on === "string" ? entryDateFor(data.submitted_on) : undefined;
  await db.update(informationRequests).set({ ...data, ...(created_at ? { created_at } : {}), updated_at: new Date() }).where(eq(informationRequests.id, id));
}
export async function deleteInformationRequest(id: string) { return db.delete(informationRequests).where(eq(informationRequests.id, id)); }
export async function listDocuments(category?: string, subcategory?: string, latestOnly = false) {
  const conditions = [eq(publicDocuments.is_published, true)];
  if (category === "surat") {
    conditions.push(
      or(
        eq(publicDocuments.category, "surat"),
        and(eq(publicDocuments.category, "annual_report"), eq(publicDocuments.subcategory, "surat"))
      )!
    );
  } else if (category === "bmn") {
    conditions.push(
      or(
        eq(publicDocuments.category, "bmn"),
        and(eq(publicDocuments.category, "annual_report"), eq(publicDocuments.subcategory, "bmn"))
      )!
    );
  } else if (category === "annual_report") {
    conditions.push(eq(publicDocuments.category, "annual_report"));
    if (subcategory) {
      conditions.push(eq(publicDocuments.subcategory, subcategory));
    } else {
      conditions.push(
        or(
          eq(publicDocuments.subcategory, "ppid"),
          eq(publicDocuments.subcategory, "laporan_tahunan"),
          isNull(publicDocuments.subcategory)
        )!
      );
    }
  } else if (category) {
    conditions.push(eq(publicDocuments.category, category));
    if (subcategory) {
      conditions.push(eq(publicDocuments.subcategory, subcategory));
    }
  } else if (subcategory) {
    conditions.push(eq(publicDocuments.subcategory, subcategory));
  }
  const where = and(...conditions);
  const query = db.select().from(publicDocuments).where(where).orderBy(desc(publicDocuments.document_date), desc(publicDocuments.created_at));
  return latestOnly ? query.limit(2) : query;
}
export async function listAllDocumentsAdmin() { return db.select().from(publicDocuments).orderBy(desc(publicDocuments.created_at)); }
export async function createDocument(data: typeof publicDocuments.$inferInsert) { return db.insert(publicDocuments).values(data); }
export async function updateDocument(id: number, data: Partial<typeof publicDocuments.$inferInsert>) {
  await db.update(publicDocuments).set({ ...data, updated_at: new Date() }).where(eq(publicDocuments.id, id));
}
export async function deleteDocument(id: number) { return db.delete(publicDocuments).where(eq(publicDocuments.id, id)); }
export async function getDocument(id: number) { const [document] = await db.select().from(publicDocuments).where(and(eq(publicDocuments.id, id), eq(publicDocuments.is_published, true))).limit(1); return document; }
