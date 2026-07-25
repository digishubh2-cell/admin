"use client";

import {
  Archive,
  Calendar,
  Eye,
  FileText,
  Star,
  Timer,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogStats } from "@/types/blog";

const statConfig = [
  { key: "published", label: "Published", icon: FileText, color: "text-success" },
  { key: "drafts", label: "Drafts", icon: FileText, color: "text-admin-text-muted" },
  { key: "scheduled", label: "Scheduled", icon: Calendar, color: "text-primary" },
  { key: "archived", label: "Archived", icon: Archive, color: "text-admin-text-muted" },
  { key: "totalViews", label: "Total Views", icon: Eye, color: "text-primary" },
  { key: "monthlyViews", label: "Monthly Views", icon: TrendingUp, color: "text-primary" },
  { key: "averageReadTime", label: "Avg Read Time", icon: Timer, color: "text-admin-text-secondary", suffix: " min" },
  { key: "indexedPages", label: "Indexed Pages", icon: FileText, color: "text-success" },
  { key: "featured", label: "Featured", icon: Star, color: "text-warning" },
] as const;

export function BlogStatsCards({
  stats,
  isLoading,
}: {
  stats?: BlogStats;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {statConfig.map((stat) => {
        const { key, label, icon: Icon, color } = stat;
        const suffix = "suffix" in stat ? stat.suffix : "";
        return (
        <Card key={key} className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`rounded-xl bg-admin-muted p-2.5 ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-admin-text-muted">{label}</p>
              <p className="text-xl font-semibold tabular-nums">
                {stats?.[key as keyof BlogStats] ?? 0}
                {suffix || ""}
              </p>
            </div>
          </CardContent>
        </Card>
        );
      })}
    </div>
  );
}
