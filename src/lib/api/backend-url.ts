/**
 * BACKEND_URL must be origin only, e.g. https://website-backend-m8si.onrender.com
 * Strip trailing slash and accidental /api or /api/backend suffixes so we never
 * upstream `/api/backend/...` (Express mounts at `/api/...`).
 */
export function normalizeBackendUrl(raw?: string): string {
  let url = (raw || "http://localhost:5001").trim().replace(/\/+$/, "");
  url = url.replace(/\/api\/backend$/i, "").replace(/\/api$/i, "");
  return url.replace(/\/+$/, "");
}

/**
 * Build upstream API URL from catch-all segments under /api/backend/*.
 * Incoming /api/backend/auth/login → path ['auth','login'] → BACKEND/api/auth/login
 */
export function buildBackendApiUrl(
  pathSegments: string[] | undefined,
  search = ""
): string {
  const segments = Array.isArray(pathSegments) ? [...pathSegments] : [];
  // Defensive: never forward the proxy prefix if it leaked into params
  while (segments[0] === "backend") segments.shift();
  const targetPath = segments.map(encodeURIComponent).join("/");
  return `${normalizeBackendUrl(process.env.BACKEND_URL)}/api/${targetPath}${search}`;
}
