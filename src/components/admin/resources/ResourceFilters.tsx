"use client";

import type { ResourceListParams } from "@/types/resource";
import { RESOURCE_CATEGORIES, RESOURCE_TYPES } from "@/constants/resource";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  params: ResourceListParams;
  onChange: (params: ResourceListParams) => void;
}

export function ResourceFilters({ params, onChange }: Props) {
  return (
    <div className="grid gap-4 rounded-2xl border border-admin-border bg-admin-surface p-4 md:grid-cols-2 lg:grid-cols-6">
      <div className="lg:col-span-2">
        <Label htmlFor="res-search">Search</Label>
        <Input
          id="res-search"
          placeholder="Title, tags, category..."
          value={params.search || ""}
          onChange={(e) => onChange({ ...params, search: e.target.value, page: 1 })}
        />
      </div>
      <div>
        <Label htmlFor="res-status">Status</Label>
        <select
          id="res-status"
          className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
          value={params.status || ""}
          onChange={(e) =>
            onChange({
              ...params,
              status: (e.target.value || undefined) as ResourceListParams["status"],
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
        <Label htmlFor="res-type">Type</Label>
        <select
          id="res-type"
          className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
          value={params.type || ""}
          onChange={(e) =>
            onChange({
              ...params,
              type: (e.target.value || undefined) as ResourceListParams["type"],
              page: 1,
            })
          }
        >
          <option value="">All types</option>
          {RESOURCE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="res-category">Category</Label>
        <select
          id="res-category"
          className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
          value={params.category || ""}
          onChange={(e) => onChange({ ...params, category: e.target.value || undefined, page: 1 })}
        >
          <option value="">All categories</option>
          {RESOURCE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="res-sort">Sort</Label>
        <select
          id="res-sort"
          className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
          value={`${params.sortBy}-${params.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split("-") as [string, "asc" | "desc"];
            onChange({ ...params, sortBy, sortOrder });
          }}
        >
          <option value="updatedAt-desc">Recently updated</option>
          <option value="createdAt-desc">Recently created</option>
          <option value="publishedAt-desc">Recently published</option>
          <option value="seoScore-desc">SEO score</option>
          <option value="analytics.downloads-desc">Most downloads</option>
          <option value="title-asc">Title A–Z</option>
        </select>
      </div>
    </div>
  );
}
