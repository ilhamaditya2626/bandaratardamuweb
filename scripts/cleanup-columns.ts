import mysql from "mysql2/promise";

async function main() {
  const pool = mysql.createPool(
    "mysql://tardamua1_airport:Tardamuairport@321@45.127.35.23:3306/tardamua1_airport"
  );

  try {
    // Drop the columns we mistakenly added earlier
    const columnsToDrop = ["airline_key", "sta", "eta", "std", "etd"];
    
    const [columns] = await pool.query("SHOW COLUMNS FROM flights");
    const existingFields = (columns as any[]).map((c: any) => c.Field);

    for (const col of columnsToDrop) {
      if (existingFields.includes(col)) {
        console.log(`Dropping column: ${col}...`);
        await pool.query(`ALTER TABLE flights DROP COLUMN \`${col}\``);
        console.log(`  ✅ Dropped: ${col}`);
      } else {
        console.log(`  ✓ Already absent: ${col}`);
      }
    }

    // Verify final state
    const [columnsAfter] = await pool.query("SHOW COLUMNS FROM flights");
    console.log("\n=== Final columns in flights table ===");
    (columnsAfter as any[]).forEach((c: any) =>
      console.log(`  - ${c.Field} (${c.Type})`)
    );

    // Test the query that Drizzle will now generate (without the removed columns)
    console.log("\n=== Testing Drizzle query (without removed columns) ===");
    const [rows] = await pool.query(
      "SELECT id, flight_no, airline, origin, destination, type, flight_type, scheduled_time, estimated_time, status, status_label, notes, flight_date, created_at, updated_at FROM flights WHERE flights.flight_date = ? ORDER BY flights.scheduled_time",
      ["2026-07-14"]
    );
    console.log(`✅ Query succeeded! Found ${(rows as any[]).length} rows.`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await pool.end();
  }
}

main();
