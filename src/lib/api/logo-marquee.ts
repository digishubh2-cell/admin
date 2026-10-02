import { apiClient } from "./client";
import type { LogoAsset, LogoDraft, LogoList, LogoSettings, Candidate } from "@/types/logo-marquee";
import type { CacheInvalidationResult } from "@/lib/cache/afterMutation";
type Result = { success: boolean; message?: string; cacheInvalidation?: CacheInvalidationResult };
const base = "/logo-marquee/admin";
export async function fetchLogos(params: Record<string, string | number>) {
  return (await apiClient.get<LogoList>(base, { params })).data;
}
export async function fetchLogoSettings() { return (await apiClient.get<{ settings: LogoSettings }>(`${base}/settings`)).data.settings; }
export async function fetchCandidates() { return (await apiClient.get<{ items: Candidate[] }>(`${base}/discover`)).data.items; }
export async function saveLogo(draft: LogoDraft, existing?: LogoAsset) {
  if (!existing) return (await apiClient.post<Result & { logo: LogoAsset }>(base, draft)).data;
  const payload: Partial<LogoDraft> = { ...draft };
  delete payload.sourceType;
  if (payload.fileId === existing.media.fileId) delete payload.fileId;
  return (await apiClient.patch<Result & { logo: LogoAsset }>(`${base}/${existing.id}`, payload)).data;
}
export async function saveLogoSettings(settings: LogoSettings) {
  const payload = { ...settings } as Record<string, unknown>;
  delete payload.updatedAt; delete payload.updatedBy;
  return (await apiClient.patch<Result>(`${base}/settings`, payload)).data;
}
export async function logoAction(action: string, payload: unknown) {
  return (await apiClient.post<Result>(`${base}/${action}`, payload)).data;
}
export async function archiveLogo(id: string) { return (await apiClient.delete<Result>(`${base}/${id}`)).data; }
export async function reorderLogos(ids: string[]) { return (await apiClient.patch<Result>(`${base}/reorder`, { ids })).data; }
