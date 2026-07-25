"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCaseStudy,
  deleteCaseStudy,
  duplicateCaseStudy,
  fetchCaseStudies,
  fetchCaseStudy,
  fetchCaseStudyStats,
  restoreCaseStudy,
  updateCaseStudy,
} from "@/lib/api/case-studies";
import type { CaseStudyListParams } from "@/types/case-study";

export function useCaseStudyStats() {
  return useQuery({
    queryKey: ["case-studies", "stats"],
    queryFn: fetchCaseStudyStats,
  });
}

export function useCaseStudies(params: CaseStudyListParams) {
  return useQuery({
    queryKey: ["case-studies", "list", params],
    queryFn: () => fetchCaseStudies(params),
  });
}

export function useCaseStudy(id: string) {
  return useQuery({
    queryKey: ["case-studies", id],
    queryFn: () => fetchCaseStudy(id),
    enabled: !!id,
  });
}

export function useCaseStudyMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["case-studies"] });

  return {
    create: useMutation({ mutationFn: createCaseStudy, onSuccess: invalidate }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
        updateCaseStudy(id, payload),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: deleteCaseStudy, onSuccess: invalidate }),
    duplicate: useMutation({ mutationFn: duplicateCaseStudy, onSuccess: invalidate }),
    restore: useMutation({ mutationFn: restoreCaseStudy, onSuccess: invalidate }),
  };
}
