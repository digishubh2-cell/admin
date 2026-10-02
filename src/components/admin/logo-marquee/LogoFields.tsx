"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { PageScope } from "@/types/logo-marquee";
export const LogoPageOptions = createContext<string[]>([]);
export const fieldClass = "w-full rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text outline-none focus:ring-2 focus:ring-primary/40";
export function Field({ title, children }: { title: string; children: ReactNode }) {
  return <label className="flex flex-col gap-1.5 text-sm font-medium text-admin-text">{title}{children}</label>;
}
export function ScopeField({ value, onChange }: { value: PageScope; onChange: (value: PageScope) => void }) {
  const options = useContext(LogoPageOptions);
  return <div className="space-y-3"><Field title="Page visibility"><select className={fieldClass} value={value.mode}
    onChange={(event) => onChange({ ...value, mode: event.target.value as PageScope["mode"] })}>
    <option value="GLOBAL">All configured public pages</option><option value="INCLUDE">Only these pages</option><option value="EXCLUDE">Except these pages</option>
  </select></Field>{value.mode !== "GLOBAL" && <Field title="Page paths, one per line"><textarea className={fieldClass} rows={4} placeholder={'/\n/services/website-development'}
    value={value.pages.join("\n")} onChange={(event) => onChange({ ...value, pages: event.target.value.split("\n") })} /></Field>}
    {value.mode !== "GLOBAL" && options.length > 0 && <Field title="Add a configured page"><select className={fieldClass} value="" onChange={(event) => { if (event.target.value) onChange({ ...value, pages: [...new Set([...value.pages.filter(Boolean), event.target.value])] }); }}><option value="">Choose a page…</option>{options.filter((path) => !value.pages.includes(path)).map((path) => <option key={path}>{path}</option>)}</select></Field>}
    <p className="text-xs font-normal text-admin-text-muted">Use exact public paths. Report, admin, application, and legal pages are excluded.</p>
  </div>;
}
export function cleanScope(value: PageScope): PageScope {
  return { mode: value.mode, pages: value.mode === "GLOBAL" ? [] : [...new Set(value.pages.map((path) => path.trim()).filter(Boolean).map((path) => path.replace(/\/+$/, "") || "/"))] };
}
