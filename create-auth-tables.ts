import mysql from "mysql2/promise";

const pool = mysql.createPool(process.env.DATABASE_URL!);

async function run() {
  try {
    await pool.execute(`
CREATE TABLE IF NOT EXISTS \`user\` (
  \`id\` varchar(255) PRIMARY KEY NOT NULL,
  \`name\` text NOT NULL,
  \`email\` varchar(255) NOT NULL,
  \`email_verified\` boolean NOT NULL,
  \`image\` text,
  \`created_at\` timestamp NOT NULL,
  \`updated_at\` timestamp NOT NULL,
  CONSTRAINT \`user_email_unique\` UNIQUE(\`email\`)
);`);

    await pool.execute(`
CREATE TABLE IF NOT EXISTS \`session\` (
  \`id\` varchar(255) PRIMARY KEY NOT NULL,
  \`expires_at\` timestamp NOT NULL,
  \`token\` varchar(255) NOT NULL,
  \`created_at\` timestamp NOT NULL,
  \`updated_at\` timestamp NOT NULL,
  \`ip_address\` text,
  \`user_agent\` text,
  \`user_id\` varchar(255) NOT NULL,
  CONSTRAINT \`session_token_unique\` UNIQUE(\`token\`),
  CONSTRAINT \`session_user_id_user_id_fk\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`)
);`);

    await pool.execute(`
CREATE TABLE IF NOT EXISTS \`account\` (
  \`id\` varchar(255) PRIMARY KEY NOT NULL,
  \`account_id\` varchar(255) NOT NULL,
  \`provider_id\` varchar(255) NOT NULL,
  \`user_id\` varchar(255) NOT NULL,
  \`access_token\` text,
  \`refresh_token\` text,
  \`id_token\` text,
  \`access_token_expires_at\` timestamp,
  \`refresh_token_expires_at\` timestamp,
  \`scope\` text,
  \`password\` text,
  \`created_at\` timestamp NOT NULL,
  \`updated_at\` timestamp NOT NULL,
  CONSTRAINT \`account_user_id_user_id_fk\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`)
);`);

    await pool.execute(`
CREATE TABLE IF NOT EXISTS \`verification\` (
  \`id\` varchar(255) PRIMARY KEY NOT NULL,
  \`identifier\` varchar(255) NOT NULL,
  \`value\` text NOT NULL,
  \`expires_at\` timestamp NOT NULL,
  \`created_at\` timestamp,
  \`updated_at\` timestamp
);`);

    console.log("Tables created successfully");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
