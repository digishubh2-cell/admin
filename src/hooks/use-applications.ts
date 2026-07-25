"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteApplication,
  fetchApplication,
  fetchApplications,
  fetchApplicationStats,
  updateApplication,
} from "@/lib/api/applications";
import type { ApplicationListParams } from "@/types/application";

export function useApplicationStats() {
  return useQuery({
    queryKey: ["applications", "stats"],
    queryFn: fetchApplicationStats,
  });
}

export function useApplications(params: ApplicationListParams) {
  return useQuery({
    queryKey: ["applications", "list", params],
    queryFn: () => fetchApplications(params),
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: ["applications", id],
    queryFn: () => fetchApplication(id),
    enabled: !!id,
  });
}

export function useApplicationMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["applications"] });

  return {
    update: useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: { status?: string; notes?: string | null };
      }) => updateApplication(id, payload),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: deleteApplication,
      onSuccess: invalidate,
    }),
  };
}
