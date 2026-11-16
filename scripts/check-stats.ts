import mysql from 'mysql2/promise';

async function run() {
  const pool = mysql.createPool(process.env.DATABASE_URL!);

  const [rows] = await pool.query(`
    SELECT 
      flight_type, 
      SUM(CASE WHEN (pax_adult + pax_child) > 0 THEN (pax_adult + pax_child) ELSE passenger_count END) as pax,
      COUNT(*) as flight_count
    FROM passenger_stats
    WHERE date >= '2026-09-01' AND date <= '2026-09-30'
      AND airline IS NOT NULL AND flight_type IS NOT NULL AND city IS NOT NULL
    GROUP BY flight_type
  `);
  console.log('September 2026 stats:', rows);

  const [totalRows] = await pool.query(`
    SELECT 
      SUBSTRING(date, 1, 7) as ym,
      SUM(CASE WHEN (pax_adult + pax_child) > 0 THEN (pax_adult + pax_child) ELSE passenger_count END) as total_pax,
      SUM(CASE WHEN flight_type = 'arrival' THEN (CASE WHEN (pax_adult + pax_child) > 0 THEN (pax_adult + pax_child) ELSE passenger_count END) ELSE 0 END) as arr_pax,
      SUM(CASE WHEN flight_type = 'departure' THEN (CASE WHEN (pax_adult + pax_child) > 0 THEN (pax_adult + pax_child) ELSE passenger_count END) ELSE 0 END) as dep_pax,
      COUNT(*) as total_flights
    FROM passenger_stats
    WHERE airline IS NOT NULL AND flight_type IS NOT NULL AND city IS NOT NULL
    GROUP BY ym
    ORDER BY ym DESC
  `);
  console.log('Monthly summary from DB:', totalRows);

  const [availableMonths] = await pool.query(`
    SELECT DISTINCT SUBSTRING(date, 1, 7) as ym
    FROM passenger_stats
    WHERE airline IS NOT NULL AND flight_type IS NOT NULL AND city IS NOT NULL
    ORDER BY ym DESC
  `);
  console.log('Available months:', availableMonths);

  await pool.end();
}
run();
