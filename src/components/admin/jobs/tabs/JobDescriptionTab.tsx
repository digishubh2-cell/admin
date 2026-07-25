"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { Job } from "@/types/job";
import {
  FormSection,
  TextAreaField,
} from "@/components/admin/case-studies/forms/FormHelpers";

interface Props {
  setValue: UseFormSetValue<Partial<Job>>;
  values: Partial<Job>;
}

export function JobDescriptionTab({ setValue, values }: Props) {
  return (
    <FormSection
      title="Description"
      description="Role narrative shown on the public careers page."
    >
      <TextAreaField
        label="Full description"
        value={values.description}
        onChange={(v) => setValue("description", v)}
        rows={14}
        placeholder="Describe the role, team, and impact..."
      />
    </FormSection>
  );
}
