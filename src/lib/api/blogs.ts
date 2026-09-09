import { apiClient } from "./client";
import type {
  BlogCategory,
  BlogListParams,
  BlogPost,
  BlogStats,
  BlogTag,
  PaginatedBlogs,
} from "@/types/blog";

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  blog?: BlogPost;
  items?: BlogPost[];
  stats?: BlogStats;
  categories?: BlogCategory[];
  tags?: BlogTag[];
  pagination?: PaginatedBlogs["pagination"];
  errors?: Record<string, string[]>;
  cacheInvalidation?: { success: boolean; error?: string };
}

export async function fetchBlogStats() {
  const { data } = await apiClient.get<ApiResponse>("/blogs/stats");
  return data.stats!;
}

export async function fetchBlogs(params: BlogListParams = {}) {
  const { data } = await apiClient.get<ApiResponse & PaginatedBlogs>("/blogs", {
    params,
  });
  return {
    items: data.items || [],
    pagination: data.pagination!,
  };
}

export async function fetchBlog(id: string) {
  const { data } = await apiClient.get<ApiResponse>(`/blogs/${id}`);
  return data.blog!;
}

export async function createBlog(payload: Record<string, unknown>) {
  const { data } = await apiClient.post<ApiResponse>("/blogs", payload);
  return { ...data.blog!, cacheInvalidation: data.cacheInvalidation };
}

export async function updateBlog(id: string, payload: Record<string, unknown>) {
  const { data } = await apiClient.patch<ApiResponse>(`/blogs/${id}`, payload);
  return { ...data.blog!, cacheInvalidation: data.cacheInvalidation };
}

export async function deleteBlog(id: string) {
  const { data } = await apiClient.delete<ApiResponse>(`/blogs/${id}`);
  return data;
}

export async function duplicateBlog(id: string) {
  const { data } = await apiClient.post<ApiResponse>(`/blogs/${id}/duplicate`);
  return { ...data.blog!, cacheInvalidation: data.cacheInvalidation };
}

export async function restoreBlog(id: string) {
  const { data } = await apiClient.post<ApiResponse>(`/blogs/${id}/restore`);
  return data;
}

export async function fetchBlogCategories() {
  const { data } = await apiClient.get<ApiResponse>("/blogs/categories");
  return data.categories || [];
}

export async function fetchBlogTags() {
  const { data } = await apiClient.get<ApiResponse>("/blogs/tags");
  return data.tags || [];
}
