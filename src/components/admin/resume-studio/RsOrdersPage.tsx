"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useRsOrders } from "@/hooks/use-resume-studio";
import { inr, type ListParams } from "@/lib/api/resume-studio";
import { RsPageHeader, RsPager, RsStatus, RsTable, fmtDate } from "./RsUi";

const STATUSES = ["", "paid", "attempted", "created", "expired", "refunded", "partially_refunded", "disputed"];

export function RsOrdersPage() {
  const [params, setParams] = useState<ListParams>({ page: 1, limit: 25 });
  const [q, setQ] = useState("");
  const { data, isLoading } = useRsOrders(params);

  return (
    <div className="space-y-6">
      <RsPageHeader title="Orders & Payments" description="Razorpay orders, verification history, exports and refunds. Searching by email is audited." />
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setParams({ ...params, page: 1, q: q.trim() || undefined });
        }}
      >
        <Input className="max-w-sm" placeholder="Order ID, order_…/pay_… or email" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="rounded-xl border border-admin-border bg-admin-surface px-3 text-sm" value={params.status || ""} onChange={(e) => setParams({ ...params, page: 1, status: e.target.value || undefined })}>
          {STATUSES.map((s) => <option key={s} value={s}>{s || "All statuses"}</option>)}
        </select>
      </form>
      <RsTable head={["Order", "Customer", "Plan", "Amount", "Status", "Flags", "Created"]} empty={!isLoading && !data?.items.length}>
        {data?.items.map((o) => (
          <tr key={o.id}>
            <td className="px-4 py-3 font-mono text-xs"><Link className="text-primary underline" href={`/resume-studio/orders/${o.id}`}>{o.id.slice(0, 8)}</Link></td>
            <td className="px-4 py-3">{o.accountEmail || "deleted"}</td>
            <td className="px-4 py-3">{o.planKey}{o.type === "upgrade" ? " (upgrade)" : ""}</td>
            <td className="px-4 py-3">{inr(o.amountPaise)}</td>
            <td className="px-4 py-3"><RsStatus value={o.status} /></td>
            <td className="px-4 py-3 text-xs text-danger">{(o.flags || []).join(", ")}</td>
            <td className="px-4 py-3 text-xs">{fmtDate(o.createdAt)}</td>
          </tr>
        ))}
      </RsTable>
      {data ? <RsPager {...data.pagination} onPage={(page) => setParams({ ...params, page })} /> : null}
    </div>
  );
}
