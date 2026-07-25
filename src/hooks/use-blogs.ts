"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBlog,
  deleteBlog,
  duplicateBlog,
  fetchBlog,
  fetchBlogCategories,
  fetchBlogs,
  fetchBlogStats,
  fetchBlogTags,
  restoreBlog,
  updateBlog,
} from "@/lib/api/blogs";
import type { BlogListParams } from "@/types/blog";

export function useBlogStats() {
  return useQuery({
    queryKey: ["blogs", "stats"],
    queryFn: fetchBlogStats,
  });
}

export function useBlogs(params: BlogListParams) {
  return useQuery({
    queryKey: ["blogs", "list", params],
    queryFn: () => fetchBlogs(params),
  });
}

export function useBlog(id: string) {
  return useQuery({
    queryKey: ["blogs", id],
    queryFn: () => fetchBlog(id),
    enabled: !!id,
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ["blogs", "categories"],
    queryFn: fetchBlogCategories,
  });
}

export function useBlogTags() {
  return useQuery({
    queryKey: ["blogs", "tags"],
    queryFn: fetchBlogTags,
  });
}

export function useBlogMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["blogs"] });
  };

  const create = useMutation({
    mutationFn: createBlog,
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      updateBlog(id, payload),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: deleteBlog,
    onSuccess: invalidate,
  });

  const duplicate = useMutation({
    mutationFn: duplicateBlog,
    onSuccess: invalidate,
  });

  const restore = useMutation({
    mutationFn: restoreBlog,
    onSuccess: invalidate,
  });

  return { create, update, remove, duplicate, restore };
}
