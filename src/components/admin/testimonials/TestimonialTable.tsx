"use client";

import Image from "next/image";
import Link from "next/link";
import { Copy, MoreHorizontal, Pencil, Star, Trash2, Video } from "lucide-react";
import type { Testimonial } from "@/types/testimonial";
import { getTestimonialTypeLabel } from "@/constants/testimonial";
import { hasVideo } from "@/lib/testimonial/utils";
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
  testimonials: Testimonial[];
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

function RatingStars({ rating = 0 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
      <span className="tabular-nums text-sm">{rating || "—"}</span>
    </div>
  );
}

export function TestimonialTable({ testimonials, isLoading, onDuplicate, onDelete }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!testimonials.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-admin-border py-16 text-center">
        <p className="text-lg font-medium">No testimonials yet</p>
        <p className="mt-1 max-w-md text-sm text-admin-text-muted">
          Build trust with client reviews, video testimonials, Google reviews, LinkedIn recommendations, and success stories.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/testimonials/new">Create Testimonial</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden overflow-hidden rounded-2xl border border-admin-border lg:block">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-admin-border bg-admin-muted/40 text-left text-xs uppercase tracking-wide text-admin-text-muted">
            <th className="px-4 py-3 font-medium">Avatar</th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Designation</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Featured</th>
            <th className="px-4 py-3 font-medium">Language</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Updated</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {testimonials.map((t) => (
            <tr key={t.id} className="border-b border-admin-border/60 transition-colors last:border-0 hover:bg-admin-muted/30">
              <td className="px-4 py-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-admin-muted">
                  {t.media?.profileImage?.url ? (
                    <Image src={t.media.profileImage.url} alt="" fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs font-medium text-admin-text-muted">
                      {t.fullName?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="min-w-0">
                    <Link href={`/testimonials/${t.id}/edit`} className="line-clamp-1 font-medium hover:text-primary">
                      {t.fullName}
                    </Link>
                    {hasVideo(t) && <Video className="inline h-3.5 w-3.5 text-primary" />}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-admin-text-secondary">{t.companyName || "—"}</td>
              <td className="px-4 py-3 text-admin-text-muted">{t.designation || "—"}</td>
              <td className="px-4 py-3 text-admin-text-secondary">{getTestimonialTypeLabel(t.reviewType)}</td>
              <td className="px-4 py-3"><RatingStars rating={t.review?.rating} /></td>
              <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
              <td className="px-4 py-3">
                {t.featured ? (
                  <Star className="h-4 w-4 fill-warning text-warning" />
                ) : (
                  <span className="text-admin-text-muted">—</span>
                )}
              </td>
              <td className="px-4 py-3 uppercase text-admin-text-muted">{t.language || "en"}</td>
              <td className="px-4 py-3 text-admin-text-muted">{formatDate(t.createdAt)}</td>
              <td className="px-4 py-3 text-admin-text-muted">{formatDate(t.updatedAt)}</td>
              <td className="px-4 py-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/testimonials/${t.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(t.id)}><Copy className="mr-2 h-4 w-4" />Duplicate</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-danger" onClick={() => onDelete(t.id)}>
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
