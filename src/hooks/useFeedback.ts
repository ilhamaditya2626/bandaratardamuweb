import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FeedbackClientService } from "@/services/client/feedback.client";

export function useGetFeedback(page = 1, limit = 50) {
  return useQuery({
    queryKey: ["admin-feedback", page, limit],
    queryFn: () => FeedbackClientService.getFeedback(page, limit),
  });
}

export function useDeleteFeedback(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => FeedbackClientService.deleteFeedback(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-feedback"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}
