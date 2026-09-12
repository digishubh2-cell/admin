"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const deepLinkId = searchParams.get("applicationId");

  const [params, setParams] = useState<ApplicationListParams>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data: stats, isLoading: statsLoading } = useApplicationStats();
  const { data, isLoading } = useApplications(params);
  const mutations = useApplicationMutations();

  useEffect(() => {
    if (deepLinkId) {
      router.replace(`/applications/${deepLinkId}`);
    }
  }, [deepLinkId, router]);

  function handleView(application: Application) {
    router.push(`/applications/${application.id}`);
  }

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    try {
      if (status === "archived") {
        await mutations.remove.mutateAsync(id);
        toast.success("Application archived");
        return;
      }

      if (["offered", "hired", "completed"].includes(status)) {
        toast.message(
          "Open the candidate page and use the pipeline action for this stage"
        );
        router.push(`/applications/${id}`);
        return;
      }

      if (status === "rejected") {
        if (
          !confirm(
            "Reject this candidate and email them a rejection notice?"
          )
        ) {
          return;
        }
        const result = await mutations.reject.mutateAsync({
          id,
          payload: { sendEmail: true },
        });
        if (result.emailWarning) {
          toast.warning(
            `Rejected, but the email failed: ${result.emailWarning}`
          );
        } else {
          toast.success("Rejected — email sent");
        }
        return;
      }

      if (["new", "under_review", "shortlisted"].includes(status)) {
        await mutations.advance.mutateAsync({
          id,
          toStatus: status,
          sendEmail: status === "shortlisted",
        });
        toast.success(`Marked as ${status.replace(/_/g, " ")}`);
        return;
      }

      await mutations.update.mutateAsync({
        id,
        payload: { status },
      });
      toast.success(`Marked as ${status.replace(/_/g, " ")}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Archive this application?")) return;
    try {
      await mutations.remove.mutateAsync(id);
      toast.success("Application archived");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Applications</h1>
        <p className="mt-1 text-admin-text-secondary">
          Internship / trainee hiring pipeline — shortlist, interview, offer,
          hire, and certify.
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
    </div>
  );
}
