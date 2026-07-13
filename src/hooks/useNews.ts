import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NewsClientService, CreateNewsPayload, UpdateNewsPayload } from "@/services/client/news.client";

export function useGetNews(page = 1, limit = 50) {
  return useQuery({
    queryKey: ["admin-news", page, limit],
    queryFn: () => NewsClientService.getNews(page, limit),
  });
}

export function useGetNewsBySlug(slug: string) {
  return useQuery({
    queryKey: ["news-detail", slug],
    queryFn: () => NewsClientService.getNewsBySlug(slug),
    enabled: !!slug,
    staleTime: 120_000,
  });
}

export function useCreateNews(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateNewsPayload) =>
      NewsClientService.createNews(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      queryClient.invalidateQueries({ queryKey: ["news"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}

export function useUpdateNews(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateNewsPayload) =>
      NewsClientService.updateNews(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["news-detail"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}

export function useDeleteNews(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => NewsClientService.deleteNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      queryClient.invalidateQueries({ queryKey: ["news"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}
