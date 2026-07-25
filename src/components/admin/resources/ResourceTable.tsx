"use client";

import Image from "next/image";
import Link from "next/link";
import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Resource } from "@/types/resource";
import { getResourceTypeLabel } from "@/constants/resource";
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

interface Props {
  resources: Resource[];
  isLoading?: boolean;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatDate(date?: string | null) {
  if (!date) return "—";
  try {
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
  } catch {
    return "—";
  }
}

export function ResourceTable({ resources, isLoading, onDuplicate, onDelete }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!resources.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-admin-border py-16 text-center">
        <p className="text-lg font-medium">No resources yet</p>
        <p className="mt-1 max-w-md text-sm text-admin-text-muted">
          Build your Knowledge Hub with guides, documentation, templates, whitepapers, and downloadable assets.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/resources/new">Create Resource</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden overflow-hidden rounded-2xl border border-admin-border lg:block">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-admin-border bg-admin-muted/40 text-left text-xs uppercase tracking-wide text-admin-text-muted">
            <th className="px-4 py-3 font-medium">Resource</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Downloads</th>
            <th className="px-4 py-3 font-medium">Views</th>
            <th className="px-4 py-3 font-medium">SEO</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Author</th>
            <th className="px-4 py-3 font-medium">Updated</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {resources.map((r) => (
            <tr key={r.id} className="border-b border-admin-border/60 transition-colors last:border-0 hover:bg-admin-muted/30">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-admin-muted">
                    {r.media?.featuredImage?.url ? (
                      <Image src={r.media.featuredImage.url} alt="" fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-admin-text-muted">No img</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <Link href={`/resources/${r.id}/edit`} className="line-clamp-1 font-medium hover:text-primary">
                      {r.title}
                    </Link>
                    <p className="line-clamp-1 text-xs text-admin-text-muted">/{r.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-admin-text-secondary">{getResourceTypeLabel(r.type)}</td>
              <td className="px-4 py-3 text-admin-text-secondary">{r.category || "—"}</td>
              <td className="px-4 py-3 tabular-nums">{r.analytics?.downloads ?? 0}</td>
              <td className="px-4 py-3 tabular-nums">{r.analytics?.views ?? 0}</td>
              <td className="px-4 py-3"><SeoScoreBadge score={r.seoScore} /></td>
              <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
              <td className="px-4 py-3 text-admin-text-muted">{r.authorName || "—"}</td>
              <td className="px-4 py-3 text-admin-text-muted">{formatDate(r.updatedAt)}</td>
              <td className="px-4 py-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/resources/${r.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(r.id)}><Copy className="mr-2 h-4 w-4" />Duplicate</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-danger" onClick={() => onDelete(r.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
