"use client";

import Image from "next/image";
import Link from "next/link";
import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { CaseStudy } from "@/types/case-study";
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
  caseStudies: CaseStudy[];
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

export function CaseStudyTable({ caseStudies, isLoading, onDuplicate, onDelete }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!caseStudies.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-admin-border py-16 text-center">
        <p className="text-lg font-medium">No case studies yet</p>
        <p className="mt-1 text-sm text-admin-text-muted">
          Publish your first business growth story to build trust and generate leads.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/case-studies/new">Create Case Study</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden overflow-hidden rounded-2xl border border-admin-border lg:block">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-admin-border bg-admin-muted/40 text-left text-xs uppercase tracking-wide text-admin-text-muted">
            <th className="px-4 py-3 font-medium">Project</th>
            <th className="px-4 py-3 font-medium">Client</th>
            <th className="px-4 py-3 font-medium">Industry</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">SEO</th>
            <th className="px-4 py-3 font-medium">Views</th>
            <th className="px-4 py-3 font-medium">Updated</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {caseStudies.map((cs) => (
            <tr key={cs.id} className="border-b border-admin-border/60 transition-colors last:border-0 hover:bg-admin-muted/30">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-admin-muted">
                    {cs.media?.featuredImage?.url ? (
                      <Image src={cs.media.featuredImage.url} alt="" fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-admin-text-muted">No img</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <Link href={`/case-studies/${cs.id}/edit`} className="line-clamp-1 font-medium hover:text-primary">
                      {cs.projectName}
                    </Link>
                    <p className="line-clamp-1 text-xs text-admin-text-muted">/{cs.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-admin-text-secondary">{cs.clientName || "—"}</td>
              <td className="px-4 py-3 text-admin-text-secondary">{cs.industry || "—"}</td>
              <td className="px-4 py-3"><StatusBadge status={cs.status} /></td>
              <td className="px-4 py-3"><SeoScoreBadge score={cs.seoScore} /></td>
              <td className="px-4 py-3 tabular-nums">{cs.analytics?.views ?? 0}</td>
              <td className="px-4 py-3 text-admin-text-muted">{formatDate(cs.updatedAt)}</td>
              <td className="px-4 py-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/case-studies/${cs.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(cs.id)}><Copy className="mr-2 h-4 w-4" />Duplicate</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-danger" onClick={() => onDelete(cs.id)}>
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
