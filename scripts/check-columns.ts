import mysql from "mysql2/promise";

async function main() {
  const pool = mysql.createPool(
    "mysql://tardamua1_airport:Tardamuairport@321@45.127.35.23:3306/tardamua1_airport"
  );

  try {
    // Check what columns exist in the flights table
    const [columns] = await pool.query(
      "SHOW COLUMNS FROM flights"
    );
    console.log("=== Current columns in flights table ===");
    console.log(JSON.stringify(columns, null, 2));

    // Check if flight_type column exists
    const cols = columns as any[];
    const hasFlightType = cols.some((c: any) => c.Field === "flight_type");
    const hasNotes = cols.some((c: any) => c.Field === "notes");

    console.log("\n=== Missing columns ===");
    if (!hasFlightType) {
      console.log("MISSING: flight_type");
      await pool.query(
        "ALTER TABLE flights ADD COLUMN `flight_type` varchar(30) DEFAULT 'reguler'"
      );
      console.log("ADDED: flight_type");
    } else {
      console.log("OK: flight_type exists");
    }

    if (!hasNotes) {
      console.log("MISSING: notes");
      await pool.query(
        "ALTER TABLE flights ADD COLUMN `notes` text"
      );
      console.log("ADDED: notes");
    } else {
      console.log("OK: notes exists");
    }

    // Verify
    const [columnsAfter] = await pool.query("SHOW COLUMNS FROM flights");
    console.log("\n=== Columns AFTER fix ===");
    (columnsAfter as any[]).forEach((c: any) => console.log(`  - ${c.Field} (${c.Type})`));

    // Test the exact query that was failing
    console.log("\n=== Testing the failing query ===");
    const [rows] = await pool.query(
      "SELECT id, flight_no, airline, airline_key, origin, destination, type, flight_type, scheduled_time, estimated_time, sta, eta, std, etd, status, status_label, notes, flight_date, created_at, updated_at FROM flights WHERE flights.flight_date = ? ORDER BY flights.scheduled_time",
      ["2026-07-14"]
    );
    console.log(`Query OK! Found ${(rows as any[]).length} rows`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await pool.end();
  }
}

main();
