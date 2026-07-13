import { useQuery } from "@tanstack/react-query";
import { FeedbackClientService } from "@/services/client/feedback.client";

export function useGetFeedback(page = 1, limit = 50) {
  return useQuery({
    queryKey: ["admin-feedback", page, limit],
    queryFn: () => FeedbackClientService.getFeedback(page, limit),
  });
}
