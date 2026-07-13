import { db } from "@/db";
import { news } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import slugify from "slugify";

// ─── Get paginated news list ──────────────────────────────────
export async function getAllNews(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit;

  const data = await db
    .select({
      id: news.id,
      title: news.title,
      slug: news.slug,
      image_url: news.image_url,
      author: news.author,
      // Return a preview snippet (first 200 chars of content)
      content: sql<string>`SUBSTRING(${news.content}, 1, 200)`,
      created_at: news.created_at,
    })
    .from(news)
    .orderBy(desc(news.created_at))
    .limit(limit)
    .offset(offset);

  // Get total count for pagination
  const [countResult] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(news);

  return {
    data,
    pagination: {
      page,
      limit,
      total: Number(countResult.count),
      totalPages: Math.ceil(Number(countResult.count) / limit),
    },
  };
}

// ─── Get single news by slug ──────────────────────────────────
export async function getNewsBySlug(slug: string) {
  const [result] = await db
    .select()
    .from(news)
    .where(eq(news.slug, slug))
    .limit(1);

  return result || null;
}

export async function getNewsSitemapEntries() {
  return db
    .select({
      slug: news.slug,
      created_at: news.created_at,
      updated_at: news.updated_at,
    })
    .from(news)
    .where(sql`${news.slug} IS NOT NULL`)
    .orderBy(desc(news.updated_at));
}

// ─── Create news article ──────────────────────────────────────
export async function createNews(data: {
  title: string;
  content: string;
  image_url?: string;
  author?: string;
}) {
  const baseSlug = slugify(data.title, { lower: true, strict: true });
  const slug = `${baseSlug}-${Math.floor(Date.now() / 1000)}`;

  const [inserted] = await db
    .insert(news)
    .values({ ...data, slug })
    .$returningId();

  const [result] = await db
    .select()
    .from(news)
    .where(eq(news.id, inserted.id))
    .limit(1);

  return result;
}

// ─── Update news article ──────────────────────────────────────
export async function updateNews(
  id: number,
  data: Partial<{
    title: string;
    content: string;
    image_url: string;
    author: string;
  }>
) {
  const updateData: Record<string, unknown> = {
    ...data,
    updated_at: new Date(),
  };

  // Regenerate slug if title changes
  if (data.title) {
    const baseSlug = slugify(data.title, { lower: true, strict: true });
    updateData.slug = `${baseSlug}-${Math.floor(Date.now() / 1000)}`;
  }

  await db
    .update(news)
    .set(updateData)
    .where(eq(news.id, id));

  const [result] = await db.select().from(news).where(eq(news.id, id)).limit(1);

  return result;
}

// ─── Delete news article ──────────────────────────────────────
export async function deleteNews(id: number) {
  const [result] = await db.select().from(news).where(eq(news.id, id)).limit(1);

  if (!result) return undefined;

  await db
    .delete(news)
    .where(eq(news.id, id));

  return result;
}
