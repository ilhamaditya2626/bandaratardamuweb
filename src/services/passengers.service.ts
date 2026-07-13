import { db } from "@/db";
import { passengerStats } from "@/db/schema";
import { eq, gte, lte, and } from "drizzle-orm";

type FlightType = "arrival" | "departure";

const DEFAULT_SEAT_CAPACITY = 12;

function calculateLoadFactor(passengerCount: number) {
  if (DEFAULT_SEAT_CAPACITY <= 0) return 0;
  return Number(((passengerCount / DEFAULT_SEAT_CAPACITY) * 100).toFixed(1));
}

// ─── Insert passenger data from Admin ─────────────────────────
export async function syncDailyPassengers(
  date: string,
  airline: string,
  flight_type: FlightType,
  city: string,
  passenger_count: number
) {
  const [inserted] = await db
    .insert(passengerStats)
    .values({
      date,
      airline,
      flight_type,
      city,
      passenger_count,
      load_factor: calculateLoadFactor(passenger_count).toFixed(2),
    })
    .$returningId();

  const [result] = await db
    .select()
    .from(passengerStats)
    .where(eq(passengerStats.id, inserted.id))
    .limit(1);

  return result;
}

export async function updatePassengerLog(
  id: number,
  date: string,
  airline: string,
  flight_type: FlightType,
  city: string,
  passenger_count: number
) {
  await db
    .update(passengerStats)
    .set({
      date,
      airline,
      flight_type,
      city,
      passenger_count,
      load_factor: calculateLoadFactor(passenger_count).toFixed(2),
    })
    .where(eq(passengerStats.id, id));

  const [result] = await db
    .select()
    .from(passengerStats)
    .where(eq(passengerStats.id, id))
    .limit(1);

  return result;
}

export async function deletePassengerLog(id: number) {
  const [result] = await db
    .select()
    .from(passengerStats)
    .where(eq(passengerStats.id, id))
    .limit(1);

  if (!result) return undefined;

  await db
    .delete(passengerStats)
    .where(eq(passengerStats.id, id));

  return result;
}

// ─── Calculate date range boundaries ──────────────────────────
function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getWeekStart(date: Date) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() - copy.getDay());
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function getDateRange(range: string, anchorDate?: string): { start: string; end: string } {
  const date = anchorDate ? new Date(`${anchorDate}T00:00:00`) : new Date();

  if (range === "daily") {
    return { start: toISODate(date), end: toISODate(date) };
  }

  if (range === "weekly") {
    const start = getWeekStart(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start: toISODate(start), end: toISODate(end) };
  }

  if (range === "monthly") {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { start: toISODate(start), end: toISODate(end) };
  }

  if (range === "yearly") {
    const start = new Date(date.getFullYear(), 0, 1);
    const end = new Date(date.getFullYear(), 11, 31);
    return { start: toISODate(start), end: toISODate(end) };
  }

  return { start: toISODate(date), end: toISODate(date) };
}

function getPassengerCount(row: typeof passengerStats.$inferSelect) {
  return Number(row.passenger_count ?? 0);
}

function getLoadFactor(row: typeof passengerStats.$inferSelect) {
  const passengerCount = getPassengerCount(row);
  return calculateLoadFactor(passengerCount);
}

// ─── Get aggregated stats for charts ──────────────────────────
export async function getStats(range: string, anchorDate?: string) {
  const { start, end } = getDateRange(range, anchorDate);

  const rawData = await db
    .select()
    .from(passengerStats)
    .where(and(gte(passengerStats.date, start), lte(passengerStats.date, end)))
    .orderBy(passengerStats.date);

  const data = rawData.filter((row) => {
    return (
      row.airline &&
      row.flight_type &&
      row.city &&
      getPassengerCount(row) > 0
    );
  });

  let totalArrival = 0;
  let totalDeparture = 0;

  data.forEach((row) => {
    const passengerCount = getPassengerCount(row);

    if (row.flight_type === "arrival") {
      totalArrival += passengerCount;
    }

    if (row.flight_type === "departure") {
      totalDeparture += passengerCount;
    }
  });

  const totalPassengers = totalArrival + totalDeparture;

  const arrivalPct =
    totalPassengers > 0
      ? Number(((totalArrival / totalPassengers) * 100).toFixed(1))
      : 0;

  const departurePct =
    totalPassengers > 0
      ? Number(((totalDeparture / totalPassengers) * 100).toFixed(1))
      : 0;

  const groupedData = data.reduce((acc, row) => {
    const rowDate = new Date(`${row.date}T00:00:00`);
    let key = row.date;

    if (range === "monthly") {
      const day = rowDate.getDate();

      if (day <= 7) key = "Minggu 1";
      else if (day <= 14) key = "Minggu 2";
      else if (day <= 21) key = "Minggu 3";
      else key = "Minggu 4";
    }

    if (range === "yearly") {
      key = String(rowDate.getMonth());
    }

    if (!acc[key]) {
      acc[key] = {
        arrival: 0,
        departure: 0,
        loadFactorTotal: 0,
        loadFactorCount: 0,
      };
    }

    const passengerCount = getPassengerCount(row);
    const loadFactor = getLoadFactor(row);

    if (row.flight_type === "arrival") {
      acc[key].arrival += passengerCount;
    }

    if (row.flight_type === "departure") {
      acc[key].departure += passengerCount;
    }

    acc[key].loadFactorTotal += loadFactor;
    acc[key].loadFactorCount += 1;

    return acc;
  }, {} as Record<string, {
    arrival: number;
    departure: number;
    loadFactorTotal: number;
    loadFactorCount: number;
  }>);

  let trendLabels: string[] = [];
  let trendArrivals: number[] = [];
  let trendDepartures: number[] = [];
  let trendLoadFactors: number[] = [];

  function getAverageLoadFactor(value: {
    loadFactorTotal: number;
    loadFactorCount: number;
  }) {
    return value.loadFactorCount > 0
      ? Number((value.loadFactorTotal / value.loadFactorCount).toFixed(1))
      : 0;
  }

  if (range === "daily") {
    const value = data.reduce(
      (acc, row) => {
        const passengerCount = getPassengerCount(row);
        const loadFactor = getLoadFactor(row);

        if (row.flight_type === "arrival") {
          acc.arrival += passengerCount;
        }

        if (row.flight_type === "departure") {
          acc.departure += passengerCount;
        }

        acc.loadFactorTotal += loadFactor;
        acc.loadFactorCount += 1;

        return acc;
      },
      {
        arrival: 0,
        departure: 0,
        loadFactorTotal: 0,
        loadFactorCount: 0,
      }
    );

    trendLabels.push(
      new Date(`${start}T00:00:00`).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      })
    );
    trendArrivals.push(value.arrival);
    trendDepartures.push(value.departure);
    trendLoadFactors.push(getAverageLoadFactor(value));
  } else if (range === "weekly") {
    const startDate = new Date(`${start}T00:00:00`);

    for (let i = 0; i < 7; i++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + i);

      const key = toISODate(current);
      const value =
        groupedData[key] || {
          arrival: 0,
          departure: 0,
          loadFactorTotal: 0,
          loadFactorCount: 0,
        };

      trendLabels.push(
        current.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        })
      );
      trendArrivals.push(value.arrival);
      trendDepartures.push(value.departure);
      trendLoadFactors.push(getAverageLoadFactor(value));
    }
  } else if (range === "monthly") {
    ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"].forEach((key) => {
      const value =
        groupedData[key] || {
          arrival: 0,
          departure: 0,
          loadFactorTotal: 0,
          loadFactorCount: 0,
        };

      trendLabels.push(key);
      trendArrivals.push(value.arrival);
      trendDepartures.push(value.departure);
      trendLoadFactors.push(getAverageLoadFactor(value));
    });
  } else if (range === "yearly") {
    for (let month = 0; month < 12; month++) {
      const value =
        groupedData[String(month)] || {
          arrival: 0,
          departure: 0,
          loadFactorTotal: 0,
          loadFactorCount: 0,
        };

      trendLabels.push(
        new Date(2000, month, 1).toLocaleDateString("id-ID", {
          month: "long",
        })
      );
      trendArrivals.push(value.arrival);
      trendDepartures.push(value.departure);
      trendLoadFactors.push(getAverageLoadFactor(value));
    }
  }

  const totalFlights = data.length;

  const avgLoadFactor =
    totalFlights > 0
      ? Number(((totalPassengers / (totalFlights * DEFAULT_SEAT_CAPACITY)) * 100).toFixed(1))
      : 0;


  const logs = data.map((row) => ({
    id: row.id,
    date: row.date,
    airline: row.airline,
    flight_type: row.flight_type,
    city: row.city,
    passenger_count: getPassengerCount(row),
    load_factor: getLoadFactor(row),
  }));

  return {
    kpiCards: {
      totalPassengers,
      arrivalCount: totalArrival,
      departureCount: totalDeparture,
      arrivalPct,
      departurePct,
      avgLoadFactor,
    },

    trendChart: {
      labels: trendLabels,
      arrivals: trendArrivals,
      departures: trendDepartures,
      loadFactors: trendLoadFactors,
    },

    donutChart: {
      arrival: totalArrival,
      departure: totalDeparture,
    },

    logs,

    meta: { range, startDate: start, endDate: end },
  };
}
