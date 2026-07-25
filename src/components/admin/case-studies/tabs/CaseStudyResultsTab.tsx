"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { CaseStudy, CaseStudyMetric } from "@/types/case-study";
import { FormSection, TextAreaField } from "../forms/FormHelpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface Props {
  setValue: UseFormSetValue<Partial<CaseStudy>>;
  values: Partial<CaseStudy>;
}

export function CaseStudyResultsTab({ setValue, values }: Props) {
  const results = values.results || {};
  const testimonials = values.testimonials || [];
  const metrics = results.metrics || [];

  const updateResults = (patch: Partial<typeof results>) =>
    setValue("results", { ...results, ...patch });

  function updateMetric(i: number, patch: Partial<CaseStudyMetric>) {
    const next = [...metrics];
    next[i] = { ...next[i], ...patch };
    updateResults({ metrics: next });
  }

  return (
    <div className="grid gap-4">
      <FormSection title="Business Results" description="Measurable outcomes and impact.">
        <TextAreaField label="Results Summary" value={results.summary} onChange={(v) => updateResults({ summary: v })} rows={4} />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2"><Label>Traffic Growth</Label><Input value={results.trafficGrowth || ""} onChange={(e) => updateResults({ trafficGrowth: e.target.value })} placeholder="+271%" /></div>
          <div className="space-y-2"><Label>Lead Growth</Label><Input value={results.leadGrowth || ""} onChange={(e) => updateResults({ leadGrowth: e.target.value })} /></div>
          <div className="space-y-2"><Label>Conversion Growth</Label><Input value={results.conversionGrowth || ""} onChange={(e) => updateResults({ conversionGrowth: e.target.value })} /></div>
          <div className="space-y-2"><Label>Revenue Growth</Label><Input value={results.revenueGrowth || ""} onChange={(e) => updateResults({ revenueGrowth: e.target.value })} /></div>
        </div>
        <TextAreaField label="Business Impact" value={results.businessImpact} onChange={(v) => updateResults({ businessImpact: v })} />
        <TextAreaField label="Before vs After" value={results.beforeAfter} onChange={(v) => updateResults({ beforeAfter: v })} rows={5} />
      </FormSection>

      <FormSection title="Key Metrics" description="Before/after comparison table data.">
        {metrics.map((m, i) => (
          <div key={i} className="grid gap-2 rounded-xl border border-admin-border p-3 lg:grid-cols-4">
            <Input placeholder="Metric label" value={m.label} onChange={(e) => updateMetric(i, { label: e.target.value })} />
            <Input placeholder="Before" value={m.before || ""} onChange={(e) => updateMetric(i, { before: e.target.value })} />
            <Input placeholder="After" value={m.after || ""} onChange={(e) => updateMetric(i, { after: e.target.value })} />
            <div className="flex gap-2">
              <Input placeholder="Change" value={m.change || ""} onChange={(e) => updateMetric(i, { change: e.target.value })} />
              <Button type="button" variant="ghost" size="icon" onClick={() => updateResults({ metrics: metrics.filter((_, j) => j !== i) })}><X className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => updateResults({ metrics: [...metrics, { label: "", before: "", after: "", change: "" }] })}>
          <Plus className="h-4 w-4" /> Add Metric
        </Button>
      </FormSection>

      <FormSection title="Client Testimonials" description="Social proof for conversion.">
        {testimonials.map((t, i) => (
          <div key={i} className="space-y-3 rounded-xl border border-admin-border p-4">
            <div className="grid gap-3 lg:grid-cols-2">
              <Input placeholder="Client name" value={t.clientName || ""} onChange={(e) => { const n = [...testimonials]; n[i] = { ...t, clientName: e.target.value }; setValue("testimonials", n); }} />
              <Input placeholder="Designation" value={t.designation || ""} onChange={(e) => { const n = [...testimonials]; n[i] = { ...t, designation: e.target.value }; setValue("testimonials", n); }} />
              <Input placeholder="Company" value={t.company || ""} onChange={(e) => { const n = [...testimonials]; n[i] = { ...t, company: e.target.value }; setValue("testimonials", n); }} />
              <Input type="number" min={1} max={5} placeholder="Rating 1-5" value={t.rating || ""} onChange={(e) => { const n = [...testimonials]; n[i] = { ...t, rating: Number(e.target.value) }; setValue("testimonials", n); }} />
            </div>
            <textarea className="min-h-[80px] w-full rounded-md border border-admin-border bg-transparent px-3 py-2 text-sm" placeholder="Review text" value={t.review || ""} onChange={(e) => { const n = [...testimonials]; n[i] = { ...t, review: e.target.value }; setValue("testimonials", n); }} />
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => setValue("testimonials", [...testimonials, {}])}>
          <Plus className="h-4 w-4" /> Add Testimonial
        </Button>
      </FormSection>
    </div>
  );
}
