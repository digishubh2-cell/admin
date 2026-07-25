"use client";

import type { UseFormRegister } from "react-hook-form";
import type { CaseStudy } from "@/types/case-study";
import { FormSection } from "../forms/FormHelpers";

interface Props {
  register: UseFormRegister<Partial<CaseStudy>>;
}

export function CaseStudyContentTab({ register }: Props) {
  return (
    <FormSection title="Full Case Study Story" description="Markdown narrative — problem to solution to results.">
      <textarea
        className="min-h-[480px] w-full rounded-xl border border-admin-border bg-transparent px-4 py-3 font-mono text-sm leading-relaxed"
        placeholder="Write the complete case study narrative in Markdown..."
        {...register("content")}
      />
    </FormSection>
  );
}
