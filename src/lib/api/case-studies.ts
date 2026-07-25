import { apiClient } from "./client";
import type {
  CaseStudy,
  CaseStudyListParams,
  CaseStudyStats,
  PaginatedCaseStudies,
} from "@/types/case-study";

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  caseStudy?: CaseStudy;
  items?: CaseStudy[];
  stats?: CaseStudyStats;
  pagination?: PaginatedCaseStudies["pagination"];
}

export async function fetchCaseStudyStats() {
  const { data } = await apiClient.get<ApiResponse>("/case-studies/stats");
  return data.stats!;
}

export async function fetchCaseStudies(params: CaseStudyListParams = {}) {
  const { data } = await apiClient.get<ApiResponse & PaginatedCaseStudies>("/case-studies", {
    params,
  });
  return { items: data.items || [], pagination: data.pagination! };
}

export async function fetchCaseStudy(id: string) {
  const { data } = await apiClient.get<ApiResponse>(`/case-studies/${id}`);
  return data.caseStudy!;
}

export async function createCaseStudy(payload: Record<string, unknown>) {
  const { data } = await apiClient.post<ApiResponse>("/case-studies", payload);
  return data.caseStudy!;
}

export async function updateCaseStudy(id: string, payload: Record<string, unknown>) {
  const { data } = await apiClient.patch<ApiResponse>(`/case-studies/${id}`, payload);
  return data.caseStudy!;
}

export async function deleteCaseStudy(id: string) {
  const { data } = await apiClient.delete<ApiResponse>(`/case-studies/${id}`);
  return data;
}

export async function duplicateCaseStudy(id: string) {
  const { data } = await apiClient.post<ApiResponse>(`/case-studies/${id}/duplicate`);
  return data.caseStudy!;
}

export async function restoreCaseStudy(id: string) {
  const { data } = await apiClient.post<ApiResponse>(`/case-studies/${id}/restore`);
  return data;
}
