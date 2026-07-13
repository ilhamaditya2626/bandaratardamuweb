import { ApiClient } from "@/lib/api-client";

export interface FeedbackSubmission {
  id: number;
  name: string;
  message: string;
  status: string;
  created_at: string;
}

export interface FeedbackPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const FeedbackClientService = {
  getFeedback: (page = 1, limit = 50) =>
    ApiClient.get<{
      success: boolean;
      data: FeedbackSubmission[];
      pagination: FeedbackPagination;
    }>(`/admin/feedback?page=${page}&limit=${limit}`),
};
