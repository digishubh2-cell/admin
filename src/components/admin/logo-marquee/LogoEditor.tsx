"use client";
import { useState } from "react";
import { ImageKitUploadField } from "@/components/admin/media/ImageKitUploadField";
import { Button } from "@/components/ui/button";
import type { LogoAsset, LogoDraft } from "@/types/logo-marquee";
import { cleanScope, Field, fieldClass, ScopeField } from "./LogoFields";
export function LogoEditor({ existing, categories, busy, onSave, onCancel, onPreview }: {
  existing?: LogoAsset; categories: string[]; busy: boolean; onSave: (value: LogoDraft) => void; onCancel: () => void;
  onPreview: (value: LogoAsset) => void;
}) {
  const [draft, setDraft] = useState<LogoDraft>(existing ? { name: existing.name, slug: existing.slug, alt: existing.alt, category: existing.category,
    sourceType: existing.sourceType, sourceUrl: existing.sourceUrl, status: existing.status, isActive: existing.isActive, priority: existing.priority,
    displayOrder: existing.displayOrder, rowPreference: existing.rowPreference, pageScope: existing.pageScope, fileId: existing.media.fileId }
    : { name: "", slug: "", alt: "", category: "Technology", sourceType: "ADMIN_UPLOAD", sourceUrl: "", status: "DRAFT", isActive: true,
      priority: 0, displayOrder: 1000000, rowPreference: "AUTO", pageScope: { mode: "GLOBAL", pages: [] }, fileId: "" });
  const [imageUrl, setImageUrl] = useState(existing?.media.url || "");
  const [dimensions, setDimensions] = useState({ width: existing?.media.width || 400, height: existing?.media.height || 120 });
  function change(patch: Partial<LogoDraft>, url = imageUrl, size = dimensions) {
    const next = { ...draft, ...patch }; setDraft(next);
    onPreview({ ...next, id: existing?.id || "preview", createdAt: existing?.createdAt || new Date().toISOString(), updatedAt: "",
      media: { fileId: next.fileId, url, filePath: "", ...size, mimeType: "image/webp", fileSize: 0, uploadedAt: "" } });
  }
  return <form className="space-y-5 rounded-2xl border border-admin-border bg-admin-surface p-5" onSubmit={(event) => { event.preventDefault(); onSave({ ...draft, pageScope: cleanScope(draft.pageScope) }); }}>
    <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{existing ? "Edit logo" : "Add a logo"}</h2><Button type="button" variant="ghost" onClick={onCancel}>Close</Button></div>
    <p className="text-xs text-admin-text-muted">Upload an official asset suited to a dark background. Source records identify technologies and never imply a client relationship.</p>
    <ImageKitUploadField folder="logo-marquee" label="Logo asset" previewFit="contain" retainAssets maxBytes={2 * 1024 * 1024}
      accept="image/png,image/jpeg,image/webp,image/svg+xml" hint="PNG, JPEG, WebP or SVG · 2 MB · static images only" disabled={busy}
      value={{ url: imageUrl, publicId: draft.fileId }} onChange={(media) => {
        const size = { width: media.width || dimensions.width, height: media.height || dimensions.height };
        setDimensions(size); setImageUrl(media.url || ""); change({ fileId: media.publicId || "", status: "DRAFT" }, media.url || "", size);
      }} />
    {existing?.sourceAssetUrl && <p className="break-all text-xs text-admin-text-muted">Imported asset: <a href={existing.sourceAssetUrl} target="_blank" rel="noopener noreferrer" className="underline">{existing.sourceAssetUrl}</a></p>}
    <div className="grid gap-4 sm:grid-cols-2">
      <Field title="Name"><input required maxLength={100} className={fieldClass} value={draft.name} onChange={(event) => {
        const name = event.target.value; change({ name, ...(!existing && (!draft.slug || draft.slug === draft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")) ? { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") } : {}) });
      }} /></Field>
      <Field title="Slug"><input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={100} className={fieldClass} value={draft.slug} onChange={(event) => change({ slug: event.target.value })} /></Field>
      <Field title="Alt text"><input required maxLength={180} className={fieldClass} value={draft.alt} onChange={(event) => change({ alt: event.target.value })} /></Field>
      <Field title="Category"><select className={fieldClass} value={draft.category} onChange={(event) => change({ category: event.target.value })}>{categories.map((value) => <option key={value}>{value}</option>)}</select></Field>
      <Field title="Source"><select disabled={Boolean(existing)} className={fieldClass} value={draft.sourceType} onChange={(event) => change({ sourceType: event.target.value as LogoDraft["sourceType"], status: "DRAFT" })}><option value="ADMIN_UPLOAD">Admin upload</option><option value="IMPORTED">Imported official asset</option><option value="DISCOVERED">Discovered official asset</option></select></Field>
      <Field title="Original source URL"><input type="url" required={draft.sourceType !== "ADMIN_UPLOAD"} placeholder="https://…" className={fieldClass} value={draft.sourceUrl} onChange={(event) => change({ sourceUrl: event.target.value })} /></Field>
      <Field title="Status"><select className={fieldClass} value={draft.status} onChange={(event) => change({ status: event.target.value as LogoDraft["status"] })}><option>DRAFT</option><option>APPROVED</option><option>ARCHIVED</option></select></Field>
      <Field title="Row"><select className={fieldClass} value={draft.rowPreference} onChange={(event) => change({ rowPreference: event.target.value as LogoDraft["rowPreference"] })}><option value="AUTO">Automatic balance</option><option value="ROW_1">Row 1</option><option value="ROW_2">Row 2</option></select></Field>
      <Field title="Display order"><input type="number" required min={0} max={100000000} className={fieldClass} value={draft.displayOrder} onChange={(event) => change({ displayOrder: Number(event.target.value) })} /></Field>
      <Field title="Priority (tie breaker)"><input type="number" required min={0} max={100} className={fieldClass} value={draft.priority} onChange={(event) => change({ priority: Number(event.target.value) })} /></Field>
    </div>
    <ScopeField value={draft.pageScope} onChange={(pageScope) => change({ pageScope })} />
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.isActive} onChange={(event) => change({ isActive: event.target.checked })} /> Active after approval</label>
    <p className="text-xs text-admin-text-muted">Imports and replacement images remain drafts until reviewed. Archiving retains the ImageKit asset.</p>
    <Button disabled={busy || !draft.fileId} type="submit">{busy ? "Saving…" : "Save logo"}</Button>
  </form>;
}
