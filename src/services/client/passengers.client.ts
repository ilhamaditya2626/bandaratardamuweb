import { ApiClient } from "@/lib/api-client";

// ─── Types ──────────────────────────────────────────────────────

export type StatRange = "daily" | "weekly" | "monthly" | "yearly";

export interface SyncPassengersPayload {
  date: string;
  arrival_count: number;
  departure_count: number;
  category: "domestic" | "international";
}

export interface KpiCards {
  totalPassengers: number;
  arrivalCount: number;
  departureCount: number;
  arrivalPct: number;
  departurePct: number;
  avgLoadFactor: number;
}


export interface TrendChart {
  labels: string[];
  arrivals: number[];
  departures: number[];
  loadFactors: number[];
}


export interface PassengerLog {
  id: string | number;
  date: string;
  airline: string | null;
  flight_type: "arrival" | "departure" | null;
  city: string | null;
  passenger_count: number | null;
  load_factor: string | number | null;
}

export interface StatsData {
  kpiCards: KpiCards;
  trendChart: TrendChart;
  donutChart: { arrival: number; departure: number };
  logs: PassengerLog[];
  meta: { range: StatRange; startDate: string; endDate: string };
}

// ─── Service ─────────────────────────────────────────────────────

export const PassengersClientService = {
  getStats: (range: StatRange = "monthly", date?: string) => {
    const params = new URLSearchParams({ range });
    if (date) params.set("date", date);
    return ApiClient.get<{ success: boolean; data: StatsData }>(`/stats?${params}`);
  },

  syncDailyPassengers: (payload: SyncPassengersPayload) =>
    ApiClient.post<{ success: boolean; data: unknown }>("/admin/passengers", payload),
};
