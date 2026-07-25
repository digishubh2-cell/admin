"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteLead,
  fetchLead,
  fetchLeads,
  fetchLeadStats,
  updateLead,
} from "@/lib/api/leads";
import type { LeadListParams } from "@/types/lead";

export function useLeadStats() {
  return useQuery({
    queryKey: ["leads", "stats"],
    queryFn: fetchLeadStats,
  });
}

export function useLeads(params: LeadListParams) {
  return useQuery({
    queryKey: ["leads", "list", params],
    queryFn: () => fetchLeads(params),
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ["leads", id],
    queryFn: () => fetchLead(id),
    enabled: !!id,
  });
}

export function useLeadMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["leads"] });

  return {
    update: useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: { status?: string; notes?: string | null; type?: string };
      }) => updateLead(id, payload),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: deleteLead,
      onSuccess: invalidate,
    }),
  };
}
