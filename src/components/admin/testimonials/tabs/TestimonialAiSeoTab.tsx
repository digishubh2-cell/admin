"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { Testimonial } from "@/types/testimonial";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  setValue: UseFormSetValue<Partial<Testimonial>>;
  values: Partial<Testimonial>;
}

function ListField({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea
        rows={3}
        placeholder={placeholder}
        defaultValue={items.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
      />
    </div>
  );
}

export function TestimonialAiSeoTab({ setValue, values }: Props) {
  const ai = values.aiSeo || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>LLM SEO &amp; AI Discoverability</CardTitle>
        <p className="text-sm text-admin-text-muted">
          Optimize testimonials for AI answer engines, knowledge graphs, and citation-ready trust signals.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 lg:col-span-2">
          <Label>Executive Summary</Label>
          <Textarea
            rows={3}
            defaultValue={ai.executiveSummary || ""}
            onChange={(e) => setValue("aiSeo", { ...ai, executiveSummary: e.target.value })}
            placeholder="High-level summary for AI systems and executives..."
          />
        </div>
        <div className="space-y-2 lg:col-span-2">
          <Label>AI Summary</Label>
          <Textarea
            rows={3}
            defaultValue={ai.summary || ""}
            onChange={(e) => setValue("aiSeo", { ...ai, summary: e.target.value })}
          />
        </div>
        <ListField
          label="Key Benefits (one per line)"
          items={ai.keyBenefits || []}
          onChange={(items) => setValue("aiSeo", { ...ai, keyBenefits: items })}
        />
        <ListField
          label="Questions Answered (one per line)"
          items={ai.questionsAnswered || []}
          onChange={(items) => setValue("aiSeo", { ...ai, questionsAnswered: items })}
          placeholder="Why choose ShubhDigi for web development?"
        />
        <ListField
          label="Semantic Keywords (one per line)"
          items={ai.semanticKeywords || []}
          onChange={(items) => setValue("aiSeo", { ...ai, semanticKeywords: items })}
        />
        <ListField
          label="Entities (one per line)"
          items={ai.entities || []}
          onChange={(items) => setValue("aiSeo", { ...ai, entities: items })}
        />
        <div className="space-y-2 lg:col-span-2">
          <Label>Citation-Ready Summary</Label>
          <Textarea
            rows={4}
            defaultValue={ai.citationReadySummary || ""}
            onChange={(e) => setValue("aiSeo", { ...ai, citationReadySummary: e.target.value })}
            placeholder="A concise, factual statement AI systems can cite directly..."
          />
        </div>
        <label className="flex items-center gap-2 text-sm lg:col-span-2">
          <Checkbox
            checked={!!ai.citationReady}
            onCheckedChange={(c) => setValue("aiSeo", { ...ai, citationReady: c === true })}
          />
          Mark as citation-ready for AI answer engines
        </label>
      </CardContent>
    </Card>
  );
}
