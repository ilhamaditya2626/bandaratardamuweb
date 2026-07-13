import { loadEnvConfig } from "@next/env";
import { eq } from "drizzle-orm";

loadEnvConfig(process.cwd());

async function runSeed() {
  console.log("Seeding Database...");

  try {
    const [{ db }, { passengerStats, user }, { auth }] = await Promise.all([
      import("./src/db"),
      import("./src/db/schema"),
      import("./src/lib/auth"),
    ]);

    // 1. Re-check/Create Admin User
    const adminEmail = "admin@admin.com";
    const existingAdmins = await db.select().from(user).where(eq(user.email, adminEmail));

    if (existingAdmins.length === 0) {
      console.log("Creating admin user...");
      // For a seed script, it's safer to use better-auth API to correctly hash the password
      // We simulate a fetch Request to the better-auth handler, but calling the internal API is easier:

      // better-auth v1 API for creating a user
      await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: "admin123",
          name: "Administrator",
        },
      });
      console.log("Admin user created: admin@admin.com / admin123");
    } else {
      console.log("Admin user already exists.");
    }

    // 2. Generate 30 days of dummy passenger data
    console.log("Generating 30 days of passenger data...");
    const today = new Date();
    const dataToInsert = [];

    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      // Random domestic data
      const arrDom = Math.floor(Math.random() * 200) + 100;
      const depDom = Math.floor(Math.random() * 200) + 100;

      dataToInsert.push({
        date: dateStr,
        arrival_count: arrDom,
        departure_count: depDom,
        category: "domestic",
      });

      // Random international data (smaller numbers)
      const arrInt = Math.floor(Math.random() * 50);
      const depInt = Math.floor(Math.random() * 50);

      dataToInsert.push({
        date: dateStr,
        arrival_count: arrInt,
        departure_count: depInt,
        category: "international",
      });
    }

    // Upsert data
    // Drizzle doesn't have native bulk upsert across all dialects simply without onConflictDoUpdate
    // For simplicity in a script, we insert ignore or just delete old stats for these dates and insert anew.
    for (const record of dataToInsert) {
      // Check existing
      const exist = await db
        .select()
        .from(passengerStats)
        .where(eq(passengerStats.date, record.date))
        .limit(1);

      if (exist.length === 0) {
        await db.insert(passengerStats).values(record as any);
      }
    }

    console.log("30 days of passenger data seeded.");
    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

runSeed();
