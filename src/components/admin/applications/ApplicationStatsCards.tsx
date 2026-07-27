"use client";

import {
  Archive,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  Inbox,
  Sparkles,
  ThumbsDown,
  UserCheck,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApplicationStats } from "@/types/application";

const statConfig = [
  { key: "total" as const, label: "Total", icon: Inbox, color: "text-primary" },
  { key: "new" as const, label: "New", icon: Sparkles, color: "text-primary" },
  { key: "under_review" as const, label: "Review", icon: UserCheck, color: "text-warning" },
  { key: "shortlisted" as const, label: "Shortlisted", icon: BadgeCheck, color: "text-success" },
  {
    key: "assessment_invited" as const,
    label: "Test invited",
    icon: ClipboardCheck,
    color: "text-primary",
  },
  { key: "qualified" as const, label: "Qualified", icon: BadgeCheck, color: "text-success" },
  { key: "interview" as const, label: "Interview", icon: Users, color: "text-primary" },
  { key: "offered" as const, label: "Offered", icon: Briefcase, color: "text-warning" },
  { key: "hired" as const, label: "Hired", icon: CheckCircle2, color: "text-success" },
  { key: "completed" as const, label: "Completed", icon: BadgeCheck, color: "text-success" },
  { key: "rejected" as const, label: "Rejected", icon: ThumbsDown, color: "text-danger" },
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
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5">
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
