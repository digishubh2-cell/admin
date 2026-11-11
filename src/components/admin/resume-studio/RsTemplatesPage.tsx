"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRsMutation, useRsTemplates } from "@/hooks/use-resume-studio";
import { apiErrorMessage, resumeStudioAdminApi as api } from "@/lib/api/resume-studio";
import type { RsTemplate } from "@/types/resume-studio";
import { RsCard, RsPageHeader, RsStatus, fmtDate } from "./RsUi";

function TemplateRow({ t }: { t: RsTemplate }) {
  const current = t.versions[0];
  const [name, setName] = useState(t.name);
  const [tier, setTier] = useState(t.tier);
  const [sortOrder, setSortOrder] = useState(t.sortOrder);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const save = useRsMutation(() => api.updateTemplate(t.key, { name, tier, sortOrder }));
  const preview = useRsMutation(() => api.previewTemplate(t.key, current.version));
  const approve = useRsMutation(() => api.approveTemplate(t.key, current.version));
  const publish = useRsMutation(() => api.publishTemplate(t.key, current.version));
  const unpublish = useRsMutation(() => api.unpublishTemplate(t.key));

  const run = async (label: string, fn: () => Promise<unknown>) => {
    try {
      const result = await fn();
      toast.success(label);
      return result;
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  const thumb = t.thumbnails?.[`v${current?.version}`];

  return (
    <RsCard
      title={`${t.name} (${t.key} v${current?.version ?? "?"})`}
      actions={<RsStatus value={t.status} />}
    >
      <div className="grid gap-4 md:grid-cols-[160px_1fr]">
        <div className="flex h-[220px] items-center justify-center overflow-hidden rounded-xl border border-admin-border bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {thumb ? <img src={thumb} alt={`${t.name} thumbnail`} className="h-full w-full object-contain" /> : <span className="text-xs text-admin-text-muted">No thumbnail yet</span>}
        </div>
        <div className="space-y-3 text-sm">
          <p className="text-admin-text-secondary">{t.description}</p>
          <p className="text-xs text-admin-text-muted">
            {t.layout} · {t.atsFriendly ? "ATS-friendly" : "graphic"} · photo {t.photoSupported ? "supported" : "off"} · sample compile: {current?.sampleCompile?.status || "pending"} ({fmtDate(current?.sampleCompile?.checkedAt)}) · approved: {current?.approvedAt ? fmtDate(current.approvedAt) : "no"}
          </p>
          <div className="flex flex-wrap gap-2">
            <Input className="w-48" value={name} onChange={(e) => setName(e.target.value)} aria-label="Display name" />
            <select className="rounded-xl border border-admin-border bg-admin-surface px-3 text-sm" value={tier} onChange={(e) => setTier(e.target.value as RsTemplate["tier"])} aria-label="Tier">
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
            <Input className="w-24" type="number" min={0} max={100} value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} aria-label="Sort order" />
            <Button variant="outline" onClick={() => run("Template saved", () => save.mutateAsync(undefined))} disabled={save.isPending}>Save</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={preview.isPending}
              onClick={async () => {
                const r = (await run("Sample compiled", () => preview.mutateAsync(undefined))) as Awaited<ReturnType<typeof api.previewTemplate>> | undefined;
                if (r?.pdfBase64) setPdfUrl(`data:application/pdf;base64,${r.pdfBase64}`);
              }}
            >
              {preview.isPending ? "Compiling…" : "1. Compile sample"}
            </Button>
            <Button variant="outline" disabled={approve.isPending || current?.sampleCompile?.status !== "ok"} onClick={() => run("Version approved", () => approve.mutateAsync(undefined))}>2. Approve v{current?.version}</Button>
            {t.status === "published" ? (
              <Button variant="destructive" disabled={unpublish.isPending} onClick={() => confirm("Unpublish this template?") && run("Unpublished", () => unpublish.mutateAsync(undefined))}>Unpublish</Button>
            ) : (
              <Button disabled={publish.isPending || !current?.approvedAt} onClick={() => run("Published", () => publish.mutateAsync(undefined))}>3. Publish</Button>
            )}
            {pdfUrl ? <a className="self-center text-sm text-primary underline" href={pdfUrl} target="_blank" rel="noreferrer">Open sample PDF</a> : null}
          </div>
        </div>
      </div>
    </RsCard>
  );
}

export function RsTemplatesPage() {
  const { data, isLoading } = useRsTemplates();
  return (
    <div className="space-y-6">
      <RsPageHeader
        title="Templates"
        description="LaTeX layouts ship in code. Here you compile-check the sample, approve the version and publish it to the gallery."
      />
      {isLoading ? <p className="text-sm text-admin-text-muted">Loading…</p> : data?.map((t) => <TemplateRow key={t.key} t={t} />)}
    </div>
  );
}
