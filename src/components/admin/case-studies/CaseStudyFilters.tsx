"use client";

import type { CaseStudyListParams } from "@/types/case-study";
import { CASE_STUDY_CATEGORIES, CASE_STUDY_INDUSTRIES } from "@/types/case-study";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  params: CaseStudyListParams;
  onChange: (params: CaseStudyListParams) => void;
}

export function CaseStudyFilters({ params, onChange }: Props) {
  return (
    <div className="grid gap-4 rounded-2xl border border-admin-border bg-admin-surface p-4 md:grid-cols-2 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <Label htmlFor="cs-search">Search</Label>
        <Input
          id="cs-search"
          placeholder="Project, client, industry..."
          value={params.search || ""}
          onChange={(e) => onChange({ ...params, search: e.target.value, page: 1 })}
        />
      </div>
      <div>
        <Label htmlFor="cs-status">Status</Label>
        <select
          id="cs-status"
          className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
          value={params.status || ""}
          onChange={(e) =>
            onChange({
              ...params,
              status: (e.target.value || undefined) as CaseStudyListParams["status"],
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
        <Label htmlFor="cs-industry">Industry</Label>
        <select
          id="cs-industry"
          className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
          value={params.industry || ""}
          onChange={(e) => onChange({ ...params, industry: e.target.value || undefined, page: 1 })}
        >
          <option value="">All industries</option>
          {CASE_STUDY_INDUSTRIES.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="cs-sort">Sort</Label>
        <select
          id="cs-sort"
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
          <option value="projectName-asc">Name A–Z</option>
        </select>
      </div>
      <div className="md:col-span-2 lg:col-span-1">
        <Label htmlFor="cs-category">Category</Label>
        <select
          id="cs-category"
          className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
          value={params.category || ""}
          onChange={(e) => onChange({ ...params, category: e.target.value || undefined, page: 1 })}
        >
          <option value="">All categories</option>
          {CASE_STUDY_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
