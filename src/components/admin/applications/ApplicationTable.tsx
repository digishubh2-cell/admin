"use client";

import { BadgeCheck, Download, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import type { Application, ApplicationStatus } from "@/types/application";
import { APPLICATION_STATUSES } from "@/types/application";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  applications: Application[];
  isLoading?: boolean;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onDelete: (id: string) => void;
  onView: (application: Application) => void;
}

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

function formatStatusLabel(status: string) {
  return status.replace(/_/g, " ");
}

export function ApplicationTable({
  applications,
  isLoading,
  onStatusChange,
  onDelete,
  onView,
}: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-admin-border py-16 text-center">
        <p className="text-lg font-medium">No applications yet</p>
        <p className="mt-1 max-w-md text-sm text-admin-text-muted">
          Candidate applications from the careers apply flow will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-admin-border lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-admin-border bg-admin-muted/40 text-left text-xs uppercase tracking-wide text-admin-text-muted">
              <th className="px-4 py-3 font-medium">Candidate</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Received</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr
                key={app.id}
                className="border-b border-admin-border/70 last:border-0 hover:bg-admin-muted/20"
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onView(app)}
                    className="text-left font-medium hover:text-primary"
                  >
                    {app.candidateName}
                  </button>
                  <p className="text-admin-text-muted">{app.email}</p>
                  {app.phone ? (
                    <p className="text-xs text-admin-text-muted">{app.phone}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{app.jobTitle || "—"}</p>
                  <p className="text-xs capitalize text-admin-text-muted">
                    {app.jobType || "job"}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-4 py-3">
                  {app.emailVerified ? (
                    <Badge variant="outline" className="gap-1 text-success">
                      <BadgeCheck className="h-3 w-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline">Unverified</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-admin-text-muted">
                  {formatDate(app.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {app.resume?.url ? (
                      <Button variant="ghost" size="icon" asChild>
                        <a
                          href={app.resume.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Download resume"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : null}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Application actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(app)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {APPLICATION_STATUSES.filter((s) =>
                          [
                            "new",
                            "under_review",
                            "shortlisted",
                            "assessment_invited",
                            "qualified",
                            "interview",
                            "rejected",
                          ].includes(s)
                        ).map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => onStatusChange(app.id, status)}
                            className="capitalize"
                          >
                            Mark {formatStatusLabel(status)}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(app.id)}
                          className="text-danger"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 lg:hidden">
        {applications.map((app) => (
          <div
            key={app.id}
            className="rounded-2xl border border-admin-border bg-admin-surface p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <button
                  type="button"
                  onClick={() => onView(app)}
                  className="font-medium hover:text-primary"
                >
                  {app.candidateName}
                </button>
                <p className="mt-1 text-sm text-admin-text-muted">{app.jobTitle}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => onView(app)}>
                Details
              </Button>
              {app.resume?.url ? (
                <Button variant="outline" size="sm" asChild>
                  <a href={app.resume.url} target="_blank" rel="noopener noreferrer">
                    Resume
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
