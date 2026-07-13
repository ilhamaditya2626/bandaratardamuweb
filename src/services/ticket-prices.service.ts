import { db } from "@/db";
import { ticketPrices } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export type TicketFlightType = "reguler" | "perintis";

export const validTicketDays = [
  "senin",
  "selasa",
  "rabu",
  "kamis",
  "jumat",
  "sabtu",
  "minggu",
] as const;

type TicketDay = (typeof validTicketDays)[number];

function normalizeRouteKey(origin: string, destination: string) {
  return `${origin.trim().toLowerCase()}-${destination.trim().toLowerCase()}`
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function normalizeFlightType(value?: string): TicketFlightType {
  return value === "perintis" ? "perintis" : "reguler";
}

function normalizeOperatingDays(days?: unknown): TicketDay[] {
  if (typeof days === "string") {
    const trimmed = days.trim();

    try {
      const parsed = JSON.parse(trimmed);
      return normalizeOperatingDays(parsed);
    } catch {
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        return normalizeOperatingDays(trimmed.slice(1, -1).split(","));
      }

      return [];
    }
  }

  if (!Array.isArray(days)) return [];

  return days
    .map((day) => String(day).toLowerCase().trim())
    .filter((day): day is TicketDay =>
      validTicketDays.includes(day as TicketDay)
    );
}

function normalizeTicketPriceRow<T extends { operating_days: unknown }>(row: T) {
  return {
    ...row,
    operating_days: normalizeOperatingDays(row.operating_days),
  };
}

export async function getTicketPrices(includeInactive = false) {
  if (includeInactive) {
    const rows = await db
      .select()
      .from(ticketPrices)
      .orderBy(asc(ticketPrices.origin), asc(ticketPrices.destination));

    return rows.map(normalizeTicketPriceRow);
  }

  const rows = await db
    .select()
    .from(ticketPrices)
    .where(eq(ticketPrices.is_active, true))
    .orderBy(asc(ticketPrices.origin), asc(ticketPrices.destination));

  return rows.map(normalizeTicketPriceRow);
}

export async function createTicketPrice(data: {
  origin: string;
  destination: string;
  flight_type?: string;
  operating_days?: unknown;
  price: number;
  is_active?: boolean;
}) {
  const origin = data.origin.trim();
  const destination = data.destination.trim();
  const flightType = normalizeFlightType(data.flight_type);

  const [inserted] = await db
    .insert(ticketPrices)
    .values({
      route_key: normalizeRouteKey(origin, destination),
      origin,
      destination,
      flight_type: flightType,
      operating_days: normalizeOperatingDays(data.operating_days),
      price: Number(data.price),
      is_active: data.is_active ?? true,
    })
    .$returningId();

  const [result] = await db
    .select()
    .from(ticketPrices)
    .where(eq(ticketPrices.id, inserted.id))
    .limit(1);

  return result ? normalizeTicketPriceRow(result) : result;
}

export async function updateTicketPrice(
  id: number,
  data: Partial<{
    origin: string;
    destination: string;
    flight_type: string;
    operating_days: unknown;
    price: number;
    is_active: boolean;
  }>
) {
  const payload: {
    route_key?: string;
    origin?: string;
    destination?: string;
    flight_type?: TicketFlightType;
    operating_days?: TicketDay[];
    price?: number;
    is_active?: boolean;
    updated_at: Date;
  } = {
    updated_at: new Date(),
  };

  if (data.origin !== undefined) payload.origin = data.origin.trim();
  if (data.destination !== undefined) payload.destination = data.destination.trim();
  if (data.flight_type !== undefined) {
    payload.flight_type = normalizeFlightType(data.flight_type);
  }
  if (data.operating_days !== undefined) {
    payload.operating_days = normalizeOperatingDays(data.operating_days);
  }
  if (data.price !== undefined) payload.price = Number(data.price);
  if (data.is_active !== undefined) payload.is_active = data.is_active;

  if (payload.origin && payload.destination) {
    payload.route_key = normalizeRouteKey(payload.origin, payload.destination);
  }

  await db
    .update(ticketPrices)
    .set(payload)
    .where(eq(ticketPrices.id, id));

  const [result] = await db
    .select()
    .from(ticketPrices)
    .where(eq(ticketPrices.id, id))
    .limit(1);

  return result ? normalizeTicketPriceRow(result) : result;
}

export async function deleteTicketPrice(id: number) {
  const [result] = await db
    .select()
    .from(ticketPrices)
    .where(eq(ticketPrices.id, id))
    .limit(1);

  if (!result) return undefined;

  await db
    .delete(ticketPrices)
    .where(eq(ticketPrices.id, id));

  return normalizeTicketPriceRow(result);
}
