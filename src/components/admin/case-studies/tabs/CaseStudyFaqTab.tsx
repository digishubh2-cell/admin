"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { CaseStudy } from "@/types/case-study";
import { FormSection } from "../forms/FormHelpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface Props {
  setValue: UseFormSetValue<Partial<CaseStudy>>;
  values: Partial<CaseStudy>;
}

export function CaseStudyFaqTab({ setValue, values }: Props) {
  const faq = values.faq || [];

  return (
    <FormSection title="FAQ" description="5–15 SEO-friendly questions for schema and LLM visibility.">
      {faq.map((item, i) => (
        <div key={i} className="space-y-2 rounded-xl border border-admin-border p-4">
          <div className="flex gap-2">
            <Input className="flex-1" placeholder="Question" value={item.question} onChange={(e) => { const n = [...faq]; n[i] = { ...item, question: e.target.value }; setValue("faq", n); }} />
            <Button type="button" variant="ghost" size="icon" onClick={() => setValue("faq", faq.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
          </div>
          <textarea className="min-h-[80px] w-full rounded-md border border-admin-border bg-transparent px-3 py-2 text-sm" placeholder="Answer" value={item.answer} onChange={(e) => { const n = [...faq]; n[i] = { ...item, answer: e.target.value }; setValue("faq", n); }} />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => setValue("faq", [...faq, { question: "", answer: "" }])}>
        <Plus className="h-4 w-4" /> Add FAQ
      </Button>
    </FormSection>
  );
}
