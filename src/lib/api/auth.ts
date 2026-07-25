import { apiClient } from "./client";

export type UserRole =
  | "super_admin"
  | "admin"
  | "editor"
  | "author"
  | "viewer";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  user?: T;
  errors?: Record<string, string[]>;
}

export async function loginRequest(payload: LoginPayload) {
  const { data } = await apiClient.post<ApiResponse<AuthUser>>(
    "/auth/login",
    payload
  );
  return data;
}

export async function logoutRequest() {
  const { data } = await apiClient.post<ApiResponse>("/auth/logout");
  return data;
}

export async function logoutAllRequest() {
  const { data } = await apiClient.post<ApiResponse>("/auth/logout-all");
  return data;
}

export async function getMeRequest() {
  const { data } = await apiClient.get<ApiResponse<AuthUser>>("/auth/me");
  return data;
}
