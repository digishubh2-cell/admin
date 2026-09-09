import { apiClient } from "./client";
import type {
  Testimonial,
  TestimonialListParams,
  TestimonialMeta,
  TestimonialStats,
  PaginatedTestimonials,
} from "@/types/testimonial";

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  testimonial?: Testimonial;
  items?: Testimonial[];
  stats?: TestimonialStats;
  types?: string[];
  languages?: string[];
  pagination?: PaginatedTestimonials["pagination"];
  count?: number;
  cacheInvalidation?: { success: boolean; error?: string };
}

export async function fetchTestimonialStats() {
  const { data } = await apiClient.get<ApiResponse>("/testimonials/stats");
  return data.stats!;
}

export async function fetchTestimonialMeta() {
  const { data } = await apiClient.get<ApiResponse>("/testimonials/meta/types");
  return { types: data.types || [], languages: data.languages || [] } as TestimonialMeta;
}

export async function fetchTestimonials(params: TestimonialListParams = {}) {
  const { data } = await apiClient.get<ApiResponse & PaginatedTestimonials>("/testimonials", { params });
  return { items: data.items || [], pagination: data.pagination! };
}

export async function fetchTestimonial(id: string) {
  const { data } = await apiClient.get<ApiResponse>(`/testimonials/${id}`);
  return data.testimonial!;
}

export async function createTestimonial(payload: Record<string, unknown>) {
  const { data } = await apiClient.post<ApiResponse>("/testimonials", payload);
  return { ...data.testimonial!, cacheInvalidation: data.cacheInvalidation };
}

export async function updateTestimonial(id: string, payload: Record<string, unknown>) {
  const { data } = await apiClient.patch<ApiResponse>(`/testimonials/${id}`, payload);
  return { ...data.testimonial!, cacheInvalidation: data.cacheInvalidation };
}

export async function deleteTestimonial(id: string) {
  const { data } = await apiClient.delete<ApiResponse>(`/testimonials/${id}`);
  return data;
}

export async function duplicateTestimonial(id: string) {
  const { data } = await apiClient.post<ApiResponse>(`/testimonials/${id}/duplicate`);
  return { ...data.testimonial!, cacheInvalidation: data.cacheInvalidation };
}

export async function restoreTestimonial(id: string) {
  const { data } = await apiClient.post<ApiResponse>(`/testimonials/${id}/restore`);
  return data;
}

export async function bulkTestimonialAction(payload: {
  ids: string[];
  action: "publish" | "draft" | "archive" | "update";
  status?: string;
  reviewType?: string;
  featured?: boolean;
}) {
  const { data } = await apiClient.post<ApiResponse>("/testimonials/bulk", payload);
  return data;
}
