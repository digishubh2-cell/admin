"use client";

import { useState } from "react";
import { useRsDashboard } from "@/hooks/use-resume-studio";
import { inr } from "@/lib/api/resume-studio";
import { RsCard, RsPageHeader, RsStat, fmtBytes } from "./RsUi";

function FunnelBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm"><span>{label}</span><span className="font-medium">{value}</span></div>
      <div className="mt-1 h-2 rounded-full bg-admin-muted/40"><div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

export function RsOverviewPage() {
  const [days, setDays] = useState(30);
  const { data, isLoading } = useRsDashboard(days);

  return (
    <div className="space-y-6">
      <RsPageHeader
        title="Resume Studio"
        description="Product funnel, revenue, exports and costs. Figures come from the database, not analytics."
        actions={
          <select className="rounded-xl border border-admin-border bg-admin-surface px-3 py-2 text-sm" value={days} onChange={(e) => setDays(Number(e.target.value))}>
            {[7, 30, 90].map((d) => <option key={d} value={d}>Last {d} days</option>)}
          </select>
        }
      />
      {isLoading || !data ? (
        <p className="text-sm text-admin-text-muted">Loading…</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <RsStat label="Net revenue" value={inr(data.revenue.netPaise)} hint={`Gross ${inr(data.revenue.grossPaise)} · refunds ${inr(data.revenue.refundedPaise)}`} />
            <RsStat label="Paid orders" value={data.funnel.paidOrders} hint={Object.entries(data.revenue.byPlan).map(([k, v]) => `${k}: ${v}`).join(" · ") || "—"} />
            <RsStat label="AI cost" value={`$${data.aiCostUsd.toFixed(2)}`} hint="Provider cost estimate" />
            <RsStat label="Exports needing support" value={data.exports.needsSupport} hint={`${data.exports.failed} failed in period`} />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <RsCard title="Conversion funnel">
              <div className="space-y-3">
                <FunnelBar label="Resumes created" value={data.funnel.resumes} max={data.funnel.resumes} />
                <FunnelBar label="PDF previews" value={data.funnel.previews} max={data.funnel.resumes} />
                <FunnelBar label="Orders started" value={data.funnel.ordersCreated} max={data.funnel.resumes} />
                <FunnelBar label="Paid" value={data.funnel.paidOrders} max={data.funnel.resumes} />
                <FunnelBar label="Exports delivered" value={data.funnel.exportsReady} max={data.funnel.resumes} />
              </div>
              <p className="mt-3 text-xs text-admin-text-muted">New accounts: {data.accounts} · imports: {data.imports} · feedback: {data.feedback.count}{data.feedback.averageRating ? ` (avg ${data.feedback.averageRating}/5)` : ""}</p>
            </RsCard>
            <RsCard title="Storage and database">
              <ul className="space-y-1 text-sm">
                {data.storage.map((s) => <li key={s.kind} className="flex justify-between"><span>{s.kind}</span><span>{s.count} files · {fmtBytes(s.bytes)}</span></li>)}
                {data.storage.length === 0 ? <li className="text-admin-text-muted">No private files yet.</li> : null}
              </ul>
              {data.database ? (
                <p className="mt-3 text-sm">
                  MongoDB data {fmtBytes(data.database.dataSizeBytes)} · storage {fmtBytes(data.database.storageSizeBytes)} · indexes {fmtBytes(data.database.indexSizeBytes)}
                  {data.database.storageSizeBytes > 400 * 1024 * 1024 ? <span className="ml-2 font-semibold text-danger">Approaching the 512 MB M0 limit</span> : null}
                </p>
              ) : null}
            </RsCard>
          </div>
        </>
      )}
    </div>
  );
}
