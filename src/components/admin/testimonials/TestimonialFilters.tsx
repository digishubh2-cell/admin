"use client";

import type { TestimonialListParams } from "@/types/testimonial";
import { LANGUAGES, TESTIMONIAL_TYPES } from "@/constants/testimonial";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  params: TestimonialListParams;
  onChange: (params: TestimonialListParams) => void;
}

export function TestimonialFilters({ params, onChange }: Props) {
  return (
    <div className="grid gap-4 rounded-2xl border border-admin-border bg-admin-surface p-4 md:grid-cols-2 lg:grid-cols-6">
      <div className="lg:col-span-2">
        <Label htmlFor="t-search">Search</Label>
        <Input
          id="t-search"
          placeholder="Name, company, review..."
          value={params.search || ""}
          onChange={(e) => onChange({ ...params, search: e.target.value, page: 1 })}
        />
      </div>
      <div>
        <Label htmlFor="t-status">Status</Label>
        <select
          id="t-status"
          className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
          value={params.status || ""}
          onChange={(e) =>
            onChange({
              ...params,
              status: (e.target.value || undefined) as TestimonialListParams["status"],
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
        <Label htmlFor="t-type">Type</Label>
        <select
          id="t-type"
          className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
          value={params.reviewType || ""}
          onChange={(e) =>
            onChange({
              ...params,
              reviewType: (e.target.value || undefined) as TestimonialListParams["reviewType"],
              page: 1,
            })
          }
        >
          <option value="">All types</option>
          {TESTIMONIAL_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="t-language">Language</Label>
        <select
          id="t-language"
          className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
          value={params.language || ""}
          onChange={(e) => onChange({ ...params, language: e.target.value || undefined, page: 1 })}
        >
          <option value="">All languages</option>
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="t-sort">Sort</Label>
        <select
          id="t-sort"
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
          <option value="review.rating-desc">Highest rating</option>
          <option value="seoScore-desc">SEO score</option>
          <option value="priority-desc">Priority</option>
          <option value="fullName-asc">Name A–Z</option>
        </select>
      </div>
    </div>
  );
}
