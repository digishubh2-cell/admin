"use client";

import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { CaseStudy } from "@/types/case-study";
import {
  CASE_STUDY_CATEGORIES,
  CASE_STUDY_INDUSTRIES,
  CASE_STUDY_PROJECT_TYPES,
} from "@/types/case-study";
import { FormSection } from "../forms/FormHelpers";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  register: UseFormRegister<Partial<CaseStudy>>;
  setValue: UseFormSetValue<Partial<CaseStudy>>;
  values: Partial<CaseStudy>;
  autoSlug: boolean;
  setAutoSlug: (v: boolean) => void;
}

export function CaseStudyOverviewTab({ register, setValue, values, autoSlug, setAutoSlug }: Props) {
  return (
    <div className="grid gap-4">
      <FormSection title="Project Overview" description="Core identity and classification for this case study.">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="projectName">Project Name *</Label>
            <Input id="projectName" {...register("projectName", { required: true })} placeholder="FinEdge Organic Growth Platform" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug">Slug</Label>
              <label className="flex items-center gap-2 text-xs text-admin-text-muted">
                <Checkbox checked={autoSlug} onCheckedChange={(c) => setAutoSlug(c === true)} />
                Auto-generate
              </label>
            </div>
            <Input id="slug" {...register("slug")} disabled={autoSlug} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input id="clientName" {...register("clientName")} />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="shortSummary">Short Summary</Label>
            <Textarea id="shortSummary" rows={3} {...register("shortSummary")} placeholder="One-paragraph executive summary of the project outcome." />
          </div>
          <div className="space-y-2">
            <Label>Industry</Label>
            <select className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm" value={values.industry || ""} onChange={(e) => setValue("industry", e.target.value)}>
              <option value="">Select industry</option>
              {CASE_STUDY_INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <select className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm" value={values.category || ""} onChange={(e) => setValue("category", e.target.value)}>
              <option value="">Select category</option>
              {CASE_STUDY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Project Type</Label>
            <select className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm" value={values.projectType || ""} onChange={(e) => setValue("projectType", e.target.value)}>
              <option value="">Select type</option>
              {CASE_STUDY_PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Input id="priority" type="number" {...register("priority", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="liveUrl">Live URL</Label>
            <Input id="liveUrl" {...register("liveUrl")} placeholder="https://" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectUrl">Project URL</Label>
            <Input id="projectUrl" {...register("projectUrl")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub (optional)</Label>
            <Input id="githubUrl" {...register("githubUrl")} />
          </div>
          <div className="flex flex-wrap gap-6 lg:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={!!values.featured} onCheckedChange={(c) => setValue("featured", c === true)} />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={!!values.sticky} onCheckedChange={(c) => setValue("sticky", c === true)} />
              Sticky
            </label>
          </div>
        </div>
      </FormSection>
    </div>
  );
}
