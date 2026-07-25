"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bulkTestimonialAction,
  createTestimonial,
  deleteTestimonial,
  duplicateTestimonial,
  fetchTestimonial,
  fetchTestimonialMeta,
  fetchTestimonials,
  fetchTestimonialStats,
  restoreTestimonial,
  updateTestimonial,
} from "@/lib/api/testimonials";
import type { TestimonialListParams } from "@/types/testimonial";

export function useTestimonialStats() {
  return useQuery({
    queryKey: ["testimonials", "stats"],
    queryFn: fetchTestimonialStats,
  });
}

export function useTestimonialMeta() {
  return useQuery({
    queryKey: ["testimonials", "meta"],
    queryFn: fetchTestimonialMeta,
    staleTime: 1000 * 60 * 60,
  });
}

export function useTestimonials(params: TestimonialListParams) {
  return useQuery({
    queryKey: ["testimonials", "list", params],
    queryFn: () => fetchTestimonials(params),
  });
}

export function useTestimonial(id: string) {
  return useQuery({
    queryKey: ["testimonials", id],
    queryFn: () => fetchTestimonial(id),
    enabled: !!id,
  });
}

export function useTestimonialMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["testimonials"] });

  return {
    create: useMutation({ mutationFn: createTestimonial, onSuccess: invalidate }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
        updateTestimonial(id, payload),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: deleteTestimonial, onSuccess: invalidate }),
    duplicate: useMutation({ mutationFn: duplicateTestimonial, onSuccess: invalidate }),
    restore: useMutation({ mutationFn: restoreTestimonial, onSuccess: invalidate }),
    bulk: useMutation({ mutationFn: bulkTestimonialAction, onSuccess: invalidate }),
  };
}
