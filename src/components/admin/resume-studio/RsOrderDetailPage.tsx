"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRsMutation, useRsOrder } from "@/hooks/use-resume-studio";
import { apiErrorMessage, inr, resumeStudioAdminApi as api } from "@/lib/api/resume-studio";
import { RsCard, RsPageHeader, RsStatus, RsTable, fmtDate } from "./RsUi";

export function RsOrderDetailPage({ id }: { id: string }) {
  const { data, isLoading } = useRsOrder(id);
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const refund = useRsMutation((body: { amountPaise?: number; reason: string }) => api.refund(id, body));
  const extend = useRsMutation((body: { days: number; recompiles: number }) => api.extend(id, body));
  const retry = useRsMutation((exportId: string) => api.retryExport(exportId));

  if (isLoading || !data) return <p className="text-sm text-admin-text-muted">Loading…</p>;
  const { order, events, exports } = data;

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
      <RsPageHeader title={`Order ${order.id.slice(0, 8)}`} description={`${order.accountEmail || "deleted account"} · ${order.planKey} · ${inr(order.amountPaise)}`} actions={<RsStatus value={order.status} />} />
      <Link href="/resume-studio/orders" className="text-sm text-primary underline">← All orders</Link>
      <div className="grid gap-4 lg:grid-cols-2">
        <RsCard title="Payment">
          <dl className="grid grid-cols-[140px_1fr] gap-1 text-sm">
            <dt className="text-admin-text-muted">Razorpay order</dt><dd className="font-mono text-xs">{order.razorpayOrderId || "—"}</dd>
            <dt className="text-admin-text-muted">Payments</dt><dd className="font-mono text-xs">{order.razorpayPaymentIds.join(", ") || "—"}</dd>
            <dt className="text-admin-text-muted">Paid at</dt><dd>{fmtDate(order.paidAt)}</dd>
            <dt className="text-admin-text-muted">Flags</dt><dd className="text-danger">{order.flags?.join(", ") || "—"}</dd>
            <dt className="text-admin-text-muted">Entitlement</dt>
            <dd>{order.entitlement ? `until ${fmtDate(order.entitlement.editWindowEndsAt)} · ${order.entitlement.recompilesLeft} re-exports · tex ${order.entitlement.includesTex ? "yes" : "no"}` : "—"}</dd>
          </dl>
          <h3 className="mt-4 text-sm font-semibold">Status history</h3>
          <ul className="mt-1 space-y-1 text-xs">
            {order.statusHistory.map((h, i) => <li key={i}>{fmtDate(h.at)} — {h.status} ({h.source})</li>)}
          </ul>
        </RsCard>
        <RsCard title="Actions">
          <div className="space-y-4 text-sm">
            <div className="space-y-2">
              <p className="font-medium">Refund (super admin)</p>
              <Input placeholder="Reason (required, stored in audit log)" value={reason} onChange={(e) => setReason(e.target.value)} />
              <Input placeholder={`Amount in ₹ (blank = full ${inr(order.amountPaise)})`} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <Button
                variant="destructive"
                disabled={refund.isPending || reason.trim().length < 3 || !["paid", "partially_refunded"].includes(order.status)}
                onClick={() => confirm("Issue this refund through Razorpay?") && act("Refund issued", () => refund.mutateAsync({ reason: reason.trim(), amountPaise: amount ? Math.round(Number(amount) * 100) : undefined }))}
              >
                Issue refund
              </Button>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Extend entitlement</p>
              <Button variant="outline" disabled={extend.isPending || order.status !== "paid"} onClick={() => act("Extended by 7 days and 2 re-exports", () => extend.mutateAsync({ days: 7, recompiles: 2 }))}>+7 days, +2 re-exports</Button>
            </div>
          </div>
        </RsCard>
      </div>
      <RsCard title="Exports">
        <RsTable head={["Export", "Reason", "Status", "Pages", "Attempts", "Downloads", "Error", ""]} empty={!exports.length}>
          {exports.map((e) => (
            <tr key={e.id}>
              <td className="px-4 py-2 font-mono text-xs">{e.id.slice(0, 8)}</td>
              <td className="px-4 py-2">{e.reason}</td>
              <td className="px-4 py-2"><RsStatus value={e.status} /></td>
              <td className="px-4 py-2">{e.pageCount ?? "—"}</td>
              <td className="px-4 py-2">{e.attempts}</td>
              <td className="px-4 py-2">{e.downloads}</td>
              <td className="px-4 py-2 text-xs">{e.publicError || ""}</td>
              <td className="px-4 py-2">
                {["failed", "needs_support"].includes(e.status) ? <Button size="sm" variant="outline" onClick={() => act("Retry queued", () => retry.mutateAsync(e.id))}>Retry</Button> : null}
              </td>
            </tr>
          ))}
        </RsTable>
      </RsCard>
      <RsCard title="Webhook events">
        <RsTable head={["Event", "Type", "Payment", "Received", "Processed"]} empty={!events.length}>
          {events.map((ev) => (
            <tr key={ev.eventId}>
              <td className="px-4 py-2 font-mono text-xs">{ev.eventId.slice(0, 16)}</td>
              <td className="px-4 py-2">{ev.type}</td>
              <td className="px-4 py-2 font-mono text-xs">{ev.paymentId || "—"}</td>
              <td className="px-4 py-2 text-xs">{fmtDate(ev.receivedAt)}</td>
              <td className="px-4 py-2 text-xs">{fmtDate(ev.processedAt)}</td>
            </tr>
          ))}
        </RsTable>
      </RsCard>
    </div>
  );
}
