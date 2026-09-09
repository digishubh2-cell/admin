import { apiClient } from "./client";
import type { Job, JobListParams, JobStats, PaginatedJobs } from "@/types/job";

interface ApiResponse {
  success: boolean;
  message?: string;
  job?: Job;
  items?: Job[];
  stats?: JobStats;
  pagination?: PaginatedJobs["pagination"];
  cacheInvalidation?: { success: boolean; error?: string };
}

export async function fetchJobStats() {
  const { data } = await apiClient.get<ApiResponse>("/jobs/stats");
  return data.stats!;
}

export async function fetchJobs(params: JobListParams = {}) {
  const { data } = await apiClient.get<ApiResponse & PaginatedJobs>("/jobs", {
    params,
  });
  return { items: data.items || [], pagination: data.pagination! };
}

export async function fetchJob(id: string) {
  const { data } = await apiClient.get<ApiResponse>(`/jobs/${id}`);
  return data.job!;
}

export async function createJob(payload: Record<string, unknown>) {
  const { data } = await apiClient.post<ApiResponse>("/jobs", payload);
  return { ...data.job!, cacheInvalidation: data.cacheInvalidation };
}

export async function updateJob(id: string, payload: Record<string, unknown>) {
  const { data } = await apiClient.patch<ApiResponse>(`/jobs/${id}`, payload);
  return { ...data.job!, cacheInvalidation: data.cacheInvalidation };
}

export async function deleteJob(id: string) {
  const { data } = await apiClient.delete<ApiResponse>(`/jobs/${id}`);
  return data;
}

export async function duplicateJob(id: string) {
  const { data } = await apiClient.post<ApiResponse>(`/jobs/${id}/duplicate`);
  return { ...data.job!, cacheInvalidation: data.cacheInvalidation };
}

export async function restoreJob(id: string) {
  const { data } = await apiClient.post<ApiResponse>(`/jobs/${id}/restore`);
  return data;
}
