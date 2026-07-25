"use client";

import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { Job } from "@/types/job";
import { JOB_CATEGORIES, JOB_DEPARTMENTS } from "@/types/job";
import { FormSection } from "@/components/admin/case-studies/forms/FormHelpers";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  register: UseFormRegister<Partial<Job>>;
  setValue: UseFormSetValue<Partial<Job>>;
  values: Partial<Job>;
  autoSlug: boolean;
  setAutoSlug: (v: boolean) => void;
}

export function JobOverviewTab({
  register,
  setValue,
  values,
  autoSlug,
  setAutoSlug,
}: Props) {
  return (
    <div className="grid gap-4">
      <FormSection
        title="Role overview"
        description="Core identity for this job or internship posting."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register("title", { required: true })}
              placeholder="Full Stack Engineer"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug">Slug</Label>
              <label className="flex items-center gap-2 text-xs text-admin-text-muted">
                <Checkbox
                  checked={autoSlug}
                  onCheckedChange={(c) => setAutoSlug(c === true)}
                />
                Auto-generate
              </label>
            </div>
            <Input id="slug" {...register("slug")} disabled={autoSlug} />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <select
              className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
              value={values.type || "job"}
              onChange={(e) => setValue("type", e.target.value as Job["type"])}
            >
              <option value="job">Job</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <select
              className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
              value={values.department || ""}
              onChange={(e) => setValue("department", e.target.value)}
            >
              <option value="">Select department</option>
              {JOB_DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <select
              className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
              value={values.category || ""}
              onChange={(e) => setValue("category", e.target.value)}
            >
              <option value="">Select category</option>
              {JOB_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location")} placeholder="Indore / Hybrid" />
          </div>
          <div className="space-y-2">
            <Label>Employment type</Label>
            <select
              className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
              value={values.employmentType || "full-time"}
              onChange={(e) =>
                setValue("employmentType", e.target.value as Job["employmentType"])
              }
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="temporary">Temporary</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Mode</Label>
            <select
              className="flex h-10 w-full rounded-md border border-admin-border bg-transparent px-3 text-sm"
              value={values.mode || "hybrid"}
              onChange={(e) => setValue("mode", e.target.value as Job["mode"])}
            >
              <option value="hybrid">Hybrid</option>
              <option value="remote">Remote</option>
              <option value="onsite">Onsite</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Input
              id="priority"
              type="number"
              {...register("priority", { valueAsNumber: true })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm lg:col-span-2">
            <Checkbox
              checked={!!values.featured}
              onCheckedChange={(c) => setValue("featured", c === true)}
            />
            Featured on careers hub
          </label>
        </div>
      </FormSection>

      {values.type === "internship" ? (
        <FormSection title="Internship details">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" {...register("duration")} placeholder="3–6 months" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stipend">Stipend</Label>
              <Input
                id="stipend"
                {...register("stipend")}
                placeholder="Performance-based stipend"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="programLabel">Program label</Label>
              <Input
                id="programLabel"
                {...register("programLabel")}
                placeholder="Student Build Program"
              />
            </div>
          </div>
        </FormSection>
      ) : null}
    </div>
  );
}
