import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  TicketPricePayload,
  TicketPricesClientService,
  UpdateTicketPricePayload,
} from "@/services/client/ticket-prices.client";

export function useGetTicketPrices() {
  return useQuery({
    queryKey: ["admin-ticket-prices"],
    queryFn: () => TicketPricesClientService.getAdminPrices(),
  });
}

export function useCreateTicketPrice(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TicketPricePayload) =>
      TicketPricesClientService.createPrice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ticket-prices"] });
      queryClient.invalidateQueries({ queryKey: ["public-ticket-prices"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => options?.onError?.(error),
  });
}

export function useUpdateTicketPrice(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTicketPricePayload) =>
      TicketPricesClientService.updatePrice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ticket-prices"] });
      queryClient.invalidateQueries({ queryKey: ["public-ticket-prices"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => options?.onError?.(error),
  });
}

export function useDeleteTicketPrice(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => TicketPricesClientService.deletePrice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ticket-prices"] });
      queryClient.invalidateQueries({ queryKey: ["public-ticket-prices"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => options?.onError?.(error),
  });
}
