"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import type { Lead, LeadStatus } from "@/types/lead";
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
  leads: Lead[];
  isLoading?: boolean;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onDelete: (id: string) => void;
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

function SourceCell({ lead }: { lead: Lead }) {
  const page = lead.source?.page || "/";
  const section = lead.source?.section || "unknown";
  const cta = lead.source?.ctaLabel;

  return (
    <div className="min-w-0 space-y-1">
      <p className="truncate font-medium text-admin-text" title={page}>
        {page === "/" ? "Homepage" : page}
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="outline" className="capitalize">
          {section.replace(/-/g, " ")}
        </Badge>
        {cta ? (
          <span className="truncate text-xs text-admin-text-muted" title={cta}>
            CTA: {cta}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function LeadTable({ leads, isLoading, onStatusChange, onDelete }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-admin-border py-16 text-center">
        <p className="text-lg font-medium">No leads yet</p>
        <p className="mt-1 max-w-md text-sm text-admin-text-muted">
          When someone submits the homepage form, their details and source page
          will appear here automatically.
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
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Received</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-admin-border/70 last:border-0 hover:bg-admin-muted/20"
              >
                <td className="px-4 py-3">
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-admin-text-muted">{lead.email}</p>
                  {lead.phone ? (
                    <p className="text-xs text-admin-text-muted">{lead.phone}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-admin-text-secondary">
                  {lead.company || "—"}
                </td>
                <td className="px-4 py-3 capitalize">{lead.type}</td>
                <td className="px-4 py-3">
                  <SourceCell lead={lead} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3 text-admin-text-muted">
                  {formatDate(lead.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Lead actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {(
                        [
                          "new",
                          "contacted",
                          "qualified",
                          "won",
                          "lost",
                        ] as LeadStatus[]
                      ).map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => onStatusChange(lead.id, status)}
                          className="capitalize"
                        >
                          Mark {status}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-danger"
                        onClick={() => onDelete(lead.id)}
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
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="rounded-2xl border border-admin-border bg-admin-surface p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{lead.name}</p>
                <p className="text-sm text-admin-text-muted">{lead.email}</p>
              </div>
              <StatusBadge status={lead.status} />
            </div>
            <div className="mt-3">
              <SourceCell lead={lead} />
            </div>
            <p className="mt-2 text-xs text-admin-text-muted">
              {formatDate(lead.createdAt)} ·{" "}
              <span className="capitalize">{lead.type}</span>
            </p>
            {lead.message ? (
              <p className="mt-2 line-clamp-2 text-sm text-admin-text-secondary">
                {lead.message}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(lead.id, "contacted")}
              >
                Mark contacted
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-danger"
                onClick={() => onDelete(lead.id)}
              >
                Archive
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
