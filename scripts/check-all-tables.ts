import mysql from "mysql2/promise";
import * as schema from "../src/db/schema";
import { getTableColumns, getTableName } from "drizzle-orm";

// Alamat dan kata sandi basis data tidak ditulis di dalam kode; diambil dari file .env.
// Contoh menjalankan: npx tsx --env-file=.env scripts/check-all-tables.ts
function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL belum diatur. Jalankan dengan: npx tsx --env-file=.env scripts/check-all-tables.ts");
  }
  return url;
}

async function main() {
  const connectionString = requireDatabaseUrl();
  const pool = mysql.createPool(connectionString);

  try {
    const [tablesRes] = await pool.query("SHOW TABLES");
    const existingTables = (tablesRes as any[]).map(r => Object.values(r)[0] as string);
    console.log("Existing tables in DB:", existingTables);

    const schemaTables = [
      { name: "news", table: schema.news },
      { name: "urgent_information", table: schema.urgentInformation },
      { name: "flights", table: schema.flights },
      { name: "ticket_prices", table: schema.ticketPrices },
      { name: "passenger_stats", table: schema.passengerStats },
      { name: "feedback_submissions", table: schema.feedbackSubmissions },
      { name: "information_requests", table: schema.informationRequests },
      { name: "public_documents", table: schema.publicDocuments },
      { name: "penginapan", table: schema.penginapan },
      { name: "user", table: schema.user },
      { name: "session", table: schema.session },
      { name: "account", table: schema.account },
      { name: "verification", table: schema.verification },
    ];

    for (const st of schemaTables) {
      if (!existingTables.includes(st.name)) {
        console.log(`[MISSING TABLE] ${st.name}`);
      } else {
        const [colsRes] = await pool.query(`SHOW COLUMNS FROM \`${st.name}\``);
        const existingCols = (colsRes as any[]).map(c => c.Field);
        const schemaCols = Object.keys(getTableColumns(st.table));
        const missingCols = schemaCols.filter(c => !existingCols.includes(c));
        if (missingCols.length > 0) {
          console.log(`[TABLE ${st.name}] Missing columns:`, missingCols);
        } else {
          console.log(`[TABLE ${st.name}] OK (all ${schemaCols.length} columns exist)`);
        }
      }
    }
  } catch (e) {
    console.error("Error checking db:", e);
  } finally {
    await pool.end();
  }
}

main();
