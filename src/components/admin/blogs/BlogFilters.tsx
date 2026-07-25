"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { BlogListParams, BlogStatus } from "@/types/blog";

interface BlogFiltersProps {
  params: BlogListParams;
  onChange: (params: BlogListParams) => void;
  categories: { id: string; name: string }[];
}

const statuses: { value: BlogStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "review", label: "Review" },
  { value: "approved", label: "Approved" },
  { value: "scheduled", label: "Scheduled" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export function BlogFilters({ params, onChange, categories }: BlogFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-admin-border bg-admin-surface p-4 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-text-muted" />
        <Input
          placeholder="Search title, slug, keyword, content..."
          className="pl-9"
          value={params.search || ""}
          onChange={(e) => onChange({ ...params, search: e.target.value, page: 1 })}
        />
      </div>

      <Select
        value={params.status || ""}
        onChange={(e) =>
          onChange({
            ...params,
            status: (e.target.value as BlogStatus) || undefined,
            page: 1,
          })
        }
        className="lg:w-40"
      >
        {statuses.map((s) => (
          <option key={s.value || "all"} value={s.value}>
            {s.label}
          </option>
        ))}
      </Select>

      <Select
        value={params.categoryId || ""}
        onChange={(e) =>
          onChange({
            ...params,
            categoryId: e.target.value || undefined,
            page: 1,
          })
        }
        className="lg:w-44"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>

      <Select
        value={params.sortBy || "updatedAt"}
        onChange={(e) => onChange({ ...params, sortBy: e.target.value })}
        className="lg:w-40"
      >
        <option value="updatedAt">Last updated</option>
        <option value="createdAt">Created</option>
        <option value="publishedAt">Published</option>
        <option value="title">Title</option>
        <option value="seoScore">SEO score</option>
      </Select>

      <Select
        value={params.sortOrder || "desc"}
        onChange={(e) =>
          onChange({ ...params, sortOrder: e.target.value as "asc" | "desc" })
        }
        className="lg:w-32"
      >
        <option value="desc">Newest</option>
        <option value="asc">Oldest</option>
      </Select>
    </div>
  );
}
