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

export function warnIfCacheFailed(
  result?:
    | CacheInvalidationResult
    | { cacheInvalidation?: CacheInvalidationResult | null }
    | null
): void {
  if (!result) return;
  const inv =
    "cacheInvalidation" in result ? result.cacheInvalidation : result;
  if (inv && inv.success === false) {
    toast.warning(publicCacheFailureMessage(inv));
  }
}
