"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { BlogPost } from "@/types/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  setValue: UseFormSetValue<Partial<BlogPost>>;
  values: Partial<BlogPost>;
}

export function BlogAiSeoTab({ setValue, values }: Props) {
  const ai = values.aiSeo || {};

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>LLM &amp; AI SEO</CardTitle>
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
            <Label>LLM-Friendly Summary</Label>
            <Textarea
              rows={3}
              defaultValue={ai.llmSummary || ""}
              onChange={(e) => setValue("aiSeo", { ...ai, llmSummary: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Topic Cluster</Label>
            <Input
              defaultValue={ai.topicCluster || ""}
              onChange={(e) => setValue("aiSeo", { ...ai, topicCluster: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Knowledge Graph</Label>
            <Input
              defaultValue={ai.knowledgeGraph || ""}
              onChange={(e) => setValue("aiSeo", { ...ai, knowledgeGraph: e.target.value })}
            />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label>Key Takeaways (one per line)</Label>
            <Textarea
              rows={4}
              defaultValue={ai.keyTakeaways?.join("\n") || ""}
              onChange={(e) =>
                setValue("aiSeo", {
                  ...ai,
                  keyTakeaways: e.target.value.split("\n").filter(Boolean),
                })
              }
            />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label>Semantic Keywords (comma separated)</Label>
            <Input
              defaultValue={ai.semanticKeywords?.join(", ") || ""}
              onChange={(e) =>
                setValue("aiSeo", {
                  ...ai,
                  semanticKeywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean),
                })
              }
            />
          </div>
          <label className="flex items-center gap-2 text-sm lg:col-span-2">
            <Checkbox
              checked={!!ai.citationReady}
              onCheckedChange={(c) => setValue("aiSeo", { ...ai, citationReady: c === true })}
            />
            AI Citation Ready
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
