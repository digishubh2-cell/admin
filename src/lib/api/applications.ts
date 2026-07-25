import { apiClient } from "./client";
import type {
  Application,
  ApplicationListParams,
  ApplicationStats,
  PaginatedApplications,
} from "@/types/application";

interface ApiResponse {
  success: boolean;
  message?: string;
  application?: Application;
  items?: Application[];
  stats?: ApplicationStats;
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

export async function deleteApplication(id: string) {
  const { data } = await apiClient.delete<ApiResponse>(`/applications/${id}`);
  return data;
}
