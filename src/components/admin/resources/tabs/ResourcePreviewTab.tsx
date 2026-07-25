"use client";

import Image from "next/image";
import { Clock, Download, User } from "lucide-react";
import type { Resource } from "@/types/resource";
import { getResourceTypeLabel } from "@/constants/resource";
import { MarkdownContent } from "@/components/common/MarkdownContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeoScoreBadge, StatusBadge } from "@/components/ui/badge";

interface Props {
  values: Partial<Resource>;
  seoScore: number;
  readTime: number;
}

export function ResourcePreviewTab({ values, seoScore, readTime }: Props) {
  const hasContent = Boolean(values.content?.trim());

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="flex flex-wrap items-center gap-2 lg:col-span-3">
        {values.status && <StatusBadge status={values.status} />}
        <SeoScoreBadge score={seoScore} />
        <span className="text-xs text-admin-text-muted">{readTime} min read</span>
        {values.downloads?.length ? (
          <span className="text-xs text-admin-text-muted">{values.downloads.length} downloads</span>
        ) : null}
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-0">
            {values.media?.heroImage?.url && (
              <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-admin-muted">
                <Image src={values.media.heroImage.url} alt="" fill className="object-cover" />
              </div>
            )}
            <div className="p-8">
              <div className="mb-4 flex flex-wrap gap-2 text-xs text-admin-text-muted">
                {values.type && <span className="rounded-full bg-admin-muted px-2 py-1">{getResourceTypeLabel(values.type)}</span>}
                {values.category && <span className="rounded-full bg-admin-muted px-2 py-1">{values.category}</span>}
                {values.difficulty && <span className="rounded-full bg-admin-muted px-2 py-1 capitalize">{values.difficulty}</span>}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">{values.title || "Untitled Resource"}</h1>
              {values.shortDescription && (
                <p className="mt-3 text-lg text-admin-text-secondary">{values.shortDescription}</p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-admin-text-muted">
                {values.authorName && (
                  <span className="flex items-center gap-1"><User className="h-4 w-4" />{values.authorName}</span>
                )}
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{readTime} min read</span>
              </div>
              {hasContent ? (
                <div className="blog-prose mt-8 max-w-none">
                  <MarkdownContent content={values.content || ""} />
                </div>
              ) : (
                <p className="mt-8 text-admin-text-muted">No content yet.</p>
              )}
              {values.downloads && values.downloads.length > 0 && (
                <div className="mt-8 space-y-2">
                  <h3 className="font-medium">Downloads</h3>
                  {values.downloads.map((dl, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg border border-admin-border px-3 py-2 text-sm">
                      <Download className="h-4 w-4 text-primary" />
                      <span>{dl.title}</span>
                      {dl.fileSize && <span className="text-admin-text-muted">({dl.fileSize})</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle>SEO Preview</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xs text-admin-text-muted">www.shubhdigi.in › resources › {values.slug}</p>
            <p className="mt-1 text-base text-[#1a0dab]">{values.seo?.metaTitle || values.title}</p>
            <p className="mt-1 text-sm text-admin-text-secondary line-clamp-3">
              {values.seo?.metaDescription || values.shortDescription}
            </p>
          </CardContent>
        </Card>
        {values.tableOfContents && values.tableOfContents.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Table of Contents</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              {values.tableOfContents.map((item, i) => (
                <p key={i} style={{ paddingLeft: `${(item.level - 2) * 12}px` }} className="text-admin-text-secondary">
                  {item.text}
                </p>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
