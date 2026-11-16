import { db } from "../src/db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Checking public_documents columns...");
  try {
    const [cols]: any = await db.execute(sql`DESCRIBE public_documents`);
    const colNames = cols.map((c: any) => c.Field);
    console.log("Current columns:", colNames);

    if (!colNames.includes("access_type")) {
      console.log("Adding access_type column...");
      await db.execute(sql`ALTER TABLE public_documents ADD COLUMN access_type VARCHAR(20) NOT NULL DEFAULT 'umum' AFTER is_published`);
      console.log("Column access_type added successfully!");
    } else {
      console.log("Column access_type already exists.");
    }

    console.log("Migrating surat and bmn categories...");
    await db.execute(sql`
      UPDATE public_documents 
      SET category = 'surat', subcategory = NULL 
      WHERE subcategory = 'surat'
    `);

    await db.execute(sql`
      UPDATE public_documents 
      SET category = 'bmn', subcategory = NULL 
      WHERE subcategory = 'bmn'
    `);

    await db.execute(sql`
      UPDATE public_documents 
      SET access_type = 'umum' 
      WHERE access_type IS NULL OR access_type = ''
    `);

    const [rows]: any = await db.execute(sql`SELECT id, category, subcategory, access_type, title FROM public_documents ORDER BY id DESC`);
    console.log("Updated documents:", rows);

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration error:", error);
  }
  process.exit(0);
}

main();
