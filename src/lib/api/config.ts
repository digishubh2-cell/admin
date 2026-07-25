export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api/backend";

/** Cookie names must match Backend/config/cookies.js */
export const AUTH_COOKIE = {
  access: "sd_access_token",
  refresh: "sd_refresh_token",
} as const;
