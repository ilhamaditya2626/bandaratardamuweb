// Menambah kolom DAU ke DB produksi secara IDEMPOTEN.
// Mengecek information_schema lebih dulu; hanya menambah yang belum ada.
// Jalankan: node migrations/add-dau-columns.mjs
import mysql from "mysql2/promise";

const conn = await mysql.createConnection({
  host: "45.127.35.23",
  port: 3306,
  user: "tardamua1_airport",
  password: "Tardamuairport@321",
  database: "tardamua1_airport",
  multipleStatements: true,
});

const KOLOM = {
  passenger_stats: [
    ["pax_adult", "INT NOT NULL DEFAULT 0", "Dewasa (dihitung penumpang)"],
    ["pax_child", "INT NOT NULL DEFAULT 0", "Anak (dihitung penumpang)"],
    ["pax_infant", "INT NOT NULL DEFAULT 0", "Bayi (TIDAK dihitung, tetap tampil di PDF)"],
    ["pax_transit_adult", "INT NOT NULL DEFAULT 0", "Transit dewasa"],
    ["pax_transit_child", "INT NOT NULL DEFAULT 0", "Transit anak"],
    ["pax_transit_infant", "INT NOT NULL DEFAULT 0", "Transit bayi"],
    ["baggage_kg", "INT NOT NULL DEFAULT 0", "Bagasi (kg)"],
    ["cargo_kg", "INT NOT NULL DEFAULT 0", "Kargo (kg)"],
    ["mail_kg", "INT NOT NULL DEFAULT 0", "Pos (kg)"],
  ],
  flights: [
    ["seat_capacity", "INT NOT NULL DEFAULT 12", "Kapasitas kursi"],
    ["aircraft_type", "VARCHAR(30) NULL", "Tipe pesawat, mis. C.208.B"],
    ["is_scheduled", "TINYINT(1) NOT NULL DEFAULT 0", "1=Berjadwal, 0=Tidak Berjadwal"],
  ],
};

async function kolomAda(tabel, kolom) {
  const [rows] = await conn.query(
    `SELECT COUNT(*) AS n FROM information_schema.columns
      WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?`,
    [tabel, kolom]
  );
  return rows[0].n > 0;
}

let ditambah = 0, dilewati = 0;
for (const [tabel, daftar] of Object.entries(KOLOM)) {
  for (const [kolom, tipe, komentar] of daftar) {
    if (await kolomAda(tabel, kolom)) {
      console.log(`= lewati  ${tabel}.${kolom} (sudah ada)`);
      dilewati++;
      continue;
    }
    await conn.query(
      `ALTER TABLE \`${tabel}\` ADD COLUMN \`${kolom}\` ${tipe} COMMENT ${conn.escape(komentar)}`
    );
    console.log(`+ tambah  ${tabel}.${kolom}`);
    ditambah++;
  }
}

console.log(`\nSelesai. Ditambah: ${ditambah}, dilewati: ${dilewati}.`);
await conn.end();
