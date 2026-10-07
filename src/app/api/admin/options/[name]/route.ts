/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { divisi, maskapai, pegawai, role } from "@/db/schema";

const sources: Record<string, { table: any; label: string }> = {
  divisi: { table: divisi, label: "nama" },
  role: { table: role, label: "nama_role" },
  maskapai: { table: maskapai, label: "nama" },
  pegawai: { table: pegawai, label: "nama" },
};

export async function GET(request: NextRequest, context: { params: Promise<{ name: string }> }) {
  if (!(await auth.api.getSession({ headers: request.headers }))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { name } = await context.params;
  const source = sources[name];
  if (!source) return NextResponse.json({ success: false, error: "Sumber tidak dikenal" }, { status: 404 });
  const rows = await db.select().from(source.table).orderBy(asc(source.table.id));
  return NextResponse.json({ success: true, data: rows.map((r: any) => ({ value: r.id, label: String(r[source.label]) })) });
}