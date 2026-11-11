"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function RsPageHeader({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-admin-text-secondary">{description}</p>
      </div>
      {actions}
    </div>
  );
}

export function RsStat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-2xl border border-admin-border bg-admin-surface p-4">
      <p className="text-sm text-admin-text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      {hint ? <p className="mt-1 text-xs text-admin-text-muted">{hint}</p> : null}
    </div>
  );
}

export function RsCard({ title, children, actions }: { title?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-admin-border bg-admin-surface p-4">
      {title || actions ? (
        <div className="mb-3 flex items-center justify-between gap-2">
          {title ? <h2 className="font-semibold">{title}</h2> : <span />}
          {actions}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function RsTable({ head, children, empty }: { head: string[]; children: ReactNode; empty?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-admin-border bg-admin-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-admin-border text-xs uppercase text-admin-text-muted">
          <tr>{head.map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-admin-border">{children}</tbody>
      </table>
      {empty ? <p className="p-6 text-center text-sm text-admin-text-muted">Nothing here yet.</p> : null}
    </div>
  );
}

const TONE: Record<string, "success" | "danger" | "warning" | "outline"> = {
  paid: "success",
  ready: "success",
  published: "success",
  ok: "success",
  active: "success",
  failed: "danger",
  needs_support: "danger",
  disputed: "danger",
  suspended: "danger",
  refunded: "warning",
  partially_refunded: "warning",
};

export function RsStatus({ value }: { value: string }) {
  return <Badge variant={TONE[value] || "outline"} className="capitalize">{value.replace(/_/g, " ")}</Badge>;
}

export function RsPager({ page, totalPages, total, onPage }: { page: number; totalPages: number; total: number; onPage: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between rounded-2xl border border-admin-border bg-admin-surface px-4 py-3">
      <p className="text-sm text-admin-text-muted">Page {page} of {totalPages} · {total} total</p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</Button>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>Next</Button>
      </div>
    </div>
  );
}

export function fmtDate(value?: string | null) {
  return value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";
}

export function fmtBytes(bytes: number) {
  if (bytes > 1024 * 1024 * 1024) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  if (bytes > 1024 * 1024) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}
