"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { Resource } from "@/types/resource";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  setValue: UseFormSetValue<Partial<Resource>>;
  values: Partial<Resource>;
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

export function ResourceAiSeoTab({ setValue, values }: Props) {
  const ai = values.aiSeo || {};

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>LLM SEO &amp; AI Discoverability</CardTitle>
          <p className="text-sm text-admin-text-muted">
            Optimize for AI answer engines, knowledge graphs, and citation-ready content.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2 lg:col-span-2">
            <Label>AI Summary</Label>
            <Textarea
              rows={3}
              defaultValue={ai.summary || ""}
              onChange={(e) => setValue("aiSeo", { ...ai, summary: e.target.value })}
            />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label>Executive Summary</Label>
            <Textarea
              rows={3}
              defaultValue={ai.executiveSummary || ""}
              onChange={(e) => setValue("aiSeo", { ...ai, executiveSummary: e.target.value })}
            />
          </div>
          <ListField
            label="Key Takeaways (one per line)"
            items={ai.keyTakeaways || []}
            onChange={(items) => setValue("aiSeo", { ...ai, keyTakeaways: items })}
          />
          <ListField
            label="Questions Answered (one per line)"
            items={ai.questionsAnswered || []}
            onChange={(items) => setValue("aiSeo", { ...ai, questionsAnswered: items })}
          />
          <ListField
            label="Entities (one per line)"
            items={ai.entities || []}
            onChange={(items) => setValue("aiSeo", { ...ai, entities: items })}
          />
          <ListField
            label="Semantic Keywords (one per line)"
            items={ai.semanticKeywords || []}
            onChange={(items) => setValue("aiSeo", { ...ai, semanticKeywords: items })}
          />
          <div className="space-y-2 lg:col-span-2">
            <Label>Knowledge Graph</Label>
            <Input
              defaultValue={ai.knowledgeGraph || ""}
              onChange={(e) => setValue("aiSeo", { ...ai, knowledgeGraph: e.target.value })}
              placeholder="ShubhDigi → SEO Resources → Technical SEO Guide"
            />
          </div>
          <label className="flex items-center gap-2 text-sm lg:col-span-2">
            <Checkbox
              checked={!!ai.citationReady}
              onCheckedChange={(c) => setValue("aiSeo", { ...ai, citationReady: c === true })}
            />
            Citation-ready structure for AI answer engines
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
