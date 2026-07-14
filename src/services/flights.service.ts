import { db } from "@/db";
import { flights } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// ─── Get flights by date and optional type filter ─────────────
export async function getFlightsByDate(date: string, type?: string) {
  const conditions = [eq(flights.flight_date, date)];
  if (type && (type === "arrival" || type === "departure")) {
    conditions.push(eq(flights.type, type));
  }

  const results = await db
    .select()
    .from(flights)
    .where(and(...conditions))
    .orderBy(flights.scheduled_time);

  return results;
}

// ─── Create a new flight ──────────────────────────────────────
export async function createFlight(data: {
  flight_no: string;
  airline: string;

  origin?: string;
  destination?: string;
  type: string;
  flight_type?: string;
  scheduled_time: string;
  estimated_time?: string;

  status?: string;
  status_label?: string;
  notes?: string | null;
  flight_date: string;
}) {
  const [inserted] = await db.insert(flights).values(data).$returningId();
  const [result] = await db
    .select()
    .from(flights)
    .where(eq(flights.id, inserted.id))
    .limit(1);
  return result;
}

// ─── Update a flight ──────────────────────────────────────────
export async function updateFlight(
  id: number,
  data: Partial<{
    flight_no: string;
    airline: string;

    origin: string;
    destination: string;
    type: string;
    flight_type: string;
    scheduled_time: string;
    estimated_time: string;

    status: string;
    status_label: string;
    notes: string | null;
    flight_date: string;
  }>
) {
  await db
    .update(flights)
    .set({ ...data, updated_at: new Date() })
    .where(eq(flights.id, id));

  const [result] = await db
    .select()
    .from(flights)
    .where(eq(flights.id, id))
    .limit(1);
  return result;
}

// ─── Delete a flight ──────────────────────────────────────────
export async function deleteFlight(id: number) {
  const [result] = await db
    .select()
    .from(flights)
    .where(eq(flights.id, id))
    .limit(1);

  if (!result) return undefined;

  await db
    .delete(flights)
    .where(eq(flights.id, id));
  return result;
}
