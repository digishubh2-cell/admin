"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRsMutation, useRsPricing } from "@/hooks/use-resume-studio";
import { apiErrorMessage, inr, resumeStudioAdminApi as api } from "@/lib/api/resume-studio";
import type { RsPricing } from "@/types/resume-studio";
import { RsCard, RsPageHeader } from "./RsUi";

export function RsPricingPage() {
  const { data } = useRsPricing();
  const [edited, setDraft] = useState<RsPricing | null>(null);
  const save = useRsMutation((p: RsPricing) => api.savePricing(p));
  const draft = edited ?? data ?? null;

  if (!draft) return <p className="text-sm text-admin-text-muted">Loading…</p>;

  const setPlan = (i: number, patch: Partial<RsPricing["plans"][number]>) =>
    setDraft({ ...draft, plans: draft.plans.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });

  return (
    <div className="space-y-6">
      <RsPageHeader
        title="Pricing"
        description="Prices are hypotheses — validate with conversion data. Changes need super admin, are audited, and refresh the public pages."
        actions={
          <Button
            disabled={save.isPending}
            onClick={async () => {
              if (!confirm("Publish these prices? New orders will use them immediately.")) return;
              try {
                await save.mutateAsync(draft);
                toast.success("Pricing saved");
              } catch (error) {
                toast.error(apiErrorMessage(error));
              }
            }}
          >
            Save pricing
          </Button>
        }
      />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={draft.gstInclusive} onChange={(e) => setDraft({ ...draft, gstInclusive: e.target.checked })} />
        Prices are GST-inclusive (confirm with your CA)
      </label>
      <div className="grid gap-4 lg:grid-cols-3">
        {draft.plans.map((p, i) => (
          <RsCard key={p.key} title={`${p.key} — ${inr(p.pricePaise)}`}>
            <div className="space-y-2 text-sm">
              <label className="block">Name<Input value={p.name} onChange={(e) => setPlan(i, { name: e.target.value })} /></label>
              <label className="block">Price (₹)<Input type="number" min={1} step={1} value={p.pricePaise / 100} onChange={(e) => setPlan(i, { pricePaise: Math.round(Number(e.target.value) * 100) })} /></label>
              <label className="block">Description<Input value={p.description} onChange={(e) => setPlan(i, { description: e.target.value })} /></label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block">Edit window (days)<Input type="number" min={1} value={p.editWindowDays} onChange={(e) => setPlan(i, { editWindowDays: Number(e.target.value) })} /></label>
                <label className="block">Re-exports<Input type="number" min={0} value={p.maxRecompiles} onChange={(e) => setPlan(i, { maxRecompiles: Number(e.target.value) })} /></label>
              </div>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-1"><input type="checkbox" checked={p.active} onChange={(e) => setPlan(i, { active: e.target.checked })} /> Active</label>
                <label className="flex items-center gap-1"><input type="checkbox" checked={p.includes.tex} onChange={(e) => setPlan(i, { includes: { ...p.includes, tex: e.target.checked } })} /> .tex</label>
                <label className="flex items-center gap-1"><input type="checkbox" checked={p.includes.premiumTemplates} onChange={(e) => setPlan(i, { includes: { ...p.includes, premiumTemplates: e.target.checked } })} /> Premium templates</label>
                <label className="flex items-center gap-1"><input type="checkbox" checked={p.includes.pro} onChange={(e) => setPlan(i, { includes: { ...p.includes, pro: e.target.checked } })} /> LaTeX Pro</label>
              </div>
            </div>
          </RsCard>
        ))}
      </div>
    </div>
  );
}
