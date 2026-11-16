/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";

export type FieldType = "string" | "number" | "boolean" | "date" | "datetime";
export type CrudField = { name: string; type: FieldType; required?: boolean };

type Options = {
  table: any;
  fields: CrudField[];
  label: string; // nama data, dipakai di pesan error
  pegawaiField?: string; // kolom FK ke pegawai yang diisi otomatis dari admin yang login
  pegawaiOn?: "create" | "update"; // default: create
  allowCreate?: boolean; // default: true
};

// Mengambil id pegawai yang terhubung dengan akun admin yang sedang login.
export async function getPegawaiId(userId: string) {
  const [row] = await db
    .select({ pegawai_id: user.pegawai_id })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  return row?.pegawai_id ?? null;
}

function parseValue(field: CrudField, raw: unknown): unknown {
  if (field.type === "boolean") return raw === true || raw === "true" || raw === 1 || raw === "1";
  if (raw === undefined || raw === null || String(raw).trim() === "") return null;
  const text = String(raw).trim();
  if (field.type === "number") {
    const n = Number(text);
    return Number.isFinite(n) ? n : undefined; // undefined = tidak valid
  }
  if (field.type === "datetime") {
    const d = new Date(text);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }
  return text; // string dan date (format YYYY-MM-DD)
}

function buildValues(fields: CrudField[], body: Record<string, unknown>, mode: "create" | "update") {
  const values: Record<string, unknown> = {};
  for (const field of fields) {
    if (!(field.name in body)) {
      if (mode === "create" && field.required) return { values, error: `Kolom ${field.name} wajib diisi` };
      continue;
    }
    const parsed = parseValue(field, body[field.name]);
    if (parsed === undefined) return { values, error: `Kolom ${field.name} tidak valid` };
    if (parsed === null && field.required) return { values, error: `Kolom ${field.name} wajib diisi` };
    values[field.name] = parsed;
  }
  return { values, error: null as string | null };
}

export function createAdminCrud(options: Options) {
  const { table, fields, label } = options;
  const fail = (error: string, status: number) => NextResponse.json({ success: false, error }, { status });
  const getSession = (request: NextRequest) => auth.api.getSession({ headers: request.headers });

  async function GET(request: NextRequest) {
    if (!(await getSession(request))) return fail("Unauthorized", 401);
    try {
      const data = await db.select().from(table).orderBy(desc(table.id)).limit(500);
      return NextResponse.json({ success: true, data });
    } catch (error) {
      console.error(error);
      return fail(`Gagal memuat data ${label}`, 500);
    }
  }

  async function POST(request: NextRequest) {
    const session = await getSession(request);
    if (!session) return fail("Unauthorized", 401);
    if (options.allowCreate === false) return fail("Penambahan data tidak diizinkan", 405);
    try {
      const body = await request.json();
      const { values, error } = buildValues(fields, body, "create");
      if (error) return fail(error, 400);
      if (options.pegawaiField && options.pegawaiOn !== "update") {
        values[options.pegawaiField] = await getPegawaiId(session.user.id);
      }
      const [inserted] = await db.insert(table).values(values).$returningId();
      const [data] = await db.select().from(table).where(eq(table.id, inserted.id)).limit(1);
      return NextResponse.json({ success: true, data }, { status: 201 });
    } catch (error) {
      console.error(error);
      return fail(`Gagal menambah data ${label}`, 500);
    }
  }

  async function PUT(request: NextRequest) {
    const session = await getSession(request);
    if (!session) return fail("Unauthorized", 401);
    try {
      const body = await request.json();
      const id = Number(body.id);
      if (!id) return fail("ID tidak valid", 400);
      const { values, error } = buildValues(fields, body, "update");
      if (error) return fail(error, 400);
      if (options.pegawaiField && options.pegawaiOn === "update") {
        values[options.pegawaiField] = await getPegawaiId(session.user.id);
      }
      if ("updated_at" in table) values.updated_at = new Date();
      if (!Object.keys(values).length) return fail("Tidak ada data yang diubah", 400);
      await db.update(table).set(values).where(eq(table.id, id));
      const [data] = await db.select().from(table).where(eq(table.id, id)).limit(1);
      if (!data) return fail(`Data ${label} tidak ditemukan`, 404);
      return NextResponse.json({ success: true, data });
    } catch (error) {
      console.error(error);
      return fail(`Gagal memperbarui data ${label}`, 500);
    }
  }

  async function DELETE(request: NextRequest) {
    if (!(await getSession(request))) return fail("Unauthorized", 401);
    try {
      const { id } = await request.json();
      const [existing] = await db.select().from(table).where(eq(table.id, Number(id))).limit(1);
      if (!existing) return fail(`Data ${label} tidak ditemukan`, 404);
      await db.delete(table).where(eq(table.id, Number(id)));
      return NextResponse.json({ success: true, data: existing });
    } catch (error) {
      const text = `${(error as any)?.message ?? ""} ${(error as any)?.cause?.message ?? ""}`;
      if (/foreign key|ER_ROW_IS_REFERENCED/i.test(text)) {
        return fail(`Data ${label} masih dipakai oleh data lain, sehingga tidak bisa dihapus`, 409);
      }
      console.error(error);
      return fail(`Gagal menghapus data ${label}`, 500);
    }
  }

  return { GET, POST, PUT, DELETE };
}