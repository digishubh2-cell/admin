"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LogoAsset, LogoSettings, PageScope } from "@/types/logo-marquee";
import { Field, fieldClass } from "./LogoFields";
const matches = (scope: PageScope, path: string) => scope.mode === "GLOBAL" || (scope.mode === "INCLUDE" ? scope.pages.includes(path) : !scope.pages.includes(path));
export function LogoPreview({ logos, settings, siteOrigin, onPages }: { logos: LogoAsset[]; settings: LogoSettings; siteOrigin: string; onPages: (pages: string[]) => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [path, setPath] = useState("/");
  const [width, setWidth] = useState("100%");
  const [drafts, setDrafts] = useState(true);
  const data = useMemo(() => {
    const rows: LogoAsset[][] = Array.from({ length: settings.rowCount }, () => []);
    for (const logo of logos.filter((logo) => logo.media.url && matches(logo.pageScope, path) && (drafts || logo.status === "APPROVED" && logo.isActive)).slice(0, 32)) {
      const index = settings.rowCount === 1 || logo.rowPreference === "ROW_1" ? 0 : logo.rowPreference === "ROW_2" ? 1 : rows[0].length <= rows[1].length ? 0 : 1;
      rows[index].push(logo);
    }
    return { enabled: (drafts || settings.enabled) && matches(settings.pageScope, path), settings,
      rows: rows.map((row) => row.map((logo) => ({ slug: logo.slug || logo.id, name: logo.name, alt: logo.alt,
        imageUrl: logo.media.url, width: logo.media.width, height: logo.media.height, rowPreference: logo.rowPreference }))) };
  }, [logos, settings, path, drafts]);
  const publish = useCallback(() => frame.current?.contentWindow?.postMessage({ type: "shubhdigi:logo-preview", data }, siteOrigin), [data, siteOrigin]);
  useEffect(() => {
    publish();
    function ready(event: MessageEvent) { if (event.origin === siteOrigin && event.source === frame.current?.contentWindow && event.data?.type === "shubhdigi:logo-preview-ready") {
      if (Array.isArray(event.data.pages) && event.data.pages.length < 2000 && event.data.pages.every((path: unknown) => typeof path === "string" && path.startsWith("/") && path.length < 240)) onPages(event.data.pages);
      publish();
    } }
    window.addEventListener("message", ready); return () => window.removeEventListener("message", ready);
  }, [publish, siteOrigin, onPages]);
  return <section className="space-y-4 rounded-2xl border border-admin-border bg-admin-surface p-5">
    <div><h2 className="text-lg font-semibold">Live preview</h2><p className="mt-1 text-xs text-admin-text-muted">Uses the public renderer. Shows logos on the current library page plus unsaved edits.</p></div>
    <div className="grid gap-3 sm:grid-cols-2"><Field title="Preview page"><input className={fieldClass} value={path} onChange={(event) => setPath(event.target.value.trim().replace(/\/+$/, "") || "/")} /></Field>
      <Field title="Viewport"><select className={fieldClass} value={width} onChange={(event) => setWidth(event.target.value)}><option value="100%">Fit panel</option>{[320, 360, 375, 390, 414, 768, 1024, 1280, 1440].map((size) => <option key={size} value={`${size}px`}>{size}px</option>)}</select></Field></div>
    <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={drafts} onChange={(event) => setDrafts(event.target.checked)} /> Include drafts and preview while section is disabled</label>
    <div className="overflow-x-auto rounded-xl bg-[#0b1620]"><iframe ref={frame} title="Live logo marquee preview" src={`${siteOrigin}/logo-marquee-preview`} onLoad={publish}
      style={{ width, minWidth: width === "100%" ? 0 : width }} className="block h-[460px] border-0" /></div>
  </section>;
}
