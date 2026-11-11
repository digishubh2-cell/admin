"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRsAccounts, useRsAiUsage, useRsAudit, useRsCompileJobs, useRsFeedback, useRsMutation } from "@/hooks/use-resume-studio";
import { apiErrorMessage, resumeStudioAdminApi as api, type ListParams } from "@/lib/api/resume-studio";
import { RsCard, RsPageHeader, RsPager, RsStat, RsStatus, RsTable, fmtDate } from "./RsUi";

export function RsAiUsagePage() {
  const [days, setDays] = useState(30);
  const { data } = useRsAiUsage(days);
  const total = data?.daily.reduce((s, d) => s + d.costUsd, 0) ?? 0;
  const max = Math.max(0.0001, ...(data?.daily.map((d) => d.costUsd) ?? [0]));
  return (
    <div className="space-y-6">
      <RsPageHeader
        title="AI Usage"
        description="Token usage and estimated provider cost. Principals are shown as hashes — no resume content is stored here."
        actions={
          <select className="rounded-xl border border-admin-border bg-admin-surface px-3 py-2 text-sm" value={days} onChange={(e) => setDays(Number(e.target.value))}>
            {[7, 30, 90].map((d) => <option key={d} value={d}>Last {d} days</option>)}
          </select>
        }
      />
      {data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <RsStat label="Total cost" value={`$${total.toFixed(3)}`} />
            <RsStat label="Daily budget" value={`$${data.budgetUsdPerDay}`} hint={data.aiEnabled ? "AI enabled" : "AI disabled (kill switch)"} />
            <RsStat label="Decisions" value={Object.entries(data.decisions).map(([k, v]) => `${k}: ${v}`).join(" · ") || "—"} hint="Accepted / rejected / edited suggestions" />
          </div>
          <RsCard title="Daily cost">
            <div className="flex h-32 items-end gap-1">
              {data.daily.map((d) => (
                <div key={d.day} title={`${d.day}: $${d.costUsd.toFixed(3)}`} className="flex-1 rounded-t bg-primary/70" style={{ height: `${Math.max(2, (d.costUsd / max) * 100)}%` }} />
              ))}
            </div>
          </RsCard>
          <RsTable head={["Task", "Model", "Calls", "Input tokens", "Output tokens", "Cost", "Invalid outputs"]} empty={!data.byTask.length}>
            {data.byTask.map((r) => (
              <tr key={`${r.task}-${r.model}`}>
                <td className="px-4 py-2">{r.task}</td>
                <td className="px-4 py-2 text-xs">{r.model}</td>
                <td className="px-4 py-2">{r.calls}</td>
                <td className="px-4 py-2">{r.inputTokens.toLocaleString("en-IN")}</td>
                <td className="px-4 py-2">{r.outputTokens.toLocaleString("en-IN")}</td>
                <td className="px-4 py-2">${r.costUsd.toFixed(3)}</td>
                <td className="px-4 py-2">{r.invalid}</td>
              </tr>
            ))}
          </RsTable>
          <RsCard title="Top principals (hashed)">
            <ul className="text-sm">{data.topPrincipals.map((p) => <li key={p.principal} className="flex justify-between font-mono text-xs"><span>{p.principal}</span><span>${p.costUsd.toFixed(3)}</span></li>)}</ul>
          </RsCard>
        </>
      ) : (
        <p className="text-sm text-admin-text-muted">Loading…</p>
      )}
    </div>
  );
}

export function RsCompileJobsPage() {
  const [params, setParams] = useState<ListParams>({ page: 1, limit: 25 });
  const { data } = useRsCompileJobs(params);
  return (
    <div className="space-y-6">
      <RsPageHeader title="Compile Logs" description="Preview and export jobs. Logs are stored as structured, redacted errors only." />
      <select className="rounded-xl border border-admin-border bg-admin-surface px-3 py-2 text-sm" value={params.status || ""} onChange={(e) => setParams({ ...params, page: 1, status: e.target.value || undefined })}>
        {["", "queued", "running", "ready", "failed"].map((s) => <option key={s} value={s}>{s || "All statuses"}</option>)}
      </select>
      <RsTable head={["Job", "Kind", "Status", "Attempts", "Pages", "Duration", "Error", "Created"]} empty={!data?.items.length}>
        {data?.items.map((j) => (
          <tr key={j.id}>
            <td className="px-4 py-2 font-mono text-xs">{j.id.slice(0, 8)}</td>
            <td className="px-4 py-2">{j.kind}</td>
            <td className="px-4 py-2"><RsStatus value={j.status} /></td>
            <td className="px-4 py-2">{j.attempts}</td>
            <td className="px-4 py-2">{j.result?.pageCount ?? "—"}</td>
            <td className="px-4 py-2">{j.result?.durationMs ? `${j.result.durationMs} ms` : "—"}</td>
            <td className="px-4 py-2 text-xs">{j.publicError || j.result?.errors?.map((e) => `L${e.line ?? "?"}: ${e.message}`).join("; ") || ""}</td>
            <td className="px-4 py-2 text-xs">{fmtDate(j.createdAt)}</td>
          </tr>
        ))}
      </RsTable>
      {data ? <RsPager {...data.pagination} onPage={(page) => setParams({ ...params, page })} /> : null}
    </div>
  );
}

export function RsCustomersPage() {
  const [params, setParams] = useState<ListParams>({ page: 1, limit: 25 });
  const [q, setQ] = useState("");
  const { data } = useRsAccounts(params);
  const setStatus = useRsMutation(({ id, status }: { id: string; status: "active" | "suspended" }) => api.setAccountStatus(id, status));
  const remove = useRsMutation((id: string) => api.deleteAccountData(id));
  const act = async (label: string, fn: () => Promise<unknown>) => {
    try {
      await fn();
      toast.success(label);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };
  return (
    <div className="space-y-6">
      <RsPageHeader title="Customers" description="Resume Studio accounts (separate from staff users). Email searches and data deletions are audited." />
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setParams({ ...params, page: 1, q: q.trim() || undefined }); }}>
        <Input className="max-w-sm" placeholder="Email starts with…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button type="submit" variant="outline">Search</Button>
      </form>
      <RsTable head={["Email", "Status", "Resumes", "Paid orders", "Created", "Last login", ""]} empty={!data?.items.length}>
        {data?.items.map((a) => (
          <tr key={a.id}>
            <td className="px-4 py-2">{a.email}</td>
            <td className="px-4 py-2"><RsStatus value={a.status} /></td>
            <td className="px-4 py-2">{a.resumes}</td>
            <td className="px-4 py-2">{a.paidOrders}</td>
            <td className="px-4 py-2 text-xs">{fmtDate(a.createdAt)}</td>
            <td className="px-4 py-2 text-xs">{fmtDate(a.lastLoginAt)}</td>
            <td className="flex gap-2 px-4 py-2">
              {a.status === "suspended" ? (
                <Button size="sm" variant="outline" onClick={() => act("Reactivated", () => setStatus.mutateAsync({ id: a.id, status: "active" }))}>Reactivate</Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => confirm("Suspend and sign out this account?") && act("Suspended", () => setStatus.mutateAsync({ id: a.id, status: "suspended" }))}>Suspend</Button>
              )}
              <Button size="sm" variant="destructive" onClick={() => prompt("Type DELETE to erase this customer's resumes, photos and history (super admin)") === "DELETE" && act("Data deleted", () => remove.mutateAsync(a.id))}>Delete data</Button>
            </td>
          </tr>
        ))}
      </RsTable>
      {data ? <RsPager {...data.pagination} onPage={(page) => setParams({ ...params, page })} /> : null}
    </div>
  );
}

export function RsFeedbackPage() {
  const [params, setParams] = useState<ListParams>({ page: 1, limit: 25 });
  const { data } = useRsFeedback(params);
  const update = useRsMutation(({ id, status }: { id: string; status: string }) => api.setFeedbackStatus(id, status));
  return (
    <div className="space-y-6">
      <RsPageHeader title="Feedback" description="Ratings and issues submitted from Resume Studio." />
      <RsTable head={["Rating", "Category", "Message", "Status", "Created", ""]} empty={!data?.items.length}>
        {data?.items.map((f) => (
          <tr key={f.id}>
            <td className="px-4 py-2">{"★".repeat(f.rating)}</td>
            <td className="px-4 py-2">{f.category}</td>
            <td className="max-w-md px-4 py-2 text-xs">{f.message}</td>
            <td className="px-4 py-2"><RsStatus value={f.status} /></td>
            <td className="px-4 py-2 text-xs">{fmtDate(f.createdAt)}</td>
            <td className="px-4 py-2">
              <select className="rounded-lg border border-admin-border bg-admin-surface px-2 py-1 text-xs" value={f.status} onChange={(e) => update.mutate({ id: f.id, status: e.target.value })}>
                {["new", "reviewed", "actioned", "dismissed"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </td>
          </tr>
        ))}
      </RsTable>
      {data ? <RsPager {...data.pagination} onPage={(page) => setParams({ ...params, page })} /> : null}
    </div>
  );
}

export function RsAuditPage() {
  const [params, setParams] = useState<ListParams>({ page: 1, limit: 50 });
  const { data } = useRsAudit(params);
  return (
    <div className="space-y-6">
      <RsPageHeader title="Audit Log" description="Pricing, refunds, template publishing, customer searches and data deletions." />
      <RsTable head={["When", "Action", "By", "Details"]} empty={!data?.items.length}>
        {data?.items.map((l, i) => (
          <tr key={i}>
            <td className="px-4 py-2 text-xs">{fmtDate(l.createdAt)}</td>
            <td className="px-4 py-2">{l.action.replace("resume_studio.", "")}</td>
            <td className="px-4 py-2 font-mono text-xs">{l.userId || "customer/system"}</td>
            <td className="px-4 py-2 font-mono text-xs">{JSON.stringify(l.metadata)}</td>
          </tr>
        ))}
      </RsTable>
      {data ? <RsPager {...data.pagination} onPage={(page) => setParams({ ...params, page })} /> : null}
    </div>
  );
}
