"use client";

import type { JobListParams } from "@/types/job";
import { JOB_CATEGORIES, JOB_DEPARTMENTS } from "@/types/job";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  params: JobListParams;
  onChange: (params: JobListParams) => void;
}

export function JobFilters({ params, onChange }: Props) {
  return (
    <div className="grid gap-4 rounded-2xl border border-admin-border bg-admin-surface p-4 md:grid-cols-2 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <Label htmlFor="job-search">Search</Label>
        <Input
          id="job-search"
          placeholder="Title, department, skills..."
          value={params.search || ""}
          onChange={(e) => onChange({ ...params, search: e.target.value, page: 1 })}
        />
      </div>
      <div>
        <Label htmlFor="job-status">Status</Label>
        <select
          id="job-status"
          className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
          value={params.status || ""}
          onChange={(e) =>
            onChange({
              ...params,
              status: (e.target.value || undefined) as JobListParams["status"],
              page: 1,
            })
          }
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div>
        <Label htmlFor="job-type">Type</Label>
        <select
          id="job-type"
          className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
          value={params.type || ""}
          onChange={(e) =>
            onChange({
              ...params,
              type: (e.target.value || undefined) as JobListParams["type"],
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
        <Label htmlFor="job-dept">Department</Label>
        <select
          id="job-dept"
          className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
          value={params.department || ""}
          onChange={(e) =>
            onChange({ ...params, department: e.target.value || undefined, page: 1 })
          }
        >
          <option value="">All departments</option>
          {JOB_DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="job-category">Category</Label>
        <select
          id="job-category"
          className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
          value={params.category || ""}
          onChange={(e) =>
            onChange({ ...params, category: e.target.value || undefined, page: 1 })
          }
        >
          <option value="">All categories</option>
          {JOB_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
