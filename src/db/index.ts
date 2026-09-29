import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("dotenv").config();
  } catch {}
}

const connectionString =
  process.env.DATABASE_URL ||
  "mysql://tardamua1_airport:Tardamuairport@321@45.127.35.23:3306/tardamua1_airport";

const pool = mysql.createPool(connectionString);

export const db = drizzle(pool, { schema, mode: "default" });
