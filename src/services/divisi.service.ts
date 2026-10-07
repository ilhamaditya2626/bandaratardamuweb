import { db } from "@/db";
import { divisi } from "@/db/schema";
import { asc } from "drizzle-orm";

// ─── Get all Divisi (used by unit-kerja page) ──────────────────
export async function getAllDivisi() {
  return db.select().from(divisi).orderBy(asc(divisi.id));
}
