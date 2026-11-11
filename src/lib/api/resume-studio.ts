import { apiClient } from "./client";
import type {
  Paginated,
  RsAccount,
  RsAiUsage,
  RsAuditLog,
  RsCompileJob,
  RsDashboard,
  RsExport,
  RsFeedback,
  RsOrder,
  RsPaymentEvent,
  RsPricing,
  RsTemplate,
} from "@/types/resume-studio";

const BASE = "/resume-studio/admin";

export type ListParams = { page?: number; limit?: number; status?: string; q?: string };

export const resumeStudioAdminApi = {
  dashboard: async (days = 30) => (await apiClient.get<{ dashboard: RsDashboard }>(`${BASE}/dashboard`, { params: { days } })).data.dashboard,

  templates: async () => (await apiClient.get<{ templates: RsTemplate[] }>(`${BASE}/templates`)).data.templates,
  updateTemplate: async (key: string, patch: Partial<Pick<RsTemplate, "name" | "description" | "tier" | "sortOrder" | "presets">>) =>
    (await apiClient.patch<{ template: RsTemplate }>(`${BASE}/templates/${key}`, patch)).data.template,
  previewTemplate: async (key: string, version: number) =>
    (await apiClient.post<{ sampleCompile: RsTemplate["versions"][number]["sampleCompile"]; pdfBase64: string | null }>(`${BASE}/templates/${key}/versions/${version}/preview`, {}, { timeout: 90000 })).data,
  approveTemplate: async (key: string, version: number) => (await apiClient.post(`${BASE}/templates/${key}/versions/${version}/approve`, {})).data,
  publishTemplate: async (key: string, version: number) => (await apiClient.post(`${BASE}/templates/${key}/versions/${version}/publish`, {})).data,
  unpublishTemplate: async (key: string) => (await apiClient.post(`${BASE}/templates/${key}/unpublish`, {})).data,

  pricing: async () => (await apiClient.get<{ pricing: RsPricing }>(`${BASE}/pricing`)).data.pricing,
  savePricing: async (pricing: RsPricing) => (await apiClient.put<{ pricing: RsPricing }>(`${BASE}/pricing`, pricing)).data.pricing,

  orders: async (params: ListParams) => (await apiClient.get<Paginated<RsOrder>>(`${BASE}/orders`, { params })).data,
  order: async (id: string) => (await apiClient.get<{ order: RsOrder; events: RsPaymentEvent[]; exports: RsExport[] }>(`${BASE}/orders/${id}`)).data,
  refund: async (id: string, body: { amountPaise?: number; reason: string }) => (await apiClient.post<{ order: RsOrder }>(`${BASE}/orders/${id}/refund`, body)).data.order,
  extend: async (id: string, body: { days: number; recompiles: number }) => (await apiClient.post(`${BASE}/orders/${id}/extend`, body)).data,
  retryExport: async (exportId: string) => (await apiClient.post(`${BASE}/exports/${exportId}/retry`, {})).data,

  aiUsage: async (days = 30) => (await apiClient.get<{ usage: RsAiUsage }>(`${BASE}/ai-usage`, { params: { days } })).data.usage,
  compileJobs: async (params: ListParams) => (await apiClient.get<Paginated<RsCompileJob>>(`${BASE}/compile-jobs`, { params })).data,

  accounts: async (params: ListParams) => (await apiClient.get<Paginated<RsAccount>>(`${BASE}/accounts`, { params })).data,
  setAccountStatus: async (id: string, status: "active" | "suspended") => (await apiClient.patch(`${BASE}/accounts/${id}`, { status })).data,
  deleteAccountData: async (id: string) => (await apiClient.post(`${BASE}/accounts/${id}/delete-data`, {})).data,

  feedback: async (params: ListParams) => (await apiClient.get<Paginated<RsFeedback>>(`${BASE}/feedback`, { params })).data,
  setFeedbackStatus: async (id: string, status: string) => (await apiClient.patch(`${BASE}/feedback/${id}`, { status })).data,

  auditLogs: async (params: ListParams) => (await apiClient.get<Paginated<RsAuditLog>>(`${BASE}/audit-logs`, { params })).data,
};

export function inr(paise: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(paise / 100);
}

export function apiErrorMessage(error: unknown): string {
  const data = (error as { response?: { data?: { error?: { message?: string }; message?: string } } })?.response?.data;
  return data?.error?.message || data?.message || (error instanceof Error ? error.message : "Request failed");
}
