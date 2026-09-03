"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteLead,
  fetchLead,
  fetchLeadNotificationSettings,
  fetchLeads,
  fetchLeadStats,
  updateLead,
  updateLeadNotificationSettings,
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

export function useLeadNotificationSettings(enabled = true) {
  return useQuery({
    queryKey: ["leads", "settings"],
    queryFn: fetchLeadNotificationSettings,
    enabled,
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
    updateNotificationSettings: useMutation({
      mutationFn: updateLeadNotificationSettings,
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["leads", "settings"] }),
    }),
  };
}
