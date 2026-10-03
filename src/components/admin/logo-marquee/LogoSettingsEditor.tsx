"use client";
import { Button } from "@/components/ui/button";
import type { LogoSettings } from "@/types/logo-marquee";
import { cleanScope, Field, fieldClass, ScopeField } from "./LogoFields";
const numberFields = [
  ["speed", "Loop duration (seconds)", 15, 120], ["logoHeightDesktop", "Desktop height (px)", 24, 72],
  ["logoHeightTablet", "Tablet height (px)", 24, 60], ["logoHeightMobile", "Mobile height (px)", 24, 40],
  ["gapDesktop", "Desktop gap (px)", 24, 120], ["gapTablet", "Tablet gap (px)", 20, 90], ["gapMobile", "Mobile gap (px)", 20, 60],
] as const;
export function LogoSettingsEditor({ value, busy, onChange, onSave }: { value: LogoSettings; busy: boolean; onChange: (value: LogoSettings) => void; onSave: (value: LogoSettings) => void }) {
  const change = (patch: Partial<LogoSettings>) => onChange({ ...value, ...patch });
  return <form className="space-y-5 rounded-2xl border border-admin-border bg-admin-surface p-5" onSubmit={(event) => { event.preventDefault(); onSave({ ...value, pageScope: cleanScope(value.pageScope) }); }}>
    <h2 className="text-lg font-semibold">Section settings</h2>
    <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={value.enabled} onChange={(event) => change({ enabled: event.target.checked })} /> Enable public section</label>
    <Field title="Title"><input required maxLength={100} className={fieldClass} value={value.title} onChange={(event) => change({ title: event.target.value })} /></Field>
    <Field title="Subtitle"><textarea maxLength={300} rows={3} className={fieldClass} value={value.subtitle} onChange={(event) => change({ subtitle: event.target.value })} /></Field>
    <p className="text-xs text-admin-text-muted">Use factual ecosystem wording. Client or partner claims need an actual relationship.</p>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field title="Background"><select className={fieldClass} value={value.backgroundVariant} onChange={(event) => change({ backgroundVariant: event.target.value as LogoSettings["backgroundVariant"] })}><option value="midnight">Pearl blue</option><option value="graphite">Soft graphite</option></select></Field>
      <Field title="Rows"><select className={fieldClass} value={value.rowCount} onChange={(event) => change({ rowCount: Number(event.target.value) as 1 | 2 })}><option value={2}>Two rows</option><option value={1}>One row</option></select></Field>
      {(["row1Direction", "row2Direction"] as const).map((key, index) => <Field key={key} title={`Row ${index + 1} direction`}><select className={fieldClass} value={value[key]} onChange={(event) => change({ [key]: event.target.value })}><option value="left">Left</option><option value="right">Right</option></select></Field>)}
      {numberFields.map(([key, label, min, max]) => <Field key={key} title={label}><input type="number" required min={min} max={max} className={fieldClass} value={value[key]} onChange={(event) => change({ [key]: Number(event.target.value) })} /></Field>)}
    </div>
    <div className="flex flex-wrap gap-5 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={value.pauseOnHover} onChange={(event) => change({ pauseOnHover: event.target.checked })} /> Pause on hover</label><label className="flex items-center gap-2"><input type="checkbox" checked={value.showOnMobile} onChange={(event) => change({ showOnMobile: event.target.checked })} /> Show on mobile</label></div>
    <ScopeField value={value.pageScope} onChange={(pageScope) => change({ pageScope })} />
    <Button disabled={busy} type="submit">{busy ? "Saving…" : "Save section settings"}</Button>
  </form>;
}
