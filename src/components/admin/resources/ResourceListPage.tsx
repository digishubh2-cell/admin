"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useResources, useResourceMutations, useResourceStats } from "@/hooks/use-resources";
import type { ResourceListParams } from "@/types/resource";
import { ResourceFilters } from "./ResourceFilters";
import { ResourceStatsCards } from "./ResourceStatsCards";
import { ResourceTable } from "./ResourceTable";
import { Button } from "@/components/ui/button";

export function ResourceListPage() {
  const [params, setParams] = useState<ResourceListParams>({
    page: 1,
    limit: 20,
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const { data: stats, isLoading: statsLoading } = useResourceStats();
  const { data, isLoading } = useResources(params);
  const { duplicate, remove } = useResourceMutations();

  async function handleDuplicate(id: string) {
    try {
      const r = await duplicate.mutateAsync(id);
      toast.success(`Duplicated: ${r.title}`);
    } catch {
      toast.error("Failed to duplicate resource");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Archive this resource?")) return;
    try {
      await remove.mutateAsync(id);
      toast.success("Resource archived");
    } catch {
      toast.error("Failed to archive resource");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Resource Center</h1>
          <p className="mt-1 text-admin-text-secondary">
            Enterprise Knowledge Hub — guides, documentation, templates, whitepapers, and authority content.
          </p>
        </div>
        <Button asChild>
          <Link href="/resources/new">
            <Plus className="h-4 w-4" />
            Create Resource
          </Link>
        </Button>
      </div>

      <ResourceStatsCards stats={stats} isLoading={statsLoading} />
      <ResourceFilters params={params} onChange={setParams} />
      <ResourceTable
        resources={data?.items || []}
        isLoading={isLoading}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-admin-border bg-admin-surface px-4 py-3">
          <p className="text-sm text-admin-text-muted">
            Page {data.pagination.page} of {data.pagination.totalPages} · {data.pagination.total} resources
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={params.page === 1}
              onClick={() => setParams((p) => ({ ...p, page: (p.page || 1) - 1 }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={data.pagination.page >= data.pagination.totalPages}
              onClick={() => setParams((p) => ({ ...p, page: (p.page || 1) + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
