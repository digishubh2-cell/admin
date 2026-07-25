"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createJob,
  deleteJob,
  duplicateJob,
  fetchJob,
  fetchJobs,
  fetchJobStats,
  restoreJob,
  updateJob,
} from "@/lib/api/jobs";
import type { JobListParams } from "@/types/job";

export function useJobStats() {
  return useQuery({
    queryKey: ["jobs", "stats"],
    queryFn: fetchJobStats,
  });
}

export function useJobs(params: JobListParams) {
  return useQuery({
    queryKey: ["jobs", "list", params],
    queryFn: () => fetchJobs(params),
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ["jobs", id],
    queryFn: () => fetchJob(id),
    enabled: !!id,
  });
}

export function useJobMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["jobs"] });

  return {
    create: useMutation({ mutationFn: createJob, onSuccess: invalidate }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
        updateJob(id, payload),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: deleteJob, onSuccess: invalidate }),
    duplicate: useMutation({ mutationFn: duplicateJob, onSuccess: invalidate }),
    restore: useMutation({ mutationFn: restoreJob, onSuccess: invalidate }),
  };
}
