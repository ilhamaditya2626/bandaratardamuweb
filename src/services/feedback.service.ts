import { db } from "@/db";
import { feedbackSubmissions } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

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
      created_at: sql<string>`DATE_FORMAT(${feedbackSubmissions.created_at}, '%Y-%m-%dT%H:%i:%s.%f')`,
    })
    .from(feedbackSubmissions)
    .orderBy(desc(feedbackSubmissions.created_at))
    .limit(limit)
    .offset(offset);

  const [countResult] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(feedbackSubmissions);

  const total = Number(countResult.count);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
