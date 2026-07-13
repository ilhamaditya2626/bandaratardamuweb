import { ApiClient } from "@/lib/api-client";

export type TicketFlightType = "reguler" | "perintis";

export interface TicketPrice {
  id: number;
  route_key: string;
  origin: string;
  destination: string;
  flight_type: TicketFlightType;
  operating_days: string[];
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TicketPricePayload {
  origin: string;
  destination: string;
  flight_type: TicketFlightType;
  operating_days: string[];
  price: number;
  is_active?: boolean;
}

export type UpdateTicketPricePayload = { id: number } & Partial<TicketPricePayload>;

type TicketPriceResponse = {
  success: boolean;
  data: TicketPrice[];
  meta: { count: number };
};

export const TicketPricesClientService = {
  getPublicPrices: () => ApiClient.get<TicketPriceResponse>("/ticket-prices"),

  getAdminPrices: () => ApiClient.get<TicketPriceResponse>("/admin/ticket-prices"),

  createPrice: (payload: TicketPricePayload) =>
    ApiClient.post<{ success: boolean; data: TicketPrice }>(
      "/admin/ticket-prices",
      payload
    ),

  updatePrice: (payload: UpdateTicketPricePayload) =>
    ApiClient.put<{ success: boolean; data: TicketPrice }>(
      "/admin/ticket-prices",
      payload
    ),

  deletePrice: (id: number) =>
    ApiClient.delete<{ success: boolean; data: TicketPrice }>(
      "/admin/ticket-prices",
      { id }
    ),
};
