export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api/backend";

export const AUTH_COOKIE = {
  access: "sd_access_token",
  refresh: "sd_refresh_token",
} as const;
