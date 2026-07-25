"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { Resource } from "@/types/resource";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeoScoreBadge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SeoImageUploadField } from "@/components/admin/media/SeoImageUploadField";

interface Props {
  setValue: UseFormSetValue<Partial<Resource>>;
  values: Partial<Resource>;
  seoScore: number;
}

export function ResourceSeoTab({ setValue, values, seoScore }: Props) {
  const seo = values.seo || {};

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>On-Page SEO</CardTitle>
            <SeoScoreBadge score={seoScore} />
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2 lg:col-span-2">
              <Label>SEO Title</Label>
              <Input
                defaultValue={seo.metaTitle || values.title || ""}
                onChange={(e) => setValue("seo", { ...seo, metaTitle: e.target.value })}
              />
              <p className="text-xs text-admin-text-muted">{(seo.metaTitle || values.title || "").length}/70</p>
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label>Meta Description</Label>
              <Textarea
                rows={3}
                defaultValue={seo.metaDescription || values.shortDescription || ""}
                onChange={(e) => setValue("seo", { ...seo, metaDescription: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Focus Keyword</Label>
              <Input
                defaultValue={seo.focusKeyword || ""}
                onChange={(e) => setValue("seo", { ...seo, focusKeyword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Robots</Label>
              <Input
                defaultValue={seo.robots || "index,follow"}
                onChange={(e) => setValue("seo", { ...seo, robots: e.target.value })}
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label>Secondary Keywords (comma separated)</Label>
              <Input
                defaultValue={seo.secondaryKeywords?.join(", ") || ""}
                onChange={(e) =>
                  setValue("seo", {
                    ...seo,
                    secondaryKeywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean),
                  })
                }
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label>Canonical URL</Label>
              <Input
                defaultValue={seo.canonicalUrl || values.canonicalUrl || ""}
                onChange={(e) => setValue("seo", { ...seo, canonicalUrl: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Open Graph &amp; Twitter</CardTitle></CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <Label>OG Title</Label>
              <Input defaultValue={seo.ogTitle || ""} onChange={(e) => setValue("seo", { ...seo, ogTitle: e.target.value })} />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label>OG Description</Label>
              <Textarea rows={2} defaultValue={seo.ogDescription || ""} onChange={(e) => setValue("seo", { ...seo, ogDescription: e.target.value })} />
            </div>
            <div className="lg:col-span-2">
              <SeoImageUploadField
                label="OG Image"
                folder="resources"
                url={seo.ogImage || null}
                onUrlChange={(url) => setValue("seo", { ...seo, ogImage: url })}
              />
            </div>
            <div className="space-y-2">
              <Label>Twitter Title</Label>
              <Input defaultValue={seo.twitterTitle || ""} onChange={(e) => setValue("seo", { ...seo, twitterTitle: e.target.value })} />
            </div>
            <div className="lg:col-span-2">
              <SeoImageUploadField
                label="Twitter Image"
                folder="resources"
                url={seo.twitterImage || null}
                onUrlChange={(url) => setValue("seo", { ...seo, twitterImage: url })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Internal &amp; Related Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>SEO Internal Links (one per line)</Label>
              <Textarea
                rows={3}
                defaultValue={seo.internalLinks?.join("\n") || ""}
                onChange={(e) =>
                  setValue("seo", {
                    ...seo,
                    internalLinks: e.target.value.split("\n").map((l) => l.trim()).filter(Boolean),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>External Links (one per line)</Label>
              <Textarea
                rows={3}
                defaultValue={seo.externalLinks?.join("\n") || ""}
                onChange={(e) =>
                  setValue("seo", {
                    ...seo,
                    externalLinks: e.target.value.split("\n").map((l) => l.trim()).filter(Boolean),
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Google Preview</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-1 rounded-xl border border-admin-border p-4">
            <p className="text-xs text-admin-text-muted">www.shubhdigi.in › resources › {values.slug || "slug"}</p>
            <p className="text-lg text-[#1a0dab]">{seo.metaTitle || values.title || "Resource Title"}</p>
            <p className="text-sm text-admin-text-secondary line-clamp-2">
              {seo.metaDescription || values.shortDescription || "Meta description preview..."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
