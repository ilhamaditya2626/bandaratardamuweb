import mysql from "mysql2/promise";
import * as schema from "../src/db/schema";
import { getTableColumns, getTableName } from "drizzle-orm";

async function main() {
  const connectionString = process.env.DATABASE_URL || "mysql://tardamua1_airport:Tardamuairport@321@45.127.35.23:3306/tardamua1_airport";
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
