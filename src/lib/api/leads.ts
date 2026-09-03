import { apiClient } from "./client";
import type {
  Lead,
  LeadListParams,
  LeadNotificationSettings,
  LeadStats,
  PaginatedLeads,
} from "@/types/lead";

interface ApiResponse {
  success: boolean;
  message?: string;
  lead?: Lead;
  items?: Lead[];
  stats?: LeadStats;
  settings?: LeadNotificationSettings;
  pagination?: PaginatedLeads["pagination"];
}

export async function fetchLeadStats() {
  const { data } = await apiClient.get<ApiResponse>("/leads/stats");
  return data.stats!;
}

export async function fetchLeads(params: LeadListParams = {}) {
  const { data } = await apiClient.get<ApiResponse & PaginatedLeads>("/leads", {
    params,
  });
  return { items: data.items || [], pagination: data.pagination! };
}

export async function fetchLead(id: string) {
  const { data } = await apiClient.get<ApiResponse>(`/leads/${id}`);
  return data.lead!;
}

export async function updateLead(
  id: string,
  payload: { status?: string; notes?: string | null; type?: string }
) {
  const { data } = await apiClient.patch<ApiResponse>(`/leads/${id}`, payload);
  return data.lead!;
}

export async function deleteLead(id: string) {
  const { data } = await apiClient.delete<ApiResponse>(`/leads/${id}`);
  return data;
}

export async function fetchLeadNotificationSettings() {
  const { data } = await apiClient.get<ApiResponse>("/leads/settings");
  return data.settings!;
}

export async function updateLeadNotificationSettings(notificationEmails: string[]) {
  const { data } = await apiClient.put<ApiResponse>("/leads/settings", {
    notificationEmails,
  });
  return data.settings!;
}
