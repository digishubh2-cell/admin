"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { CaseStudy } from "@/types/case-study";
import { FormSection } from "../forms/FormHelpers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SeoScoreBadge } from "@/components/ui/badge";
import { SeoImageUploadField } from "@/components/admin/media/SeoImageUploadField";

interface Props {
  setValue: UseFormSetValue<Partial<CaseStudy>>;
  values: Partial<CaseStudy>;
  seoScore: number;
}

export function CaseStudyMetaSeoTab({ setValue, values, seoScore }: Props) {
  const seo = values.seo || {};

  const update = (patch: Partial<typeof seo>) => setValue("seo", { ...seo, ...patch });

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <FormSection title="SEO Metadata" description="Search engine and social sharing optimization.">
          <div className="flex items-center gap-2">
            <SeoScoreBadge score={seoScore} />
          </div>
          <div className="space-y-2"><Label>SEO Title</Label><Input value={seo.metaTitle || ""} onChange={(e) => update({ metaTitle: e.target.value })} maxLength={70} /></div>
          <div className="space-y-2"><Label>Meta Description</Label><textarea className="min-h-[80px] w-full rounded-md border border-admin-border px-3 py-2 text-sm" value={seo.metaDescription || ""} onChange={(e) => update({ metaDescription: e.target.value })} maxLength={160} /></div>
          <div className="space-y-2"><Label>Focus Keyword</Label><Input value={seo.focusKeyword || ""} onChange={(e) => update({ focusKeyword: e.target.value })} /></div>
          <div className="space-y-2"><Label>Secondary Keywords (comma-separated)</Label><Input value={seo.secondaryKeywords?.join(", ") || ""} onChange={(e) => update({ secondaryKeywords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></div>
          <div className="space-y-2"><Label>Canonical URL</Label><Input value={seo.canonicalUrl || values.canonicalUrl || ""} onChange={(e) => update({ canonicalUrl: e.target.value })} /></div>
          <div className="space-y-2"><Label>OG Title</Label><Input value={seo.ogTitle || ""} onChange={(e) => update({ ogTitle: e.target.value })} /></div>
          <div className="space-y-2"><Label>OG Description</Label><textarea className="min-h-[60px] w-full rounded-md border border-admin-border px-3 py-2 text-sm" value={seo.ogDescription || ""} onChange={(e) => update({ ogDescription: e.target.value })} /></div>
          <SeoImageUploadField
            retainAssets
            label="OG Image"
            folder="case-studies"
            url={seo.ogImage || null}
            onUrlChange={(url) => update({ ogImage: url })}
            hint="Optional override — backend uses featured image if empty"
          />
        </FormSection>
      </div>
      <FormSection title="Google Preview">
        <p className="text-sm font-medium text-[#1a0dab]">{seo.metaTitle || values.projectName}</p>
        <p className="mt-1 text-xs text-admin-text-muted">www.shubhdigi.in › case-studies › {values.slug}</p>
        <p className="mt-2 text-xs text-[#4d5156]">{seo.metaDescription || values.shortSummary}</p>
      </FormSection>
    </div>
  );
}
