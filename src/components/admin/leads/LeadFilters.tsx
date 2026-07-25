"use client";

import type { LeadListParams } from "@/types/lead";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  params: LeadListParams;
  onChange: (params: LeadListParams) => void;
}

export function LeadFilters({ params, onChange }: Props) {
  return (
    <div className="grid gap-4 rounded-2xl border border-admin-border bg-admin-surface p-4 md:grid-cols-2 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <Label htmlFor="lead-search">Search</Label>
        <Input
          id="lead-search"
          placeholder="Name, email, company, source..."
          value={params.search || ""}
          onChange={(e) =>
            onChange({ ...params, search: e.target.value, page: 1 })
          }
        />
      </div>
      <div>
        <Label htmlFor="lead-status">Status</Label>
        <select
          id="lead-status"
          className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
          value={params.status || ""}
          onChange={(e) =>
            onChange({
              ...params,
              status: (e.target.value || undefined) as LeadListParams["status"],
              page: 1,
            })
          }
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div>
        <Label htmlFor="lead-type">Type</Label>
        <select
          id="lead-type"
          className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
          value={params.type || ""}
          onChange={(e) =>
            onChange({
              ...params,
              type: (e.target.value || undefined) as LeadListParams["type"],
              page: 1,
            })
          }
        >
          <option value="">All types</option>
          <option value="consultation">Consultation</option>
          <option value="proposal">Proposal</option>
          <option value="general">General</option>
        </select>
      </div>
      <div>
        <Label htmlFor="lead-sort">Sort</Label>
        <select
          id="lead-sort"
          className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
          value={`${params.sortBy}-${params.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split("-") as [
              LeadListParams["sortBy"],
              "asc" | "desc",
            ];
            onChange({ ...params, sortBy, sortOrder });
          }}
        >
          <option value="createdAt-desc">Newest first</option>
          <option value="createdAt-asc">Oldest first</option>
          <option value="name-asc">Name A–Z</option>
          <option value="status-asc">Status</option>
        </select>
      </div>
    </div>
  );
}
