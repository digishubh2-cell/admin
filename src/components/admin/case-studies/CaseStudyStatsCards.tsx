"use client";

import {
  Archive,
  Building2,
  Calendar,
  Eye,
  FileText,
  MousePointerClick,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CaseStudyStats } from "@/types/case-study";

const statConfig = [
  { key: "published", label: "Published", icon: FileText, color: "text-success" },
  { key: "drafts", label: "Drafts", icon: FileText, color: "text-admin-text-muted" },
  { key: "featured", label: "Featured", icon: Star, color: "text-warning" },
  { key: "industries", label: "Industries", icon: Building2, color: "text-primary" },
  { key: "clients", label: "Clients", icon: Users, color: "text-primary" },
  { key: "totalViews", label: "Total Views", icon: Eye, color: "text-primary" },
  { key: "monthlyViews", label: "Monthly Views", icon: TrendingUp, color: "text-primary" },
  { key: "conversions", label: "Conversions", icon: Target, color: "text-success" },
  { key: "ctaClicks", label: "CTA Clicks", icon: MousePointerClick, color: "text-primary" },
  { key: "scheduled", label: "Scheduled", icon: Calendar, color: "text-primary" },
  { key: "archived", label: "Archived", icon: Archive, color: "text-admin-text-muted" },
  { key: "averageSeoScore", label: "Avg SEO Score", icon: TrendingUp, color: "text-success", suffix: "/100" },
] as const;

export function CaseStudyStatsCards({
  stats,
  isLoading,
}: {
  stats?: CaseStudyStats;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                  {stats?.[key as keyof CaseStudyStats] ?? 0}
                  {suffix}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
