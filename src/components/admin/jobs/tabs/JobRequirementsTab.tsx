"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { Job } from "@/types/job";
import {
  FormSection,
  StringListEditor,
} from "@/components/admin/case-studies/forms/FormHelpers";

interface Props {
  setValue: UseFormSetValue<Partial<Job>>;
  values: Partial<Job>;
}

export function JobRequirementsTab({ setValue, values }: Props) {
  return (
    <div className="grid gap-4">
      <FormSection title="Requirements">
        <StringListEditor
          label="Requirements"
          items={values.requirements || []}
          onChange={(items) => setValue("requirements", items)}
          placeholder="Add a requirement..."
        />
      </FormSection>
      <FormSection title="Responsibilities">
        <StringListEditor
          label="Responsibilities"
          items={values.responsibilities || []}
          onChange={(items) => setValue("responsibilities", items)}
          placeholder="Add a responsibility..."
        />
      </FormSection>
      <FormSection title="Benefits">
        <StringListEditor
          label="Benefits"
          items={values.benefits || []}
          onChange={(items) => setValue("benefits", items)}
          placeholder="Add a benefit..."
        />
      </FormSection>
      <FormSection title="Skills">
        <StringListEditor
          label="Skills"
          items={values.skills || []}
          onChange={(items) => setValue("skills", items)}
          placeholder="Add a skill..."
        />
      </FormSection>
    </div>
  );
}
