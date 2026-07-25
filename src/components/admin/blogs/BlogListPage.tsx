"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  useBlogCategories,
  useBlogMutations,
  useBlogs,
  useBlogStats,
} from "@/hooks/use-blogs";
import type { BlogListParams } from "@/types/blog";
import { BlogFilters } from "@/components/admin/blogs/BlogFilters";
import { BlogStatsCards } from "@/components/admin/blogs/BlogStatsCards";
import { BlogTable } from "@/components/admin/blogs/BlogTable";
import { Button } from "@/components/ui/button";

export function BlogListPage() {
  const [params, setParams] = useState<BlogListParams>({
    page: 1,
    limit: 20,
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const { data: stats, isLoading: statsLoading } = useBlogStats();
  const { data, isLoading } = useBlogs(params);
  const { data: categories = [] } = useBlogCategories();
  const { duplicate, remove } = useBlogMutations();

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ id: c.id, name: c.name })),
    [categories]
  );

  async function handleDuplicate(id: string) {
    try {
      const blog = await duplicate.mutateAsync(id);
      toast.success(`Duplicated: ${blog.title}`);
    } catch {
      toast.error("Failed to duplicate blog");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Archive this blog post?")) return;
    try {
      await remove.mutateAsync(id);
      toast.success("Blog archived");
    } catch {
      toast.error("Failed to archive blog");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Blog CMS</h1>
          <p className="mt-1 text-admin-text-secondary">
            Enterprise SEO publishing platform for articles, guides, and content.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" disabled>
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/blogs/new">
              <Plus className="h-4 w-4" />
              Create Blog
            </Link>
          </Button>
        </div>
      </div>

      <BlogStatsCards stats={stats} isLoading={statsLoading} />
      <BlogFilters params={params} onChange={setParams} categories={categoryOptions} />
      <BlogTable
        blogs={data?.items || []}
        isLoading={isLoading}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-admin-border bg-admin-surface px-4 py-3">
          <p className="text-sm text-admin-text-muted">
            Page {data.pagination.page} of {data.pagination.totalPages} ·{" "}
            {data.pagination.total} posts
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={params.page === 1}
              onClick={() => setParams((p) => ({ ...p, page: (p.page || 1) - 1 }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={data.pagination.page >= data.pagination.totalPages}
              onClick={() => setParams((p) => ({ ...p, page: (p.page || 1) + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
