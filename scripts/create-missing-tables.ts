import mysql from "mysql2/promise";

async function run() {
  const connectionString = process.env.DATABASE_URL || "mysql://tardamua1_airport:Tardamuairport@321@45.127.35.23:3306/tardamua1_airport";
  const pool = mysql.createPool(connectionString);

  try {
    console.log("Creating information_requests table if not exists...");
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS \`information_requests\` (
        \`id\` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
        \`request_type\` varchar(20) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`name\` varchar(150) NOT NULL,
        \`phone\` varchar(40) NOT NULL,
        \`address\` text NOT NULL,
        \`occupation\` varchar(150) NOT NULL,
        \`identity_type\` varchar(20) NOT NULL,
        \`identity_number\` varchar(120) NOT NULL,
        \`identity_file_url\` text NOT NULL,
        \`institution\` varchar(255) DEFAULT NULL,
        \`information_detail\` text DEFAULT NULL,
        \`purpose\` text DEFAULT NULL,
        \`supporting_file_url\` text DEFAULT NULL,
        \`objection_reason\` varchar(255) DEFAULT NULL,
        \`objection_reason_other\` text DEFAULT NULL,
        \`case_position\` text DEFAULT NULL,
        \`submitted_on\` date NOT NULL,
        \`status\` varchar(20) NOT NULL DEFAULT 'pending',
        \`admin_note\` text DEFAULT NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log("information_requests table created or verified successfully.");
  } catch (err) {
    console.error("Failed to create table:", err);
  } finally {
    await pool.end();
  }
}

run();
