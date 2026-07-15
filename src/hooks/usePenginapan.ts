import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PenginapanClientService } from "@/services/client/penginapan.client";

export function usePublicPenginapan() {
  return useQuery({
    queryKey: ["public-penginapan"],
    queryFn: () => PenginapanClientService.getPublic(),
  });
}

export function useGetPenginapan() {
  return useQuery({
    queryKey: ["admin-penginapan"],
    queryFn: () => PenginapanClientService.getAll(),
  });
}

type MutationOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

function useInvalidate() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["admin-penginapan"] });
    queryClient.invalidateQueries({ queryKey: ["public-penginapan"] });
  };
}

export function useCreatePenginapan(options?: MutationOptions) {
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: (payload: FormData) => PenginapanClientService.create(payload),
    onSuccess: () => {
      invalidate();
      options?.onSuccess?.();
    },
    onError: (error: Error) => options?.onError?.(error),
  });
}

export function useUpdatePenginapan(options?: MutationOptions) {
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: (payload: FormData) => PenginapanClientService.update(payload),
    onSuccess: () => {
      invalidate();
      options?.onSuccess?.();
    },
    onError: (error: Error) => options?.onError?.(error),
  });
}

export function useDeletePenginapan(options?: MutationOptions) {
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: (id: number) => PenginapanClientService.remove(id),
    onSuccess: () => {
      invalidate();
      options?.onSuccess?.();
    },
    onError: (error: Error) => options?.onError?.(error),
  });
}
