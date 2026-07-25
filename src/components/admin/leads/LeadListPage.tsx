"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useLeadMutations, useLeads, useLeadStats } from "@/hooks/use-leads";
import type { LeadListParams, LeadStatus } from "@/types/lead";
import { LeadFilters } from "./LeadFilters";
import { LeadStatsCards } from "./LeadStatsCards";
import { LeadTable } from "./LeadTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function LeadListPage() {
  const [params, setParams] = useState<LeadListParams>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data: stats, isLoading: statsLoading } = useLeadStats();
  const { data, isLoading } = useLeads(params);
  const { update, remove } = useLeadMutations();

  async function handleStatusChange(id: string, status: LeadStatus) {
    try {
      await update.mutateAsync({ id, payload: { status } });
      toast.success(`Lead marked as ${status}`);
    } catch {
      toast.error("Failed to update lead");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Archive this lead?")) return;
    try {
      await remove.mutateAsync(id);
      toast.success("Lead archived");
    } catch {
      toast.error("Failed to archive lead");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Leads</h1>
        <p className="mt-1 text-admin-text-secondary">
          Inquiries from site forms — including which page and CTA generated each lead.
        </p>
      </div>

      <LeadStatsCards stats={stats} isLoading={statsLoading} />

      {stats?.bySource && stats.bySource.length > 0 ? (
        <div className="rounded-2xl border border-admin-border bg-admin-surface p-4">
          <p className="text-sm font-medium">Top sources</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {stats.bySource.map((row) => (
              <Badge key={`${row.page}-${row.section}`} variant="outline">
                {row.page === "/" ? "Homepage" : row.page}
                {" · "}
                <span className="capitalize">{row.section.replace(/-/g, " ")}</span>
                {" · "}
                {row.count}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      <LeadFilters params={params} onChange={setParams} />
      <LeadTable
        leads={data?.items || []}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-admin-border bg-admin-surface px-4 py-3">
          <p className="text-sm text-admin-text-muted">
            Page {data.pagination.page} of {data.pagination.totalPages} ·{" "}
            {data.pagination.total} leads
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={params.page === 1}
              onClick={() =>
                setParams((p) => ({ ...p, page: (p.page || 1) - 1 }))
              }
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={data.pagination.page >= data.pagination.totalPages}
              onClick={() =>
                setParams((p) => ({ ...p, page: (p.page || 1) + 1 }))
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
