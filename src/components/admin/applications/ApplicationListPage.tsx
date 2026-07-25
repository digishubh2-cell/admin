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
  CompletePayload,
  HirePayload,
  InterviewPayload,
  OfferPayload,
  RejectPayload,
} from "@/types/application";
import { ApplicationFilters } from "./ApplicationFilters";
import { ApplicationStatsCards } from "./ApplicationStatsCards";
import { ApplicationTable } from "./ApplicationTable";
import { ApplicationDetailDrawer } from "./ApplicationDetailDrawer";
import { Button } from "@/components/ui/button";

function getErrorMessage(err: unknown) {
  if (err && typeof err === "object" && "response" in err) {
    const response = (err as { response?: { data?: { message?: string } } })
      .response;
    if (response?.data?.message) return response.data.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

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
  const mutations = useApplicationMutations();

  const pipelineBusy =
    mutations.advance.isPending ||
    mutations.interview.isPending ||
    mutations.offer.isPending ||
    mutations.hire.isPending ||
    mutations.complete.isPending ||
    mutations.reject.isPending;

  function handleView(application: Application) {
    setSelected(application);
    setNotes(application.notes || "");
    setDrawerOpen(true);
  }

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    try {
      // Simple statuses via advance when possible; archived via delete
      if (status === "archived") {
        await mutations.remove.mutateAsync(id);
        toast.success("Application archived");
        if (selected?.id === id) {
          setDrawerOpen(false);
          setSelected(null);
        }
        return;
      }

      if (["offered", "hired", "completed"].includes(status)) {
        toast.message("Open the candidate and use the pipeline action for this stage");
        return;
      }

      if (status === "rejected") {
        const updated = await mutations.reject.mutateAsync({
          id,
          payload: { sendEmail: false },
        });
        toast.success("Marked as rejected");
        if (selected?.id === id) setSelected(updated);
        return;
      }

      // Pre-offer: free moves via advance (emails only when shortlisting)
      if (
        ["new", "under_review", "shortlisted"].includes(status)
      ) {
        const updated = await mutations.advance.mutateAsync({
          id,
          toStatus: status,
          sendEmail: status === "shortlisted",
        });
        toast.success(`Marked as ${status.replace(/_/g, " ")}`);
        if (selected?.id === id) setSelected(updated);
        return;
      }

      // interview status without invite form (invite uses pipeline action)
      const updated = await mutations.update.mutateAsync({
        id,
        payload: { status },
      });
      toast.success(`Marked as ${status.replace(/_/g, " ")}`);
      if (selected?.id === id) setSelected(updated);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleSaveNotes() {
    if (!selected) return;
    try {
      const updated = await mutations.update.mutateAsync({
        id: selected.id,
        payload: { notes },
      });
      setSelected(updated);
      toast.success("Notes saved");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Archive this application?")) return;
    try {
      await mutations.remove.mutateAsync(id);
      toast.success("Application archived");
      if (selected?.id === id) {
        setDrawerOpen(false);
        setSelected(null);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleAdvance(toStatus: ApplicationStatus, sendEmail = true) {
    if (!selected) return;
    try {
      const updated = await mutations.advance.mutateAsync({
        id: selected.id,
        toStatus,
        sendEmail,
      });
      setSelected(updated);
      toast.success(`Moved to ${toStatus.replace(/_/g, " ")}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleInterview(payload: InterviewPayload) {
    if (!selected) return;
    try {
      const updated = await mutations.interview.mutateAsync({
        id: selected.id,
        payload,
      });
      setSelected(updated);
      toast.success("Interview invite sent");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleOffer(payload: OfferPayload) {
    if (!selected) return;
    try {
      toast.message("Generating offer PDF…");
      const updated = await mutations.offer.mutateAsync({
        id: selected.id,
        payload,
      });
      setSelected(updated);
      toast.success("Offer letter sent");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleHire(payload: HirePayload) {
    if (!selected) return;
    try {
      const updated = await mutations.hire.mutateAsync({
        id: selected.id,
        payload,
      });
      setSelected(updated);
      toast.success("Marked hired — welcome email sent");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleComplete(payload: CompletePayload) {
    if (!selected) return;
    try {
      toast.message("Generating certificate…");
      const updated = await mutations.complete.mutateAsync({
        id: selected.id,
        payload,
      });
      setSelected(updated);
      toast.success("Certificate issued and emailed");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleReject(payload: RejectPayload) {
    if (!selected) return;
    try {
      const updated = await mutations.reject.mutateAsync({
        id: selected.id,
        payload,
      });
      setSelected(updated);
      toast.success("Candidate rejected");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Applications</h1>
        <p className="mt-1 text-admin-text-secondary">
          Internship / trainee hiring pipeline — shortlist, interview, offer, hire, and certify.
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
        onSaveNotes={handleSaveNotes}
        saving={mutations.update.isPending}
        pipelineBusy={pipelineBusy}
        onAdvance={handleAdvance}
        onInterview={handleInterview}
        onOffer={handleOffer}
        onHire={handleHire}
        onComplete={handleComplete}
        onReject={handleReject}
      />
    </div>
  );
}
