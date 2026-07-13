import { ApiClient } from "@/lib/api-client";

// ─── Types ──────────────────────────────────────────────────────

export interface Flight {
  id: number;
  flight_no: string;
  airline: string;
  airline_key: string | null;
  origin: string | null;
  destination: string | null;
  type: "arrival" | "departure";
  flight_type: "reguler" | "extra_flight" | "charter_flight" | "perintis" | null;
  scheduled_time: string;
  estimated_time: string | null;
  status: string;
  status_label: string | null;
  notes: string | null;
  flight_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFlightPayload {
  flight_no: string;
  airline: string;
  airline_key?: string;
  origin?: string;
  destination?: string;
  type: "arrival" | "departure";
  flight_type?: "reguler" | "extra_flight" | "charter_flight" | "perintis";
  scheduled_time: string;
  estimated_time?: string;
  status?: string;
  status_label?: string;
  notes?: string | null;
  flight_date: string;
}

export type UpdateFlightPayload = { id: number } & Partial<CreateFlightPayload>;

// ─── Service ─────────────────────────────────────────────────────

export const FlightsClientService = {
  getFlights: (date: string, type?: "arrival" | "departure") => {
    const params = new URLSearchParams({ date });
    if (type) params.set("type", type);
    return ApiClient.get<{ success: boolean; data: Flight[]; meta: { date: string; type: string; count: number } }>(
      `/flights?${params}`
    );
  },

  createFlight: (payload: CreateFlightPayload) =>
    ApiClient.post<{ success: boolean; data: Flight }>("/admin/flights", payload),

  updateFlight: (payload: UpdateFlightPayload) =>
    ApiClient.put<{ success: boolean; data: Flight }>("/admin/flights", payload),

  deleteFlight: (id: number) =>
    ApiClient.delete<{ success: boolean; data: Flight }>("/admin/flights", { id }),
};
