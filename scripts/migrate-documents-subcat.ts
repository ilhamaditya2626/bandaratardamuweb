import { db } from "../src/db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Checking public_documents columns...");
  try {
    const [cols]: any = await db.execute(sql`DESCRIBE public_documents`);
    const colNames = cols.map((c: any) => c.Field);
    console.log("Current columns:", colNames);

    if (!colNames.includes("subcategory")) {
      console.log("Adding subcategory column...");
      await db.execute(sql`ALTER TABLE public_documents ADD COLUMN subcategory VARCHAR(50) NULL AFTER category`);
      console.log("Column subcategory added successfully!");
    } else {
      console.log("Column subcategory already exists.");
    }

    console.log("Migrating existing annual_report documents to PPID...");
    await db.execute(sql`
      UPDATE public_documents 
      SET category = 'annual_report', subcategory = 'ppid' 
      WHERE category = 'annual_report_ppid'
    `);
    await db.execute(sql`
      UPDATE public_documents 
      SET category = 'annual_report', subcategory = 'bmn' 
      WHERE category = 'annual_report_bmn'
    `);
    await db.execute(sql`
      UPDATE public_documents 
      SET category = 'annual_report', subcategory = 'surat' 
      WHERE category = 'annual_report_surat'
    `);
    await db.execute(sql`
      UPDATE public_documents 
      SET subcategory = 'ppid' 
      WHERE category = 'annual_report' AND (subcategory IS NULL OR subcategory = '')
    `);

    const [rows]: any = await db.execute(sql`SELECT id, category, subcategory, title FROM public_documents`);
    console.log("Updated documents:", rows);

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration error:", error);
  }
  process.exit(0);
}

main();
