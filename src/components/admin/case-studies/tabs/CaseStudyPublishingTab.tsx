"use client";

import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { CaseStudy } from "@/types/case-study";
import { FormSection } from "../forms/FormHelpers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  register: UseFormRegister<Partial<CaseStudy>>;
  setValue: UseFormSetValue<Partial<CaseStudy>>;
  values: Partial<CaseStudy>;
}

export function CaseStudyPublishingTab({ register, setValue, values }: Props) {
  return (
    <FormSection title="Publishing" description="Workflow status and visibility.">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={values.status || "draft"} onChange={(e) => { setValue("status", e.target.value as CaseStudy["status"]); setValue("workflowStatus", e.target.value); }}>
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
          <Select value={values.visibility || "public"} onChange={(e) => setValue("visibility", e.target.value as CaseStudy["visibility"])}>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="password">Password Protected</option>
          </Select>
        </div>
        <div className="space-y-2"><Label>Publish Date</Label><Input type="datetime-local" {...register("publishAt")} /></div>
        <div className="space-y-2"><Label>Expiry Date</Label><Input type="datetime-local" {...register("expireAt")} /></div>
      </div>
    </FormSection>
  );
}

export function CaseStudySettingsTab({ setValue, values }: { setValue: UseFormSetValue<Partial<CaseStudy>>; values: Partial<CaseStudy> }) {
  const s = values.settings || {};
  const update = (patch: Partial<typeof s>) => setValue("settings", { ...s, ...patch });

  return (
    <FormSection title="Display Settings">
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["enableIndexing", "Enable indexing"],
          ["enableLeadForm", "Enable lead form"],
          ["enableCta", "Enable CTA"],
          ["enableRelatedProjects", "Show related projects"],
          ["enableNewsletter", "Enable newsletter"],
          ["showAuthor", "Show author"],
          ["showTimeline", "Show timeline"],
          ["showTechnologies", "Show technologies"],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <Checkbox checked={!!s[key as keyof typeof s]} onCheckedChange={(c) => update({ [key]: c === true })} />
            {label}
          </label>
        ))}
      </div>
    </FormSection>
  );
}

export function CaseStudySchemaTab({ setValue, values }: { setValue: UseFormSetValue<Partial<CaseStudy>>; values: Partial<CaseStudy> }) {
  const schema = values.schema || {};
  return (
    <FormSection title="JSON-LD Schema" description="Structured data for rich results.">
      <div className="space-y-2">
        <Label>Schema Types (comma-separated)</Label>
        <Input value={schema.types?.join(", ") || ""} onChange={(e) => setValue("schema", { ...schema, types: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
      </div>
      <div className="space-y-2">
        <Label>JSON-LD</Label>
        <textarea className="min-h-[320px] w-full rounded-xl border border-admin-border bg-admin-muted/30 px-4 py-3 font-mono text-xs" value={schema.jsonLd || ""} onChange={(e) => setValue("schema", { ...schema, jsonLd: e.target.value })} placeholder="Auto-generated on publish or paste custom JSON-LD" />
      </div>
    </FormSection>
  );
}
