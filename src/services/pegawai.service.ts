import { db } from "@/db";
import { pegawai, divisi } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

// ─── Get all Pegawai, with Divisi name attached ────────────────
// (used by informasi-berkala page for the "officials" section)
export async function getAllPegawai() {
  return db
    .select({
      id: pegawai.id,
      nama: pegawai.nama,
      jabatan: pegawai.jabatan,
      pendidikan_terakhir: pegawai.pendidikan_terakhir,
      divisi_nama: divisi.nama,
    })
    .from(pegawai)
    .leftJoin(divisi, eq(pegawai.divisi_id, divisi.id))
    .orderBy(asc(pegawai.id));
}
