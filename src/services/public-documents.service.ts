import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { publicDocuments } from "@/db/schema";

// Hanya dokumen berjenis "umum" yang sudah dipublikasikan.
export async function getPublishedDocuments() {
  return db
    .select()
    .from(publicDocuments)
    .where(and(eq(publicDocuments.is_published, true), eq(publicDocuments.access_type, "umum")))
    .orderBy(desc(publicDocuments.document_date), desc(publicDocuments.id));
}