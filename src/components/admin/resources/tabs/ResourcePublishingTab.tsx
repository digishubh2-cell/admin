"use client";

import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { Resource } from "@/types/resource";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface Props {
  register: UseFormRegister<Partial<Resource>>;
  setValue: UseFormSetValue<Partial<Resource>>;
  values: Partial<Resource>;
}

export function ResourcePublishingTab({ register, setValue, values }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Publishing</CardTitle>
        <p className="text-sm text-admin-text-muted">Workflow status, scheduling, and visibility.</p>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={values.status || "draft"}
            onChange={(e) => {
              setValue("status", e.target.value as Resource["status"]);
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
            onChange={(e) => setValue("visibility", e.target.value as Resource["visibility"])}
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
      </CardContent>
    </Card>
  );
}

export function ResourceSettingsTab({
  setValue,
  values,
}: {
  setValue: UseFormSetValue<Partial<Resource>>;
  values: Partial<Resource>;
}) {
  const s = values.settings || {};
  const update = (patch: Partial<typeof s>) => setValue("settings", { ...s, ...patch });

  return (
    <Card>
      <CardHeader><CardTitle>Display &amp; Behavior Settings</CardTitle></CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["enableIndexing", "Enable search indexing"],
            ["enableDownload", "Enable downloads"],
            ["enableLeadForm", "Enable lead form gating"],
            ["enableCta", "Enable CTA"],
            ["enableRelatedResources", "Show related resources"],
            ["enableNewsletter", "Enable newsletter signup"],
            ["showAuthor", "Show author"],
            ["showToc", "Show table of contents"],
            ["showUpdatedDate", "Show updated date"],
            ["allowSharing", "Allow social sharing"],
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

export function ResourceSchemaTab({
  setValue,
  values,
}: {
  setValue: UseFormSetValue<Partial<Resource>>;
  values: Partial<Resource>;
}) {
  const schema = values.schema || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>JSON-LD Schema</CardTitle>
        <p className="text-sm text-admin-text-muted">
          Article, TechArticle, HowTo, FAQ, SoftwareApplication, Service, Organization, Breadcrumb
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Schema Types (comma-separated)</Label>
          <Input
            value={schema.types?.join(", ") || ""}
            onChange={(e) =>
              setValue("schema", {
                ...schema,
                types: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>JSON-LD (auto-generated on save)</Label>
          <textarea
            className="min-h-[320px] w-full rounded-xl border border-admin-border bg-admin-muted/30 px-4 py-3 font-mono text-xs"
            value={schema.jsonLd || ""}
            onChange={(e) => setValue("schema", { ...schema, jsonLd: e.target.value })}
            placeholder="Auto-generated JSON-LD on publish"
          />
        </div>
      </CardContent>
    </Card>
  );
}
