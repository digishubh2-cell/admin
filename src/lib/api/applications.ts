import { apiClient } from "./client";
import type {
  Application,
  ApplicationEmailLogEntry,
  ApplicationListParams,
  ApplicationStats,
  CompletePayload,
  HirePayload,
  InterviewPayload,
  OfferPayload,
  PaginatedApplications,
  RejectPayload,
} from "@/types/application";

interface ApiResponse {
  success: boolean;
  message?: string;
  application?: Application;
  items?: Application[];
  stats?: ApplicationStats;
  emails?: ApplicationEmailLogEntry[];
  html?: string;
  kind?: string;
  emailWarning?: string | null;
  pagination?: PaginatedApplications["pagination"];
}

export async function fetchApplicationStats() {
  const { data } = await apiClient.get<ApiResponse>("/applications/stats");
  return data.stats!;
}

export async function fetchApplications(params: ApplicationListParams = {}) {
  const { data } = await apiClient.get<ApiResponse & PaginatedApplications>(
    "/applications",
    { params }
  );
  return { items: data.items || [], pagination: data.pagination! };
}

export async function fetchApplication(id: string) {
  const { data } = await apiClient.get<ApiResponse>(`/applications/${id}`);
  return data.application!;
}

export async function updateApplication(
  id: string,
  payload: { status?: string; notes?: string | null }
) {
  const { data } = await apiClient.patch<ApiResponse>(`/applications/${id}`, payload);
  return data.application!;
}

export async function advanceApplication(
  id: string,
  payload: { toStatus: string; sendEmail?: boolean; notes?: string | null }
) {
  const { data } = await apiClient.patch<ApiResponse>(
    `/applications/${id}/advance`,
    payload
  );
  return { application: data.application!, emailWarning: data.emailWarning || null };
}

export async function scheduleInterview(id: string, payload: InterviewPayload) {
  const { data } = await apiClient.post<ApiResponse>(
    `/applications/${id}/interview`,
    payload
  );
  return { application: data.application!, emailWarning: data.emailWarning || null };
}

export async function sendOffer(id: string, payload: OfferPayload) {
  const { data } = await apiClient.post<ApiResponse>(
    `/applications/${id}/offer`,
    payload
  );
  return { application: data.application!, emailWarning: data.emailWarning || null };
}

export async function markHired(id: string, payload: HirePayload = {}) {
  const { data } = await apiClient.post<ApiResponse>(
    `/applications/${id}/hire`,
    payload
  );
  return { application: data.application!, emailWarning: data.emailWarning || null };
}

export async function completeInternship(id: string, payload: CompletePayload = {}) {
  const { data } = await apiClient.post<ApiResponse>(
    `/applications/${id}/complete`,
    payload
  );
  return { application: data.application!, emailWarning: data.emailWarning || null };
}

export async function rejectApplication(id: string, payload: RejectPayload = {}) {
  const { data } = await apiClient.post<ApiResponse>(
    `/applications/${id}/reject`,
    payload
  );
  return { application: data.application!, emailWarning: data.emailWarning || null };
}

export async function sendCandidateMessage(
  id: string,
  payload: { message: string; sendEmail?: boolean }
) {
  const { data } = await apiClient.post<ApiResponse>(
    `/applications/${id}/message`,
    payload
  );
  return { application: data.application!, emailWarning: data.emailWarning || null };
}

export async function fetchApplicationEmails(id: string) {
  const { data } = await apiClient.get<ApiResponse>(`/applications/${id}/emails`);
  return data.emails || [];
}

export async function resendApplicationEmail(id: string, type: string) {
  const { data } = await apiClient.post<ApiResponse>(
    `/applications/${id}/emails/resend`,
    { type }
  );
  return data.application!;
}

export async function previewDocument(
  id: string,
  kind: "offer" | "certificate",
  params: Record<string, string | number | null | undefined> = {}
) {
  const { data } = await apiClient.get<ApiResponse>(
    `/applications/${id}/documents/${kind}/preview`,
    { params }
  );
  return { html: data.html || "", kind: data.kind || kind };
}

export async function deleteApplication(id: string) {
  const { data } = await apiClient.delete<ApiResponse>(`/applications/${id}`);
  return data;
}
