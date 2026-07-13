import { ApiClient } from "@/lib/api-client";

// ─── Types ──────────────────────────────────────────────────────

export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  author: string;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type CreateNewsPayload = FormData;

export type UpdateNewsPayload = { id: number; data: FormData };

// ─── Service ─────────────────────────────────────────────────────

export const NewsClientService = {
  getNews: (page = 1, limit = 50) =>
    ApiClient.get<{ success: boolean; data: NewsArticle[]; pagination: Pagination }>(
      `/news?page=${page}&limit=${limit}`
    ),

  getNewsBySlug: (slug: string) =>
    ApiClient.get<{ success: boolean; data: NewsArticle }>(`/news/${slug}`),

  createNews: (payload: CreateNewsPayload) =>
    ApiClient.post<{ success: boolean; data: NewsArticle }>("/admin/news", payload),

  updateNews: (payload: UpdateNewsPayload) => {
    payload.data.append("id", payload.id.toString());
    return ApiClient.put<{ success: boolean; data: NewsArticle }>("/admin/news", payload.data);
  },

  deleteNews: (id: number) =>
    ApiClient.delete<{ success: boolean; data: NewsArticle }>("/admin/news", { id }),
};
