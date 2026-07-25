"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useApplicationMutations,
  useApplications,
  useApplicationStats,
} from "@/hooks/use-applications";
import type {
  Application,
  ApplicationListParams,
  ApplicationStatus,
} from "@/types/application";
import { ApplicationFilters } from "./ApplicationFilters";
import { ApplicationStatsCards } from "./ApplicationStatsCards";
import { ApplicationTable } from "./ApplicationTable";
import { ApplicationDetailDrawer } from "./ApplicationDetailDrawer";
import { Button } from "@/components/ui/button";

export function ApplicationListPage() {
  const [params, setParams] = useState<ApplicationListParams>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [selected, setSelected] = useState<Application | null>(null);
  const [notes, setNotes] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useApplicationStats();
  const { data, isLoading } = useApplications(params);
  const { update, remove } = useApplicationMutations();

  function handleView(application: Application) {
    setSelected(application);
    setNotes(application.notes || "");
    setDrawerOpen(true);
  }

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    try {
      const updated = await update.mutateAsync({ id, payload: { status } });
      toast.success(`Marked as ${status.replace(/_/g, " ")}`);
      if (selected?.id === id) setSelected(updated);
    } catch {
      toast.error("Failed to update status");
    }
  }

  async function handleSaveNotes() {
    if (!selected) return;
    try {
      const updated = await update.mutateAsync({
        id: selected.id,
        payload: { notes },
      });
      setSelected(updated);
      toast.success("Notes saved");
    } catch {
      toast.error("Failed to save notes");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Archive this application?")) return;
    try {
      await remove.mutateAsync(id);
      toast.success("Application archived");
      if (selected?.id === id) {
        setDrawerOpen(false);
        setSelected(null);
      }
    } catch {
      toast.error("Failed to archive application");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Applications</h1>
        <p className="mt-1 text-admin-text-secondary">
          Candidate inbox for careers applications — status, resume, and verification.
        </p>
      </div>

      <ApplicationStatsCards stats={stats} isLoading={statsLoading} />
      <ApplicationFilters params={params} onChange={setParams} />
      <ApplicationTable
        applications={data?.items || []}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        onView={handleView}
      />

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-admin-border bg-admin-surface px-4 py-3">
          <p className="text-sm text-admin-text-muted">
            Page {data.pagination.page} of {data.pagination.totalPages} ·{" "}
            {data.pagination.total} applications
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

      <ApplicationDetailDrawer
        application={selected}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        notes={notes}
        onNotesChange={setNotes}
        onStatusChange={(status) =>
          selected ? handleStatusChange(selected.id, status) : undefined
        }
        onSaveNotes={handleSaveNotes}
        saving={update.isPending}
      />
    </div>
  );
}
