"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bulkResourceAction,
  createResource,
  deleteResource,
  duplicateResource,
  fetchResource,
  fetchResourceMeta,
  fetchResources,
  fetchResourceStats,
  restoreResource,
  updateResource,
} from "@/lib/api/resources";
import type { ResourceListParams } from "@/types/resource";

export function useResourceStats() {
  return useQuery({
    queryKey: ["resources", "stats"],
    queryFn: fetchResourceStats,
  });
}

export function useResourceMeta() {
  return useQuery({
    queryKey: ["resources", "meta"],
    queryFn: fetchResourceMeta,
    staleTime: 1000 * 60 * 60,
  });
}

export function useResources(params: ResourceListParams) {
  return useQuery({
    queryKey: ["resources", "list", params],
    queryFn: () => fetchResources(params),
  });
}

export function useResource(id: string) {
  return useQuery({
    queryKey: ["resources", id],
    queryFn: () => fetchResource(id),
    enabled: !!id,
  });
}

export function useResourceMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["resources"] });

  return {
    create: useMutation({ mutationFn: createResource, onSuccess: invalidate }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
        updateResource(id, payload),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: deleteResource, onSuccess: invalidate }),
    duplicate: useMutation({ mutationFn: duplicateResource, onSuccess: invalidate }),
    restore: useMutation({ mutationFn: restoreResource, onSuccess: invalidate }),
    bulk: useMutation({ mutationFn: bulkResourceAction, onSuccess: invalidate }),
  };
}
