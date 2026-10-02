"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, GripVertical, Plus, Search, SlidersHorizontal, Upload, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { warnIfCacheFailed } from "@/lib/cache/afterMutation";
import { archiveLogo, fetchCandidates, fetchLogos, fetchLogoSettings, logoAction, reorderLogos, saveLogo, saveLogoSettings } from "@/lib/api/logo-marquee";
import type { LogoAsset, LogoDraft, LogoSettings, PageScope } from "@/types/logo-marquee";
import { LogoEditor } from "./LogoEditor";
import { LogoSettingsEditor } from "./LogoSettingsEditor";
import { LogoPreview } from "./LogoPreview";
import { cleanScope, fieldClass, ScopeField, LogoPageOptions } from "./LogoFields";

type MutationResult = Awaited<ReturnType<typeof archiveLogo>>;
function message(error: unknown) {
  const result = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } }; message?: string };
  const details = Object.values(result.response?.data?.errors || {}).flat().join(". ");
  return details || result.response?.data?.message || result.message || "Request failed";
}
export function LogoLibrary({ siteOrigin }: { siteOrigin: string }) {
  const auth = useAuth();
  const allowed = ["admin", "super_admin"].includes(auth.data?.role || "");
  const client = useQueryClient();
  const [params, setParams] = useState<Record<string, string | number>>({ page: 1, limit: 20, sortBy: "displayOrder", sortOrder: "asc" });
  const list = useQuery({ queryKey: ["logo-library", "list", params], queryFn: () => fetchLogos(params), enabled: allowed });
  const settingsQuery = useQuery({ queryKey: ["logo-library", "settings"], queryFn: fetchLogoSettings, enabled: allowed });
  const candidates = useQuery({ queryKey: ["logo-library", "candidates"], queryFn: fetchCandidates, enabled: allowed });
  const [draftSettings, setDraftSettings] = useState<LogoSettings | null>(null);
  const [editing, setEditing] = useState<LogoAsset | "new" | null>(null);
  const [previewLogo, setPreviewLogo] = useState<LogoAsset | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<string[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("library");
  const [pageOptions, setPageOptions] = useState<string[]>([]);
  const [view, setView] = useState("grid");
  const [bulk, setBulk] = useState("approve");
  const [bulkScope, setBulkScope] = useState<PageScope>({ mode: "GLOBAL", pages: [] });
  const [bulkRow, setBulkRow] = useState("AUTO");
  const [discoverySearch, setDiscoverySearch] = useState("");
  const settings = draftSettings || settingsQuery.data;
  const items = useMemo(() => {
    const items = [...(list.data?.items || [])];
    return order.length ? items.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id)) : items;
  }, [list.data, order]);
  const previewItems = previewLogo ? [...items.filter((item) => item.id !== previewLogo.id), previewLogo].sort((a, b) => a.displayOrder - b.displayOrder || b.priority - a.priority) : items;
  function filter(key: string, value: string) {
    setParams((previous) => { const next = { ...previous, page: 1, [key]: value }; if (!value) delete next[key]; return next; });
    setOrder([]); setSelected([]);
  }
  async function mutate(action: () => Promise<MutationResult>, success: string) {
    setBusy(true);
    try { const result = await action(); toast.success(success); warnIfCacheFailed(result); await client.invalidateQueries({ queryKey: ["logo-library"] }); setSelected([]); return true; }
    catch (error) { toast.error(message(error)); return false; }
    finally { setBusy(false); }
  }
  function move(id: string, target: string) {
    if (busy || id === target) return;
    const next = items.map((item) => item.id); const from = next.indexOf(id), to = next.indexOf(target);
    if (from < 0 || to < 0) return; next.splice(from, 1); next.splice(to, 0, id); setOrder(next);
  }
  async function save(draft: LogoDraft) {
    if (await mutate(() => saveLogo(draft, editing && editing !== "new" ? editing : undefined), "Logo saved")) { setEditing(null); setPreviewLogo(null); }
  }
  if (auth.isLoading) return <p className="p-8 text-admin-text-muted">Loading Logo Library…</p>;
  if (!allowed) return <p className="p-8 text-admin-text-muted">Administrator access is required to manage the Logo Library.</p>;
  return <LogoPageOptions.Provider value={pageOptions}><div className="space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[.18em] text-primary">Global ecosystem</p><h1 className="text-3xl font-semibold tracking-tight">Logo Library</h1><p className="mt-2 max-w-2xl text-sm text-admin-text-secondary">Manage approved technology logos, page visibility, and the shared marquee below your public heroes.</p></div>
      <Button onClick={() => { setEditing("new"); setPreviewLogo(null); setTab("library"); }}><Plus className="h-4 w-4" /> Add logo</Button></header>
    <nav className="flex flex-wrap gap-2" aria-label="Logo Library views">{[["library", "Library", Upload], ["discover", "Discover logos", Search], ["settings", "Section settings", SlidersHorizontal]].map(([value, label, Icon]) => {
      const NavIcon = Icon as typeof Search; return <Button key={String(value)} variant={tab === value ? "default" : "outline"} onClick={() => setTab(String(value))}><NavIcon className="h-4 w-4" />{String(label)}</Button>;
    })}</nav>
    {(list.isError || settingsQuery.isError) && <p role="alert" className="rounded-xl border border-red-300 p-4 text-sm text-red-700">Could not load the library. <button onClick={() => { void list.refetch(); void settingsQuery.refetch(); }} className="underline">Retry</button></p>}
    <div className="grid items-start gap-6 2xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"><div className="min-w-0 space-y-5">
      {tab === "settings" && settings && <LogoSettingsEditor value={settings} busy={busy} onChange={setDraftSettings} onSave={async (value) => { if (await mutate(() => saveLogoSettings(value), "Section settings saved")) setDraftSettings(null); }} />}
      {tab === "discover" && <section className="space-y-4 rounded-2xl border border-admin-border bg-admin-surface p-5"><h2 className="text-lg font-semibold">Official brand sources</h2><p className="text-sm text-admin-text-secondary">Import a reviewed source to ImageKit as an inactive draft. Check the brand guidance and approve each logo before publishing. For other platforms, download an official asset and use Add logo with its source URL.</p>
        <input aria-label="Search official logo sources" className={fieldClass} placeholder="Search technologies" value={discoverySearch} onChange={(event) => setDiscoverySearch(event.target.value)} />
        {candidates.isError && <p role="alert">Could not load sources.</p>}
        {candidates.data?.filter((item) => item.name.toLowerCase().includes(discoverySearch.toLowerCase())).map((item) => <article key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-admin-border p-4"><div><h3 className="font-semibold">{item.name}</h3><p className="text-xs text-admin-text-muted">{item.category}</p><a className="mt-2 inline-flex items-center gap-1 text-xs text-primary underline" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">Official source <ExternalLink className="h-3 w-3" /></a></div><Button disabled={busy} variant="outline" onClick={() => void mutate(() => logoAction("discover", { candidateId: item.id }), "Imported as an inactive draft")}>Import draft</Button></article>)}
      </section>}
      {tab === "library" && <>
        {editing && <LogoEditor key={editing === "new" ? "new" : editing.id} existing={editing === "new" ? undefined : editing} categories={list.data?.categories || ["Technology"]}
          busy={busy} onSave={save} onCancel={() => { setEditing(null); setPreviewLogo(null); }} onPreview={setPreviewLogo} />}
        <div className="space-y-3 rounded-2xl border border-admin-border bg-admin-surface p-4">
          <input aria-label="Search logos by name" className={fieldClass} placeholder="Search logos by name" value={params.search || ""} onChange={(event) => filter("search", event.target.value)} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {([["category", "All categories", list.data?.categories || []], ["status", "All statuses", ["DRAFT", "APPROVED", "ARCHIVED"]],
              ["isActive", "Active / inactive", ["true", "false"]], ["sourceType", "All sources", ["ADMIN_UPLOAD", "DISCOVERED", "IMPORTED"]],
              ["scope", "All page scopes", ["GLOBAL", "INCLUDE", "EXCLUDE"]]] as const).map(([key, label, options]) => <select key={key} aria-label={label} className={fieldClass} value={params[key] || ""} onChange={(event) => filter(key, event.target.value)}><option value="">{label}</option>{options.map((option) => <option key={option} value={option}>{option === "true" ? "Active" : option === "false" ? "Inactive" : option}</option>)}</select>)}
            <select aria-label="Sort logos" className={fieldClass} value={params.sortBy} onChange={(event) => filter("sortBy", event.target.value)}><option value="displayOrder">Display order</option><option value="priority">Priority</option><option value="createdAt">Created date</option><option value="name">Alphabetical</option></select>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs"><label className="flex items-center gap-2"><input type="checkbox" checked={items.length > 0 && items.every((item) => selected.includes(item.id))} onChange={(event) => setSelected(event.target.checked ? items.map((item) => item.id) : [])} /> Select this page</label>
            <button className="underline" onClick={() => filter("sortOrder", params.sortOrder === "asc" ? "desc" : "asc")}>{params.sortOrder === "asc" ? "Ascending" : "Descending"}</button>
            <button className="underline" onClick={() => setView(view === "grid" ? "list" : "grid")}>{view === "grid" ? "List view" : "Grid view"}</button>
            {order.length > 0 && <Button size="sm" disabled={busy} onClick={async () => { if (await mutate(() => reorderLogos(order), "Logo order saved")) setOrder([]); }}>Save order</Button>}
          </div>
          {selected.length > 0 && <div className="space-y-3 border-t border-admin-border pt-3"><div className="flex flex-wrap gap-2"><select aria-label="Bulk action" className={`${fieldClass} !w-auto`} value={bulk} onChange={(event) => setBulk(event.target.value)}>{["approve", "activate", "deactivate", "archive", "scope", "row"].map((action) => <option key={action}>{action}</option>)}</select>
            {bulk === "row" && <select aria-label="Bulk row" className={`${fieldClass} !w-auto`} value={bulkRow} onChange={(event) => setBulkRow(event.target.value)}>{["AUTO", "ROW_1", "ROW_2"].map((row) => <option key={row}>{row}</option>)}</select>}
            <Button disabled={busy} variant="outline" onClick={() => { if (bulk === "archive" && !confirm(`Archive ${selected.length} logos? Assets will be retained.`)) return; void mutate(() => logoAction("bulk", { ids: selected, action: bulk, ...(bulk === "scope" ? { pageScope: cleanScope(bulkScope) } : {}), ...(bulk === "row" ? { rowPreference: bulkRow } : {}) }), "Bulk update saved"); }}>Apply to {selected.length}</Button></div>
            {bulk === "scope" && <ScopeField value={bulkScope} onChange={setBulkScope} />}</div>}
        </div>
        <p className="text-xs text-admin-text-muted">Drag logos or use the arrow buttons, then save order. Manual display order and row assignment are available in Edit.</p>
        {list.isLoading ? <p className="p-6">Loading logos…</p> : !items.length ? <div className="rounded-2xl border border-dashed border-admin-border p-10 text-center"><h2 className="font-semibold">No logos here yet</h2><p className="mt-2 text-sm text-admin-text-muted">Upload or discover an official asset. The public section stays hidden until approved logos are active.</p></div> : <div className={view === "grid" ? "grid gap-3 sm:grid-cols-2" : "grid gap-3"}>
          {items.map((item, index) => <article key={item.id} draggable={!busy} onDragStart={() => setDragging(item.id)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (dragging) move(dragging, item.id); setDragging(null); }} onDragEnd={() => setDragging(null)}
            className={`rounded-xl border bg-admin-surface p-4 ${dragging === item.id ? "border-primary opacity-60" : "border-admin-border"}`}>
            <div className="flex items-center justify-between"><label className="flex items-center gap-2 text-xs"><input aria-label={`Select ${item.name}`} type="checkbox" checked={selected.includes(item.id)} onChange={(event) => setSelected((previous) => event.target.checked ? [...previous, item.id] : previous.filter((id) => id !== item.id))} /><span>{item.status}</span></label><GripVertical aria-hidden="true" className="h-4 w-4 text-admin-text-muted" /></div>
            <div className="my-4 flex h-20 items-center justify-center rounded-lg bg-[#0b1620] p-4"><Image src={item.media.url} alt={item.alt} width={item.media.width} height={item.media.height} className="h-full w-auto max-w-full object-contain" /></div>
            <h3 className="font-semibold">{item.name}</h3><p className="mt-1 text-xs text-admin-text-muted">{item.category} · {item.isActive ? "Active" : "Inactive"} · {item.rowPreference}</p>
            <p className="mt-1 break-words text-xs text-admin-text-muted">{item.pageScope.mode}{item.pageScope.pages.length ? `: ${item.pageScope.pages.join(", ")}` : ""}</p>
            <p className="mt-1 text-xs text-admin-text-muted">Order {item.displayOrder} · Priority {item.priority} · {new Date(item.createdAt).toLocaleDateString()}</p>
            <div className="mt-4 flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => { setEditing(item); setPreviewLogo(item); }}>Edit</Button><Button size="sm" variant="ghost" disabled={busy} onClick={() => { if (confirm(`Archive ${item.name}? The ImageKit file will be retained.`)) void mutate(() => archiveLogo(item.id), "Logo archived"); }}>Archive</Button>
              <Button size="icon" variant="ghost" aria-label={`Move ${item.name} earlier`} disabled={index === 0 || busy} onClick={() => move(item.id, items[index - 1].id)}><ArrowUp className="h-4 w-4" /></Button><Button size="icon" variant="ghost" aria-label={`Move ${item.name} later`} disabled={index === items.length - 1 || busy} onClick={() => move(item.id, items[index + 1].id)}><ArrowDown className="h-4 w-4" /></Button></div>
          </article>)}
        </div>}
        {list.data && <div className="flex items-center justify-between gap-3 text-sm"><p>{list.data.pagination.total} logos · Page {list.data.pagination.page} of {list.data.pagination.totalPages}</p><div className="flex gap-2"><Button variant="outline" disabled={Number(params.page) <= 1 || busy} onClick={() => { setParams({ ...params, page: Number(params.page) - 1 }); setOrder([]); setSelected([]); }}>Previous</Button><Button variant="outline" disabled={Number(params.page) >= list.data.pagination.totalPages || busy} onClick={() => { setParams({ ...params, page: Number(params.page) + 1 }); setOrder([]); setSelected([]); }}>Next</Button></div></div>}
      </>}
    </div><div className="min-w-0 2xl:sticky 2xl:top-24">{settings && <LogoPreview logos={previewItems} settings={settings} siteOrigin={siteOrigin} onPages={setPageOptions} />}</div></div>
  </div></LogoPageOptions.Provider>;
}
