"use client";

import {
  Archive,
  BadgeCheck,
  Inbox,
  Sparkles,
  ThumbsDown,
  UserCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApplicationStats } from "@/types/application";

const statConfig = [
  { key: "total" as const, label: "Total", icon: Inbox, color: "text-primary" },
  { key: "new" as const, label: "New", icon: Sparkles, color: "text-primary" },
  { key: "under_review" as const, label: "Under review", icon: UserCheck, color: "text-warning" },
  { key: "shortlisted" as const, label: "Shortlisted", icon: BadgeCheck, color: "text-success" },
  { key: "rejected" as const, label: "Rejected", icon: ThumbsDown, color: "text-danger" },
  { key: "verified" as const, label: "Verified emails", icon: BadgeCheck, color: "text-success" },
  { key: "archived" as const, label: "Archived", icon: Archive, color: "text-admin-text-muted" },
];

export function ApplicationStatsCards({
  stats,
  isLoading,
}: {
  stats?: ApplicationStats;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
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
