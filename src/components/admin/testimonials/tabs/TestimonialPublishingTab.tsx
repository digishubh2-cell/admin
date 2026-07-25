"use client";

import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { Testimonial } from "@/types/testimonial";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface Props {
  register: UseFormRegister<Partial<Testimonial>>;
  setValue: UseFormSetValue<Partial<Testimonial>>;
  values: Partial<Testimonial>;
}

export function TestimonialPublishingTab({ register, setValue, values }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Publishing</CardTitle>
        <p className="text-sm text-admin-text-muted">Workflow status, scheduling, and visibility controls.</p>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={values.status || "draft"}
            onChange={(e) => {
              setValue("status", e.target.value as Testimonial["status"]);
              setValue("workflowStatus", e.target.value);
            }}
          >
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="approved">Approved</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Visibility</Label>
          <Select
            value={values.visibility || "public"}
            onChange={(e) => setValue("visibility", e.target.value as Testimonial["visibility"])}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="password">Password Protected</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Publish Date</Label>
          <Input type="datetime-local" {...register("publishAt")} />
        </div>
        <div className="space-y-2">
          <Label>Expiry Date</Label>
          <Input type="datetime-local" {...register("expireAt")} />
        </div>
        {values.version && (
          <div className="space-y-2">
            <Label>Version</Label>
            <p className="text-sm text-admin-text-muted">v{values.version} — revision history tracked automatically</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function TestimonialSettingsTab({
  setValue,
  values,
}: {
  setValue: UseFormSetValue<Partial<Testimonial>>;
  values: Partial<Testimonial>;
}) {
  const s = values.settings || {};
  const update = (patch: Partial<typeof s>) => setValue("settings", { ...s, ...patch });

  return (
    <Card>
      <CardHeader><CardTitle>Display &amp; Behavior Settings</CardTitle></CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["showRating", "Show rating stars"],
            ["showCompany", "Show company name"],
            ["showLogo", "Show company logo"],
            ["showVideo", "Show video player"],
            ["enableIndexing", "Enable search indexing"],
            ["enableCta", "Enable CTA button"],
            ["enableSocialShare", "Enable social sharing"],
            ["enableRelatedTestimonials", "Show related testimonials"],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={!!s[key as keyof typeof s]}
                onCheckedChange={(c) => update({ [key]: c === true })}
              />
              {label}
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TestimonialSchemaTab({ values }: { values: Partial<Testimonial> }) {
  const schemaTypes = values.schema?.types || ["Review", "Person", "Organization", "BreadcrumbList"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Structured Data (JSON-LD)</CardTitle>
        <p className="text-sm text-admin-text-muted">
          Auto-generated schema: Review, Person, Organization, LocalBusiness, Service, FAQ, Breadcrumb.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {schemaTypes.map((type) => (
            <span key={type} className="rounded-full bg-admin-muted px-3 py-1 text-xs font-medium">
              {type}
            </span>
          ))}
        </div>
        <pre className="max-h-96 overflow-auto rounded-xl border border-admin-border bg-admin-muted/30 p-4 text-xs">
          {values.schema?.jsonLd
            ? JSON.stringify(JSON.parse(values.schema.jsonLd), null, 2)
            : "// Schema will be auto-generated on save"}
        </pre>
      </CardContent>
    </Card>
  );
}
