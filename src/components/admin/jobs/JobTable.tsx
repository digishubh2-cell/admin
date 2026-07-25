"use client";

import Link from "next/link";
import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Job } from "@/types/job";
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
  jobs: Job[];
  isLoading?: boolean;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatDate(date?: string | null) {
  if (!date) return "—";
  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "—";
  }
}

export function JobTable({ jobs, isLoading, onDuplicate, onDelete }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-admin-border py-16 text-center">
        <p className="text-lg font-medium">No jobs yet</p>
        <p className="mt-1 text-sm text-admin-text-muted">
          Create your first job or internship posting.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/jobs/new">Create Job</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-admin-border lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-admin-border bg-admin-muted/40 text-left text-xs uppercase tracking-wide text-admin-text-muted">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="border-b border-admin-border/70 last:border-0 hover:bg-admin-muted/20"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/jobs/${job.id}/edit`}
                    className="font-medium text-admin-text hover:text-primary"
                  >
                    {job.title}
                  </Link>
                  {job.featured ? (
                    <Badge variant="outline" className="ml-2">
                      Featured
                    </Badge>
                  ) : null}
                </td>
                <td className="px-4 py-3 capitalize">{job.type}</td>
                <td className="px-4 py-3 text-admin-text-secondary">
                  {job.department || "—"}
                </td>
                <td className="px-4 py-3 text-admin-text-secondary">
                  {job.location || "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-4 py-3 text-admin-text-muted">
                  {formatDate(job.updatedAt)}
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Job actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/jobs/${job.id}/edit`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicate(job.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(job.id)}
                        className="text-danger"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 lg:hidden">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="rounded-2xl border border-admin-border bg-admin-surface p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  href={`/jobs/${job.id}/edit`}
                  className="font-medium hover:text-primary"
                >
                  {job.title}
                </Link>
                <p className="mt-1 text-sm capitalize text-admin-text-muted">
                  {job.type} · {job.department || "No department"}
                </p>
              </div>
              <StatusBadge status={job.status} />
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/jobs/${job.id}/edit`}>Edit</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDuplicate(job.id)}>
                Duplicate
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
