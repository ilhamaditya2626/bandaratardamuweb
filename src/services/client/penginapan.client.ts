import { ApiClient } from "@/lib/api-client";

export interface Penginapan {
  id: number;
  category: string;
  name: string;
  description: string | null;
  photos: string[];
  facilities: string[];
  price: number;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

type PenginapanListResponse = {
  success: boolean;
  data: Penginapan[];
  meta: { count: number };
};

type PenginapanItemResponse = {
  success: boolean;
  data: Penginapan;
};

export const PenginapanClientService = {
  getPublic: () => ApiClient.get<PenginapanListResponse>("/penginapan"),

  getAll: () => ApiClient.get<PenginapanListResponse>("/admin/penginapan"),

  create: (payload: FormData) =>
    ApiClient.post<PenginapanItemResponse>("/admin/penginapan", payload),

  update: (payload: FormData) =>
    ApiClient.put<PenginapanItemResponse>("/admin/penginapan", payload),

  remove: (id: number) =>
    ApiClient.delete<PenginapanItemResponse>("/admin/penginapan", { id }),
};
