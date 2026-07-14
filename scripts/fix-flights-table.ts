import mysql from "mysql2/promise";

async function main() {
  const pool = mysql.createPool(
    "mysql://tardamua1_airport:Tardamuairport@321@45.127.35.23:3306/tardamua1_airport"
  );

  try {
    // Check current columns
    const [columns] = await pool.query("SHOW COLUMNS FROM flights");
    const cols = columns as any[];
    const existingFields = cols.map((c: any) => c.Field);
    console.log("Existing columns:", existingFields);

    // Define missing columns to add (based on schema.ts)
    const missingColumns = [
      { name: "airline_key", sql: "ALTER TABLE flights ADD COLUMN `airline_key` varchar(50) AFTER `airline`" },
      { name: "sta", sql: "ALTER TABLE flights ADD COLUMN `sta` varchar(5) AFTER `estimated_time`" },
      { name: "eta", sql: "ALTER TABLE flights ADD COLUMN `eta` varchar(5) AFTER `sta`" },
      { name: "std", sql: "ALTER TABLE flights ADD COLUMN `std` varchar(5) AFTER `eta`" },
      { name: "etd", sql: "ALTER TABLE flights ADD COLUMN `etd` varchar(5) AFTER `std`" },
    ];

    for (const col of missingColumns) {
      if (!existingFields.includes(col.name)) {
        console.log(`Adding missing column: ${col.name}...`);
        await pool.query(col.sql);
        console.log(`  ✅ Added: ${col.name}`);
      } else {
        console.log(`  ✓ Already exists: ${col.name}`);
      }
    }

    // Verify all columns now
    const [columnsAfter] = await pool.query("SHOW COLUMNS FROM flights");
    console.log("\n=== All columns after fix ===");
    (columnsAfter as any[]).forEach((c: any) =>
      console.log(`  - ${c.Field} (${c.Type}, Null: ${c.Null}, Default: ${c.Default})`)
    );

    // Test the exact failing query
    console.log("\n=== Testing the original failing query ===");
    const [rows] = await pool.query(
      "SELECT id, flight_no, airline, airline_key, origin, destination, type, flight_type, scheduled_time, estimated_time, sta, eta, std, etd, status, status_label, notes, flight_date, created_at, updated_at FROM flights WHERE flights.flight_date = ? ORDER BY flights.scheduled_time",
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
