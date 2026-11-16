import fs from "fs/promises";
import path from "path";

// Rekap kepegawaian (status, kelompok usia, golongan) yang dikelola Unit Kerja UPBU
// melalui menu "Rekap Kepegawaian" di dashboard admin. Disimpan sebagai berkas data
// di folder storage, bukan tabel database.

export type RekapItem = { name: string; value: number };

export type RekapKepegawaian = {
  periode: string;
  status: RekapItem[];
  usia: RekapItem[];
  golongan: RekapItem[];
};

export const DEFAULT_REKAP: RekapKepegawaian = {
  periode: "November 2026",
  status: [
    { name: "PNS", value: 29 },
    { name: "CPNS", value: 5 },
    { name: "PPPK", value: 33 },
    { name: "PPPK Paruh Waktu", value: 5 },
  ],
  usia: [
    { name: "20-30", value: 31 },
    { name: "31-40", value: 25 },
    { name: "41-50", value: 13 },
    { name: "> 50", value: 3 },
  ],
  golongan: [
    { name: "Gol. V", value: 1 },
    { name: "Gol. IV", value: 2 },
    { name: "Gol. III/d", value: 5 },
    { name: "Gol. III/c", value: 8 },
    { name: "Gol. III/b", value: 10 },
    { name: "Gol. III/a", value: 6 },
    { name: "Gol. II/d", value: 15 },
    { name: "Gol. II/c", value: 22 },
    { name: "Gol. II/b", value: 3 },
  ],
};

// Di server, folder aplikasi dihapus dan dibuat ulang setiap kali deploy.
// Karena itu rekap disimpan di folder "storage" di samping folder uploads permanen
// (UPLOAD_DIR diatur oleh skrip deploy), supaya tidak ikut terhapus.
// Di laptop (tanpa UPLOAD_DIR), rekap tetap disimpan di folder storage proyek.
const STORAGE_DIR = process.env.UPLOAD_DIR
  ? path.join(path.dirname(process.env.UPLOAD_DIR), "storage")
  : path.join(process.cwd(), "storage");
const REKAP_FILE = path.join(STORAGE_DIR, "rekap-kepegawaian.json");
const GROUPS = ["status", "usia", "golongan"] as const;

// Memeriksa isi rekap: kelompok harus sama dengan kelompok bawaan,
// dan setiap jumlah harus bilangan bulat 0 sampai 10.000.
export function validateRekap(input: unknown): { data?: RekapKepegawaian; error?: string } {
  if (!input || typeof input !== "object") return { error: "Data rekap tidak valid" };
  const raw = input as Record<string, unknown>;

  const periode = String(raw.periode ?? "").trim();
  if (!periode || periode.length > 50) return { error: "Periode rekap wajib diisi (maksimal 50 karakter)" };

  const data: RekapKepegawaian = { periode, status: [], usia: [], golongan: [] };
  for (const group of GROUPS) {
    const items = raw[group];
    const defaults = DEFAULT_REKAP[group];
    if (!Array.isArray(items) || items.length !== defaults.length) return { error: `Kelompok ${group} tidak lengkap` };
    for (let i = 0; i < defaults.length; i++) {
      const item = items[i] as Record<string, unknown> | undefined;
      const value = Number(item?.value);
      if (item?.name !== defaults[i].name) return { error: `Kelompok ${group} tidak sesuai` };
      if (!Number.isInteger(value) || value < 0 || value > 10000) {
        return { error: `Jumlah ${defaults[i].name} harus bilangan bulat 0 sampai 10.000` };
      }
      data[group].push({ name: defaults[i].name, value });
    }
  }
  return { data };
}

export async function getRekapKepegawaian(): Promise<RekapKepegawaian> {
  try {
    const content = await fs.readFile(REKAP_FILE, "utf8");
    const { data } = validateRekap(JSON.parse(content));
    return data ?? DEFAULT_REKAP;
  } catch {
    return DEFAULT_REKAP; // berkas belum ada: pakai rekap bawaan
  }
}

export async function saveRekapKepegawaian(data: RekapKepegawaian) {
  await fs.mkdir(path.dirname(REKAP_FILE), { recursive: true });
  await fs.writeFile(REKAP_FILE, JSON.stringify(data, null, 2), "utf8");
}
