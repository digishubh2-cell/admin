"use client";

import type { ApplicationListParams } from "@/types/application";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  params: ApplicationListParams;
  onChange: (params: ApplicationListParams) => void;
}

export function ApplicationFilters({ params, onChange }: Props) {
  return (
    <div className="grid gap-4 rounded-2xl border border-admin-border bg-admin-surface p-4 md:grid-cols-2 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <Label htmlFor="app-search">Search</Label>
        <Input
          id="app-search"
          placeholder="Name, email, role..."
          value={params.search || ""}
          onChange={(e) =>
            onChange({ ...params, search: e.target.value, page: 1 })
          }
        />
      </div>
      <div>
        <Label htmlFor="app-status">Status</Label>
        <select
          id="app-status"
          className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
          value={params.status || ""}
          onChange={(e) =>
            onChange({
              ...params,
              status: (e.target.value || undefined) as ApplicationListParams["status"],
              page: 1,
            })
          }
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="under_review">Under review</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div>
        <Label htmlFor="app-type">Role type</Label>
        <select
          id="app-type"
          className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
          value={params.jobType || ""}
          onChange={(e) =>
            onChange({
              ...params,
              jobType: (e.target.value || undefined) as ApplicationListParams["jobType"],
              page: 1,
            })
          }
        >
          <option value="">All types</option>
          <option value="job">Job</option>
          <option value="internship">Internship</option>
        </select>
      </div>
      <div>
        <Label htmlFor="app-verified">Email</Label>
        <select
          id="app-verified"
          className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
          value={params.emailVerified || ""}
          onChange={(e) =>
            onChange({
              ...params,
              emailVerified: (e.target.value ||
                undefined) as ApplicationListParams["emailVerified"],
              page: 1,
            })
          }
        >
          <option value="">All</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
      </div>
    </div>
  );
}
