import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FlightsClientService, CreateFlightPayload, UpdateFlightPayload } from "@/services/client/flights.client";

export function useGetFlights(date: string, type?: "arrival" | "departure") {
  return useQuery({
    queryKey: ["admin-flights", date, type ?? "all"],
    queryFn: () => FlightsClientService.getFlights(date, type),
  });
}

export function useCreateFlight(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFlightPayload) =>
      FlightsClientService.createFlight(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-flights"] });
      queryClient.invalidateQueries({ queryKey: ["flights"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}

export function useUpdateFlight(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateFlightPayload) =>
      FlightsClientService.updateFlight(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-flights"] });
      queryClient.invalidateQueries({ queryKey: ["flights"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}

export function useDeleteFlight(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => FlightsClientService.deleteFlight(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-flights"] });
      queryClient.invalidateQueries({ queryKey: ["flights"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}
