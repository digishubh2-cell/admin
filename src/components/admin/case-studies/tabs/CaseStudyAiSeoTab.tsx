"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { CaseStudy } from "@/types/case-study";
import { FormSection, TextAreaField } from "../forms/FormHelpers";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  setValue: UseFormSetValue<Partial<CaseStudy>>;
  values: Partial<CaseStudy>;
}

export function CaseStudyAiSeoTab({ setValue, values }: Props) {
  const ai = values.aiSeo || {};
  const update = (patch: Partial<typeof ai>) => setValue("aiSeo", { ...ai, ...patch });

  return (
    <FormSection title="LLM SEO" description="AI search optimization and citation-ready summaries.">
      <TextAreaField label="AI Summary" value={ai.summary} onChange={(v) => update({ summary: v })} />
      <TextAreaField label="Executive Summary" value={ai.executiveSummary} onChange={(v) => update({ executiveSummary: v })} />
      <TextAreaField label="Business Outcome" value={ai.businessOutcome} onChange={(v) => update({ businessOutcome: v })} />
      <TextAreaField label="Key Learnings (one per line)" value={ai.keyLearnings?.join("\n")} onChange={(v) => update({ keyLearnings: v.split("\n").filter(Boolean) })} />
      <TextAreaField label="Technical Highlights (one per line)" value={ai.technicalHighlights?.join("\n")} onChange={(v) => update({ technicalHighlights: v.split("\n").filter(Boolean) })} />
      <TextAreaField label="Semantic Keywords (one per line)" value={ai.semanticKeywords?.join("\n")} onChange={(v) => update({ semanticKeywords: v.split("\n").filter(Boolean) })} />
      <div className="space-y-2"><Label>Knowledge Graph</Label><Input value={ai.knowledgeGraph || ""} onChange={(e) => update({ knowledgeGraph: e.target.value })} /></div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={!!ai.citationReady} onCheckedChange={(c) => update({ citationReady: c === true })} />
        Citation ready for AI search
      </label>
    </FormSection>
  );
}
