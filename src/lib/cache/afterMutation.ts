import { toast } from "sonner";

export interface CacheInvalidationResult {
  success: boolean;
  skipped?: boolean;
  reason?: string;
  error?: string;
  status?: number;
}

export function publicCacheFailureMessage(
  result?: CacheInvalidationResult | null
): string {
  return "Saved to database, but public site not refreshed. New content may take up to 24 hours to appear.";
}

function isCacheResult(
  value:
    | CacheInvalidationResult
    | { cacheInvalidation?: CacheInvalidationResult | null }
): value is CacheInvalidationResult {
  return !("cacheInvalidation" in value);
}

export function warnIfCacheFailed(
  result?:
    | CacheInvalidationResult
    | { cacheInvalidation?: CacheInvalidationResult | null }
    | null
): void {
  if (!result) return;
  const inv: CacheInvalidationResult | null | undefined = isCacheResult(result)
    ? result
    : result.cacheInvalidation;
  if (inv && inv.success === false) {
    toast.warning(publicCacheFailureMessage(inv));
  }
}
