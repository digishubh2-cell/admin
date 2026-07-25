/**
 * Must be same-origin `/api/backend` in production (admin.shubhdigi.in).
 * Absolute API URLs put Set-Cookie on the API host — middleware never sees them.
 * Absolute `…/api/backend` also 404s on Express (auth is mounted at `/api/auth`).
 */
function resolvePublicApiUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_API_URL || "/api/backend").trim();
  if (/^https?:\/\//i.test(raw)) {
    try {
      const pathname = new URL(raw).pathname.replace(/\/+$/, "") || "/";
      if (pathname === "/api/backend" || pathname === "/api") {
        return "/api/backend";
      }
    } catch {
      return "/api/backend";
    }
  }
  return raw.replace(/\/+$/, "") || "/api/backend";
}

export const API_BASE_URL = resolvePublicApiUrl();

/** Cookie names must match Backend/config/cookies.js */
export const AUTH_COOKIE = {
  access: "sd_access_token",
  refresh: "sd_refresh_token",
} as const;
