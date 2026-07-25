"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Copy,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { SeoScoreBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogTableProps {
  blogs: BlogPost[];
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

export function BlogTable({ blogs, isLoading, onDuplicate, onDelete }: BlogTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!blogs.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-admin-border py-16 text-center">
        <p className="text-lg font-medium">No blogs found</p>
        <p className="mt-1 text-sm text-admin-text-muted">
          Create your first SEO-optimized article to get started.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/blogs/new">Create Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-admin-border lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-admin-border bg-admin-muted/40 text-left text-xs uppercase tracking-wide text-admin-text-muted">
              <th className="px-4 py-3 font-medium">Post</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">SEO</th>
              <th className="px-4 py-3 font-medium">Views</th>
              <th className="px-4 py-3 font-medium">Read</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr
                key={blog.id}
                className="border-b border-admin-border/60 transition-colors last:border-0 hover:bg-admin-muted/30"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-admin-muted">
                      {blog.featuredImage?.url ? (
                        <Image
                          src={blog.featuredImage.url}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-admin-text-muted">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/blogs/${blog.id}/edit`}
                        className="line-clamp-1 font-medium hover:text-primary"
                      >
                        {blog.title}
                      </Link>
                      <p className="line-clamp-1 text-xs text-admin-text-muted">
                        /{blog.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-admin-text-secondary">
                  {blog.categoryName || "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={blog.status} />
                </td>
                <td className="px-4 py-3">
                  <SeoScoreBadge score={blog.seoScore || 0} />
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {blog.analytics?.views ?? 0}
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {blog.readTimeMinutes}m
                </td>
                <td className="px-4 py-3 text-admin-text-muted">
                  {formatDate(blog.updatedAt)}
                </td>
                <td className="px-4 py-3">
                  <BlogRowActions
                    blog={blog}
                    onDuplicate={onDuplicate}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 lg:hidden">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="rounded-2xl border border-admin-border bg-admin-surface p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/blogs/${blog.id}/edit`}
                  className="font-medium hover:text-primary"
                >
                  {blog.title}
                </Link>
                <p className="mt-1 text-xs text-admin-text-muted">/{blog.slug}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge status={blog.status} />
                  <SeoScoreBadge score={blog.seoScore || 0} />
                </div>
              </div>
              <BlogRowActions
                blog={blog}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function BlogRowActions({
  blog,
  onDuplicate,
  onDelete,
}: {
  blog: BlogPost;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/blogs/${blog.id}/edit`}>
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/blog/${blog.slug}`} target="_blank">
            <Eye className="h-4 w-4" />
            Preview
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDuplicate(blog.id)}>
          <Copy className="h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-danger focus:text-danger"
          onClick={() => onDelete(blog.id)}
        >
          <Trash2 className="h-4 w-4" />
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
