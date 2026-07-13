import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PassengersClientService, SyncPassengersPayload, StatRange } from "@/services/client/passengers.client";

export function useGetPassengerStats(range: StatRange = "monthly") {
  return useQuery({
    queryKey: ["admin-stats", range],
    queryFn: () => PassengersClientService.getStats(range),
  });
}

export function useSyncPassengers(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SyncPassengersPayload) =>
      PassengersClientService.syncDailyPassengers(payload),
    onSuccess: () => {
      // Invalidate all stat ranges after syncing new data
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}
