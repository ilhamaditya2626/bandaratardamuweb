import mysql from "mysql2/promise";
const conn = await mysql.createConnection({
  host: "45.127.35.23", port: 3306,
  user: "tardamua1_airport", password: "Tardamuairport@321",
  database: "tardamua1_airport",
});
for (const t of ["passenger_stats", "flights"]) {
  const [rows] = await conn.query(
    `SELECT ordinal_position, column_name, column_type, is_nullable, column_default, column_comment
       FROM information_schema.columns
      WHERE table_schema = DATABASE() AND table_name = ?
      ORDER BY ordinal_position`, [t]);
  console.log(`\n===== ${t} (${rows.length} kolom) =====`);
  for (const r of rows) {
    console.log(`${String(r.ordinal_position).padStart(2)} | [${r.column_name}] | ${r.column_type} | null=${r.is_nullable} | def=${r.column_default} | ${r.column_comment || ""}`);
  }
}
await conn.end();
