"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resumeStudioAdminApi as api, type ListParams } from "@/lib/api/resume-studio";

const KEY = "resume-studio";

export const useRsDashboard = (days: number) => useQuery({ queryKey: [KEY, "dashboard", days], queryFn: () => api.dashboard(days) });
export const useRsTemplates = () => useQuery({ queryKey: [KEY, "templates"], queryFn: api.templates });
export const useRsPricing = () => useQuery({ queryKey: [KEY, "pricing"], queryFn: api.pricing });
export const useRsOrders = (params: ListParams) => useQuery({ queryKey: [KEY, "orders", params], queryFn: () => api.orders(params) });
export const useRsOrder = (id: string) => useQuery({ queryKey: [KEY, "order", id], queryFn: () => api.order(id), enabled: Boolean(id) });
export const useRsAiUsage = (days: number) => useQuery({ queryKey: [KEY, "ai", days], queryFn: () => api.aiUsage(days) });
export const useRsCompileJobs = (params: ListParams) => useQuery({ queryKey: [KEY, "jobs", params], queryFn: () => api.compileJobs(params) });
export const useRsAccounts = (params: ListParams) => useQuery({ queryKey: [KEY, "accounts", params], queryFn: () => api.accounts(params) });
export const useRsFeedback = (params: ListParams) => useQuery({ queryKey: [KEY, "feedback", params], queryFn: () => api.feedback(params) });
export const useRsAudit = (params: ListParams) => useQuery({ queryKey: [KEY, "audit", params], queryFn: () => api.auditLogs(params) });

/** Wraps a mutation and invalidates all Resume Studio queries on success. */
export function useRsMutation<TArgs, TResult>(fn: (args: TArgs) => Promise<TResult>) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => client.invalidateQueries({ queryKey: [KEY] }),
  });
}
