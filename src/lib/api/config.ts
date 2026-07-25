/**
 * Must be same-origin `/api/backend` in production (admin.shubhdigi.in).
 * Absolute API URLs put Set-Cookie on the API host — middleware never sees them.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api/backend";

/** Cookie names must match Backend/config/cookies.js */
export const AUTH_COOKIE = {
  access: "sd_access_token",
  refresh: "sd_refresh_token",
} as const;
