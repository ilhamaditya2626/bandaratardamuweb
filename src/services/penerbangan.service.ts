import { db } from "@/db";
import { penerbangan, maskapai, pilot, destinasi, penumpang } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";

// Daftar lengkap penerbangan, dengan nama-nama dari tabel terkait
// (bukan cuma id) supaya gampang ditampilkan di tabel Admin.
export async function getPenerbangan() {
  return db
    .select({
      id: penerbangan.id,
      maskapai_id: penerbangan.maskapai_id,
      pilot_id: penerbangan.pilot_id,
      destinasi_id: penerbangan.destinasi_id,
      penumpang_id: penerbangan.penumpang_id,
      tanggal: penerbangan.tanggal,
      jam: penerbangan.jam,
      seat: penerbangan.seat,
      harga_tiket: penerbangan.harga_tiket,
      nama_maskapai: maskapai.nama,
      nama_pilot: pilot.nama,
      nama_kota: destinasi.nama_kota,
      nama_penumpang: penumpang.nama,
    })
    .from(penerbangan)
    .leftJoin(maskapai, eq(penerbangan.maskapai_id, maskapai.id))
    .leftJoin(pilot, eq(penerbangan.pilot_id, pilot.id))
    .leftJoin(destinasi, eq(penerbangan.destinasi_id, destinasi.id))
    .leftJoin(penumpang, eq(penerbangan.penumpang_id, penumpang.id))
    .orderBy(desc(penerbangan.tanggal));
}

// Daftar opsi untuk dropdown form (id + nama saja).
export async function getPenerbanganOptions() {
  const [maskapaiList, pilotList, destinasiList, penumpangList] = await Promise.all([
    db.select({ id: maskapai.id, nama: maskapai.nama }).from(maskapai).orderBy(asc(maskapai.nama)),
    db.select({ id: pilot.id, nama: pilot.nama }).from(pilot).orderBy(asc(pilot.nama)),
    db.select({ id: destinasi.id, nama: destinasi.nama_kota }).from(destinasi).orderBy(asc(destinasi.nama_kota)),
    db.select({ id: penumpang.id, nama: penumpang.nama }).from(penumpang).orderBy(asc(penumpang.nama)),
  ]);
  return { maskapaiList, pilotList, destinasiList, penumpangList };
}

export interface PenerbanganInput {
  maskapai_id?: number | null;
  pilot_id?: number | null;
  destinasi_id?: number | null;
  penumpang_id?: number | null;
  tanggal?: string | null;
  jam?: string | null;
  seat?: string | null;
  harga_tiket?: number | null;
}

export async function createPenerbangan(data: PenerbanganInput) {
  const [inserted] = await db.insert(penerbangan).values(data).$returningId();
  const [result] = await db.select().from(penerbangan).where(eq(penerbangan.id, inserted.id)).limit(1);
  return result;
}

export async function updatePenerbangan(id: number, data: Partial<PenerbanganInput>) {
  await db.update(penerbangan).set({ ...data, updated_at: new Date() }).where(eq(penerbangan.id, id));
  const [result] = await db.select().from(penerbangan).where(eq(penerbangan.id, id)).limit(1);
  return result;
}

export async function deletePenerbangan(id: number) {
  const [result] = await db.select().from(penerbangan).where(eq(penerbangan.id, id)).limit(1);
  if (!result) return undefined;
  await db.delete(penerbangan).where(eq(penerbangan.id, id));
  return result;
}
