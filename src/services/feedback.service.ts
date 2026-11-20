import { db } from "@/db";
import { feedbackSubmissions, pegawai } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { decodeText } from "@/lib/sanitize";

export async function createFeedback(data: { name: string; message: string }) {
  const [inserted] = await db
    .insert(feedbackSubmissions)
    .values({
      name: data.name,
      message: data.message,
    })
    .$returningId();

  const [result] = await db
    .select()
    .from(feedbackSubmissions)
    .where(sql`${feedbackSubmissions.id} = ${inserted.id}`)
    .limit(1);

  return result;
}

export async function getAllFeedback(page: number = 1, limit: number = 50) {
  const offset = (page - 1) * limit;

  const data = await db
    .select({
      id: feedbackSubmissions.id,
      name: feedbackSubmissions.name,
      message: feedbackSubmissions.message,
      status: feedbackSubmissions.status,
      ditangani_oleh_nama: pegawai.nama,
      created_at: sql<string>`DATE_FORMAT(${feedbackSubmissions.created_at}, '%Y-%m-%dT%H:%i:%s.%f')`,
    })
    .from(feedbackSubmissions)
    .leftJoin(pegawai, eq(feedbackSubmissions.ditangani_oleh, pegawai.id))
    .orderBy(desc(feedbackSubmissions.created_at))
    .limit(limit)
    .offset(offset);

  // Isian disimpan dalam bentuk yang sudah dinetralkan; untuk dashboard dikembalikan menjadi teks biasa.
  const decodedData = data.map((row) => ({ ...row, name: decodeText(row.name), message: decodeText(row.message) }));

  const [countResult] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(feedbackSubmissions);

  const total = Number(countResult.count);

  return {
    data: decodedData,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Menandai kritik dan saran sudah ditangani, beserta pegawai yang menanganinya.
export async function markFeedbackHandled(id: number, pegawaiId: number | null) {
  await db
    .update(feedbackSubmissions)
    .set({ status: "ditangani", ditangani_oleh: pegawaiId })
    .where(eq(feedbackSubmissions.id, id));

  const [result] = await db
    .select()
    .from(feedbackSubmissions)
    .where(eq(feedbackSubmissions.id, id))
    .limit(1);

  return result;
}

export async function deleteFeedback(id: number) {
  await db.delete(feedbackSubmissions).where(eq(feedbackSubmissions.id, id));

  return { id };
}
