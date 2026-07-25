"use client";

import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { Job } from "@/types/job";
import { FormSection } from "@/components/admin/case-studies/forms/FormHelpers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface Props {
  register: UseFormRegister<Partial<Job>>;
  setValue: UseFormSetValue<Partial<Job>>;
  values: Partial<Job>;
}

export function JobPublishingTab({ register, setValue, values }: Props) {
  return (
    <FormSection title="Publishing" description="Workflow status and visibility.">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={values.status || "draft"}
            onChange={(e) => {
              setValue("status", e.target.value as Job["status"]);
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
            onChange={(e) =>
              setValue("visibility", e.target.value as Job["visibility"])
            }
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Publish date</Label>
          <Input type="datetime-local" {...register("publishAt")} />
        </div>
        <div className="space-y-2">
          <Label>Expiry date</Label>
          <Input type="datetime-local" {...register("expireAt")} />
        </div>
      </div>
    </FormSection>
  );
}
