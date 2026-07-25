"use client";

import Image from "next/image";
import type { CaseStudy } from "@/types/case-study";
import { MarkdownContent } from "@/components/common/MarkdownContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeoScoreBadge } from "@/components/ui/badge";

interface Props {
  values: Partial<CaseStudy>;
  seoScore: number;
  readTime: number;
}

export function CaseStudyPreviewTab({ values, seoScore, readTime }: Props) {
  const image = values.media?.featuredImage?.url;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardContent className="p-0">
          {image && (
            <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-t-xl">
              <Image src={image} alt={values.media?.featuredImage?.alt || ""} fill className="object-cover" sizes="800px" />
            </div>
          )}
          <div className="p-8">
            <span className="rounded-full bg-electric/10 px-3 py-1 text-xs font-medium text-electric">
              {values.industry} · {values.category}
            </span>
            <h1 className="mt-4 text-3xl font-bold">{values.projectName || "Untitled Case Study"}</h1>
            <p className="mt-2 text-lg text-slate-600">{values.shortSummary}</p>
            <p className="mt-4 text-sm text-admin-text-muted">
              Client: {values.clientName || "—"} · {readTime} min read
            </p>
            {values.content ? (
              <div className="mt-8 border-t pt-8">
                <MarkdownContent content={values.content} />
              </div>
            ) : (
              <p className="mt-8 text-sm italic text-muted">Add content in the Story tab.</p>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle>SEO Preview</CardTitle></CardHeader>
          <CardContent>
            <SeoScoreBadge score={seoScore} />
            <p className="mt-3 text-sm font-medium text-[#1a0dab]">{values.seo?.metaTitle || values.projectName}</p>
            <p className="mt-1 text-xs text-admin-text-muted">www.shubhdigi.in › case-studies › {values.slug}</p>
          </CardContent>
        </Card>
        {values.results?.metrics && values.results.metrics.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Key Results</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {values.results.metrics.slice(0, 4).map((m) => (
                <div key={m.label} className="flex justify-between border-b border-admin-border/60 py-2 last:border-0">
                  <span>{m.label}</span>
                  <span className="font-semibold text-success">{m.change || m.after}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
