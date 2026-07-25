import { apiClient } from "./client";
import type {
  Resource,
  ResourceListParams,
  ResourceMeta,
  ResourceStats,
  PaginatedResources,
} from "@/types/resource";

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  resource?: Resource;
  items?: Resource[];
  stats?: ResourceStats;
  types?: string[];
  categories?: string[];
  pagination?: PaginatedResources["pagination"];
  count?: number;
}

export async function fetchResourceStats() {
  const { data } = await apiClient.get<ApiResponse>("/resources/stats");
  return data.stats!;
}

export async function fetchResourceMeta() {
  const { data } = await apiClient.get<ApiResponse>("/resources/meta/types");
  return { types: data.types || [], categories: data.categories || [] } as ResourceMeta;
}

export async function fetchResources(params: ResourceListParams = {}) {
  const { data } = await apiClient.get<ApiResponse & PaginatedResources>("/resources", { params });
  return { items: data.items || [], pagination: data.pagination! };
}

export async function fetchResource(id: string) {
  const { data } = await apiClient.get<ApiResponse>(`/resources/${id}`);
  return data.resource!;
}

export async function createResource(payload: Record<string, unknown>) {
  const { data } = await apiClient.post<ApiResponse>("/resources", payload);
  return data.resource!;
}

export async function updateResource(id: string, payload: Record<string, unknown>) {
  const { data } = await apiClient.patch<ApiResponse>(`/resources/${id}`, payload);
  return data.resource!;
}

export async function deleteResource(id: string) {
  const { data } = await apiClient.delete<ApiResponse>(`/resources/${id}`);
  return data;
}

export async function duplicateResource(id: string) {
  const { data } = await apiClient.post<ApiResponse>(`/resources/${id}/duplicate`);
  return data.resource!;
}

export async function restoreResource(id: string) {
  const { data } = await apiClient.post<ApiResponse>(`/resources/${id}/restore`);
  return data;
}

export async function bulkResourceAction(payload: {
  ids: string[];
  action: "publish" | "draft" | "archive" | "update";
  status?: string;
  category?: string;
  type?: string;
}) {
  const { data } = await apiClient.post<ApiResponse>("/resources/bulk", payload);
  return data;
}
