"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { warnIfCacheFailed } from "@/lib/cache/afterMutation";
import { useCaseStudies, useCaseStudyMutations, useCaseStudyStats } from "@/hooks/use-case-studies";
import type { CaseStudyListParams } from "@/types/case-study";
import { CaseStudyFilters } from "./CaseStudyFilters";
import { CaseStudyStatsCards } from "./CaseStudyStatsCards";
import { CaseStudyTable } from "./CaseStudyTable";
import { Button } from "@/components/ui/button";

export function CaseStudyListPage() {
  const [params, setParams] = useState<CaseStudyListParams>({
    page: 1,
    limit: 20,
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const { data: stats, isLoading: statsLoading } = useCaseStudyStats();
  const { data, isLoading } = useCaseStudies(params);
  const { duplicate, remove } = useCaseStudyMutations();

  async function handleDuplicate(id: string) {
    try {
      const cs = await duplicate.mutateAsync(id);
      toast.success(`Duplicated: ${cs.projectName}`);
      warnIfCacheFailed(cs);
    } catch {
      toast.error("Failed to duplicate case study");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Archive this case study?")) return;
    try {
      const result = await remove.mutateAsync(id);
      toast.success("Case study archived");
      warnIfCacheFailed(result);
    } catch {
      toast.error("Failed to archive case study");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Case Studies</h1>
          <p className="mt-1 text-admin-text-secondary">
            Business growth story engine — from problem to measurable results.
          </p>
        </div>
        <Button asChild>
          <Link href="/case-studies/new">
            <Plus className="h-4 w-4" />
            Create Case Study
          </Link>
        </Button>
      </div>

      <CaseStudyStatsCards stats={stats} isLoading={statsLoading} />
      <CaseStudyFilters params={params} onChange={setParams} />
      <CaseStudyTable
        caseStudies={data?.items || []}
        isLoading={isLoading}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-admin-border bg-admin-surface px-4 py-3">
          <p className="text-sm text-admin-text-muted">
            Page {data.pagination.page} of {data.pagination.totalPages} · {data.pagination.total} case studies
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={data.pagination.page <= 1}
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
