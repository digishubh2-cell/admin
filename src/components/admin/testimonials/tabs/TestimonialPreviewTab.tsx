"use client";

import Image from "next/image";
import { Building2, Star, Video } from "lucide-react";
import type { Testimonial } from "@/types/testimonial";
import { getTestimonialTypeLabel } from "@/constants/testimonial";
import { hasVideo, renderStars } from "@/lib/testimonial/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeoScoreBadge, StatusBadge } from "@/components/ui/badge";

interface Props {
  values: Partial<Testimonial>;
  seoScore: number;
}

function TestimonialCard({ values, compact = false }: { values: Partial<Testimonial>; compact?: boolean }) {
  const review = values.review || {};
  const profileUrl = values.media?.profileImage?.url;
  const logoUrl = values.media?.companyLogo?.url;

  return (
    <div className={`rounded-2xl border border-admin-border bg-admin-surface ${compact ? "p-4" : "p-8"}`}>
      <div className="flex items-start gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-admin-muted">
          {profileUrl ? (
            <Image src={profileUrl} alt="" fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-lg font-semibold text-admin-text-muted">
              {values.fullName?.charAt(0) || "?"}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`font-semibold ${compact ? "text-base" : "text-lg"}`}>{values.fullName || "Name"}</h3>
            {values.featured && <Star className="h-4 w-4 fill-warning text-warning" />}
            {hasVideo(values) && <Video className="h-4 w-4 text-primary" />}
          </div>
          <p className="text-sm text-admin-text-muted">
            {[values.designation, values.companyName].filter(Boolean).join(" · ") || "Designation · Company"}
          </p>
          {values.settings?.showRating !== false && review.rating && (
            <p className="mt-1 text-sm text-warning">{renderStars(review.rating)}</p>
          )}
        </div>
        {values.settings?.showLogo !== false && logoUrl && (
          <div className="relative h-10 w-16 shrink-0">
            <Image src={logoUrl} alt="" fill className="object-contain" />
          </div>
        )}
      </div>

      {review.title && (
        <h4 className={`mt-4 font-medium ${compact ? "text-sm" : "text-base"}`}>{review.title}</h4>
      )}
      <p className={`mt-2 text-admin-text-secondary ${compact ? "text-sm line-clamp-3" : ""}`}>
        &ldquo;{review.shortReview || review.detailedReview || "Review content will appear here..."}&rdquo;
      </p>

      {values.settings?.showCompany !== false && values.companyName && (
        <div className="mt-4 flex items-center gap-2 text-xs text-admin-text-muted">
          <Building2 className="h-3.5 w-3.5" />
          {values.companyName}
        </div>
      )}
    </div>
  );
}

export function TestimonialPreviewTab({ values, seoScore }: Props) {
  const seo = values.seo || {};
  const displayTitle = seo.metaTitle || `${values.fullName} Review — ${values.companyName || "ShubhDigi Client"}`;
  const displayDesc = seo.metaDescription || values.review?.shortReview || "";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {values.status && <StatusBadge status={values.status} />}
        <SeoScoreBadge score={seoScore} />
        {values.reviewType && (
          <span className="rounded-full bg-admin-muted px-2 py-1 text-xs">
            {getTestimonialTypeLabel(values.reviewType)}
          </span>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-admin-text-muted">Desktop</p>
            <TestimonialCard values={values} />
          </div>
          <div className="mx-auto max-w-md">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-admin-text-muted">Mobile</p>
            <TestimonialCard values={values} compact />
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Google Preview</CardTitle></CardHeader>
            <CardContent>
              <p className="text-xs text-admin-text-muted">www.shubhdigi.in › testimonials › {values.slug}</p>
              <p className="mt-1 text-base text-[#1a0dab]">{displayTitle}</p>
              <p className="mt-1 text-sm text-admin-text-secondary line-clamp-3">{displayDesc}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Open Graph Preview</CardTitle></CardHeader>
            <CardContent>
              {(seo.ogImage || values.media?.profileImage?.url) && (
                <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg bg-admin-muted">
                  <Image
                    src={seo.ogImage || values.media?.profileImage?.url || ""}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="font-medium">{seo.ogTitle || displayTitle}</p>
              <p className="mt-1 text-sm text-admin-text-secondary line-clamp-2">
                {seo.ogDescription || displayDesc}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
