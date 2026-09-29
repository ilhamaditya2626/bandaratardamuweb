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
  created_at?: Date;
}) {
  const baseSlug = slugify(data.title, { lower: true, strict: true }) || "berita";
  const slug = `${baseSlug}-${Math.floor(Date.now() / 1000)}`;

  const insertValues: Record<string, unknown> = {
    title: data.title,
    content: data.content,
    slug,
  };

  if (data.image_url) {
    insertValues.image_url = data.image_url;
  }
  if (data.author) {
    insertValues.author = data.author;
  }
  if (data.created_at && !isNaN(data.created_at.getTime())) {
    insertValues.created_at = data.created_at;
  }

  const [inserted] = await db
    .insert(news)
    .values(insertValues as any)
    .$returningId();

  const insertedId = inserted?.id ?? (inserted as any)?.insertId;

  if (insertedId) {
    const [result] = await db
      .select()
      .from(news)
      .where(eq(news.id, insertedId))
      .limit(1);

    if (result) return result;
  }

  return { id: insertedId, ...insertValues };
}

// ─── Update news article ──────────────────────────────────────
export async function updateNews(
  id: number,
  data: Partial<{
    title: string;
    content: string;
    image_url: string;
    author: string;
    created_at: Date;
  }>
) {
  const updateData: Record<string, unknown> = {
    updated_at: new Date(),
  };

  if (data.title !== undefined) updateData.title = data.title;
  if (data.content !== undefined) updateData.content = data.content;
  if (data.image_url !== undefined) updateData.image_url = data.image_url;
  if (data.author !== undefined) updateData.author = data.author;
  if (data.created_at && !isNaN(data.created_at.getTime())) {
    updateData.created_at = data.created_at;
  }

  // Regenerate slug if title changes
  if (data.title) {
    const baseSlug = slugify(data.title, { lower: true, strict: true }) || "berita";
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
