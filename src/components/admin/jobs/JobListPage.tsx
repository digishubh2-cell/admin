"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { warnIfCacheFailed } from "@/lib/cache/afterMutation";
import { useJobMutations, useJobs, useJobStats } from "@/hooks/use-jobs";
import type { JobListParams } from "@/types/job";
import { JobFilters } from "./JobFilters";
import { JobStatsCards } from "./JobStatsCards";
import { JobTable } from "./JobTable";
import { Button } from "@/components/ui/button";

export function JobListPage() {
  const [params, setParams] = useState<JobListParams>({
    page: 1,
    limit: 20,
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const { data: stats, isLoading: statsLoading } = useJobStats();
  const { data, isLoading } = useJobs(params);
  const { duplicate, remove } = useJobMutations();

  async function handleDuplicate(id: string) {
    try {
      const job = await duplicate.mutateAsync(id);
      toast.success(`Duplicated: ${job.title}`);
      warnIfCacheFailed(job);
    } catch {
      toast.error("Failed to duplicate job");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Archive this job?")) return;
    try {
      const result = await remove.mutateAsync(id);
      toast.success("Job archived");
      warnIfCacheFailed(result);
    } catch {
      toast.error("Failed to archive job");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Jobs</h1>
          <p className="mt-1 text-admin-text-secondary">
            Manage job openings and internship programs for ShubhDigi Careers.
          </p>
        </div>
        <Button asChild>
          <Link href="/jobs/new">
            <Plus className="h-4 w-4" />
            Create Job
          </Link>
        </Button>
      </div>

      <JobStatsCards stats={stats} isLoading={statsLoading} />
      <JobFilters params={params} onChange={setParams} />
      <JobTable
        jobs={data?.items || []}
        isLoading={isLoading}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-admin-border bg-admin-surface px-4 py-3">
          <p className="text-sm text-admin-text-muted">
            Page {data.pagination.page} of {data.pagination.totalPages} ·{" "}
            {data.pagination.total} jobs
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
