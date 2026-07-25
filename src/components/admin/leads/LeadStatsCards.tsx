"use client";

import { Inbox, MessageCircle, Sparkles, Trophy, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { LeadStats } from "@/types/lead";

const statConfig = [
  { key: "total" as const, label: "Total Leads", icon: Inbox, color: "text-primary" },
  { key: "new" as const, label: "New", icon: Sparkles, color: "text-primary" },
  { key: "contacted" as const, label: "Contacted", icon: MessageCircle, color: "text-warning" },
  { key: "qualified" as const, label: "Qualified", icon: UserCheck, color: "text-success" },
  { key: "won" as const, label: "Won", icon: Trophy, color: "text-success" },
];

export function LeadStatsCards({
  stats,
  isLoading,
}: {
  stats?: LeadStats;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {statConfig.map(({ key, label, icon: Icon, color }) => (
        <Card key={key} className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`rounded-xl bg-admin-muted p-2.5 ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-admin-text-muted">{label}</p>
              <p className="text-xl font-semibold tabular-nums">{stats?.[key] ?? 0}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
