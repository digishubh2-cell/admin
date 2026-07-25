"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useTestimonials, useTestimonialMutations, useTestimonialStats } from "@/hooks/use-testimonials";
import type { TestimonialListParams } from "@/types/testimonial";
import { TestimonialFilters } from "./TestimonialFilters";
import { TestimonialStatsCards } from "./TestimonialStatsCards";
import { TestimonialTable } from "./TestimonialTable";
import { Button } from "@/components/ui/button";

export function TestimonialListPage() {
  const [params, setParams] = useState<TestimonialListParams>({
    page: 1,
    limit: 20,
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const { data: stats, isLoading: statsLoading } = useTestimonialStats();
  const { data, isLoading } = useTestimonials(params);
  const { duplicate, remove } = useTestimonialMutations();

  async function handleDuplicate(id: string) {
    try {
      const t = await duplicate.mutateAsync(id);
      toast.success(`Duplicated: ${t.fullName}`);
    } catch {
      toast.error("Failed to duplicate testimonial");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Archive this testimonial?")) return;
    try {
      await remove.mutateAsync(id);
      toast.success("Testimonial archived");
    } catch {
      toast.error("Failed to archive testimonial");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Trust Engine</h1>
          <p className="mt-1 text-admin-text-secondary">
            Enterprise Testimonial Management — client reviews, video testimonials, Google reviews, LinkedIn recommendations, and success stories.
          </p>
        </div>
        <Button asChild>
          <Link href="/testimonials/new">
            <Plus className="h-4 w-4" />
            Create Testimonial
          </Link>
        </Button>
      </div>

      <TestimonialStatsCards stats={stats} isLoading={statsLoading} />
      <TestimonialFilters params={params} onChange={setParams} />
      <TestimonialTable
        testimonials={data?.items || []}
        isLoading={isLoading}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-admin-border bg-admin-surface px-4 py-3">
          <p className="text-sm text-admin-text-muted">
            Page {data.pagination.page} of {data.pagination.totalPages} · {data.pagination.total} testimonials
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
