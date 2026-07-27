"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useAttempts } from "@/hooks/use-assessments";
import type { AttemptListParams } from "@/types/assessment";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AssessmentsTabs } from "./AssessmentsTabs";

function formatDate(date?: string | null) {
  if (!date) return "—";
  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  } catch {
    return "—";
  }
}

export function AttemptsListPage() {
  const [params, setParams] = useState<AttemptListParams>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, isLoading } = useAttempts(params);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Assessments</h1>
        <p className="mt-1 text-admin-text-secondary">
          Candidate online assessment attempts — review answers, score, and decide pass/fail.
        </p>
      </div>

      <AssessmentsTabs />

      <div className="grid gap-4 rounded-2xl border border-admin-border bg-admin-surface p-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Label htmlFor="attempt-search">Search</Label>
          <Input
            id="attempt-search"
            placeholder="Candidate name, email, role..."
            value={params.search || ""}
            onChange={(e) => setParams((p) => ({ ...p, search: e.target.value, page: 1 }))}
          />
        </div>
        <div>
          <Label htmlFor="attempt-status">Status</Label>
          <select
            id="attempt-status"
            className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
            value={params.status || ""}
            onChange={(e) =>
              setParams((p) => ({
                ...p,
                status: (e.target.value || undefined) as AttemptListParams["status"],
                page: 1,
              }))
            }
          >
            <option value="">All statuses</option>
            <option value="invited">Invited</option>
            <option value="identity_pending">Identity pending</option>
            <option value="in_progress">In progress</option>
            <option value="submitted">Submitted</option>
            <option value="expired">Expired</option>
            <option value="void">Void</option>
          </select>
        </div>
        <div>
          <Label htmlFor="attempt-decision">Decision</Label>
          <select
            id="attempt-decision"
            className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
            value={params.adminDecision || ""}
            onChange={(e) =>
              setParams((p) => ({
                ...p,
                adminDecision: (e.target.value || undefined) as AttemptListParams["adminDecision"],
                page: 1,
              }))
            }
          >
            <option value="">All decisions</option>
            <option value="pending">Pending</option>
            <option value="pass">Pass</option>
            <option value="fail">Fail</option>
            <option value="retake">Retake</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-2xl" />
          ))}
        </div>
      ) : !data?.items.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-admin-border py-16 text-center">
          <p className="text-lg font-medium">No assessment attempts yet</p>
          <p className="mt-1 max-w-md text-sm text-admin-text-muted">
            Invite a shortlisted candidate to an assessment from their application detail view.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-admin-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border bg-admin-muted/40 text-left text-xs uppercase tracking-wide text-admin-text-muted">
                <th className="px-4 py-3 font-medium">Candidate</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Template</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Decision</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {data.items.map((attempt) => (
                <tr
                  key={attempt.id}
                  className="border-b border-admin-border/70 last:border-0 hover:bg-admin-muted/20"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{attempt.candidateName}</p>
                    <p className="text-admin-text-muted">{attempt.candidateEmail}</p>
                  </td>
                  <td className="px-4 py-3">{attempt.jobTitle || "—"}</td>
                  <td className="px-4 py-3">
                    {attempt.templateName || "—"}
                    <p className="text-xs capitalize text-admin-text-muted">
                      {attempt.path === "both" ? "Test + Interview" : "Test only"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={attempt.status} />
                  </td>
                  <td className="px-4 py-3">
                    {attempt.status === "submitted" || attempt.autoScore?.total ? (
                      <Badge variant="outline">
                        {attempt.autoScore.correct}/{attempt.autoScore.total} ·{" "}
                        {attempt.autoScore.percent}%
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={attempt.adminDecision} />
                  </td>
                  <td className="px-4 py-3 text-admin-text-muted">
                    {formatDate(attempt.submittedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="icon" asChild aria-label="View attempt">
                      <Link href={`/assessments/${attempt.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-admin-border bg-admin-surface px-4 py-3">
          <p className="text-sm text-admin-text-muted">
            Page {data.pagination.page} of {data.pagination.totalPages} · {data.pagination.total}{" "}
            attempts
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
