import mysql from "mysql2/promise";
import { randomUUID } from "crypto";

// Mengubah kolom id pada tabel information_requests dari angka berurutan (auto increment)
// menjadi UUID v4 acak, lalu memberi UUID baru untuk setiap permohonan yang sudah ada.
// Jalankan SATU KALI dengan: npx tsx --env-file=.env scripts/migrate-information-requests-uuid.ts
// Aman dijalankan ulang: jika kolom sudah berupa varchar dan semua id sudah UUID, skrip tidak mengubah apa pun.

function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL belum diatur. Jalankan dengan: npx tsx --env-file=.env scripts/migrate-information-requests-uuid.ts"
    );
  }
  return url;
}

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function main() {
  const connection = await mysql.createConnection(requireDatabaseUrl());
  try {
    const [columns] = await connection.query("SHOW COLUMNS FROM information_requests WHERE Field = 'id'");
    const idColumn = (columns as any[])[0];
    if (!idColumn) throw new Error("Kolom id pada tabel information_requests tidak ditemukan.");
    console.log(`Tipe kolom id sekarang: ${idColumn.Type} ${idColumn.Extra || ""}`);

    if (!String(idColumn.Type).toLowerCase().startsWith("varchar")) {
      // Menghapus auto increment dan mengubah tipe menjadi varchar(36); kunci utama tetap pada kolom id.
      await connection.query("ALTER TABLE information_requests MODIFY id VARCHAR(36) NOT NULL");
      console.log("Kolom id diubah menjadi VARCHAR(36).");
    } else {
      console.log("Kolom id sudah VARCHAR, langkah ubah tipe dilewati.");
    }

    const [rows] = await connection.query("SELECT id FROM information_requests");
    let updated = 0;
    for (const row of rows as { id: string }[]) {
      if (UUID_V4.test(String(row.id))) continue;
      await connection.query("UPDATE information_requests SET id = ? WHERE id = ?", [randomUUID(), String(row.id)]);
      updated++;
    }
    console.log(`Selesai. ${updated} permohonan lama diberi UUID baru; ${(rows as unknown[]).length - updated} sudah UUID.`);
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error("Migrasi gagal:", error);
  process.exit(1);
});
