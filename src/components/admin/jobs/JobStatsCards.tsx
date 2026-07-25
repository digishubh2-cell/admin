"use client";

import { Archive, Briefcase, FileText, GraduationCap, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { JobStats } from "@/types/job";

const statConfig = [
  { key: "published", label: "Published", icon: FileText, color: "text-success" },
  { key: "drafts", label: "Drafts", icon: FileText, color: "text-admin-text-muted" },
  { key: "jobs", label: "Jobs", icon: Briefcase, color: "text-primary" },
  { key: "internships", label: "Internships", icon: GraduationCap, color: "text-primary" },
  { key: "featured", label: "Featured", icon: Star, color: "text-warning" },
  { key: "archived", label: "Archived", icon: Archive, color: "text-admin-text-muted" },
] as const;

export function JobStatsCards({
  stats,
  isLoading,
}: {
  stats?: JobStats;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statConfig.map(({ key, label, icon: Icon, color }) => (
        <Card key={key} className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`rounded-xl bg-admin-muted p-2.5 ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats?.[key] ?? 0}</p>
              <p className="text-xs text-admin-text-muted">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
