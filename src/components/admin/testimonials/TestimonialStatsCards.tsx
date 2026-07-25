"use client";

import {
  Archive,
  Eye,
  MessageSquareQuote,
  Star,
  TrendingUp,
  Video,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TestimonialStats } from "@/types/testimonial";

const statConfig = [
  { key: "total", label: "Total Testimonials", icon: MessageSquareQuote, color: "text-primary" },
  { key: "published", label: "Published", icon: MessageSquareQuote, color: "text-success" },
  { key: "drafts", label: "Drafts", icon: MessageSquareQuote, color: "text-admin-text-muted" },
  { key: "featured", label: "Featured", icon: Star, color: "text-warning" },
  { key: "videoTestimonials", label: "Video Testimonials", icon: Video, color: "text-primary" },
  { key: "averageRating", label: "Average Rating", icon: Star, color: "text-warning", suffix: "/5" },
  { key: "totalReviews", label: "Total Reviews", icon: MessageSquareQuote, color: "text-primary" },
  { key: "totalViews", label: "Views", icon: Eye, color: "text-primary" },
  { key: "scheduled", label: "Scheduled", icon: MessageSquareQuote, color: "text-primary" },
  { key: "archived", label: "Archived", icon: Archive, color: "text-admin-text-muted" },
  { key: "monthlyViews", label: "Monthly Views", icon: TrendingUp, color: "text-primary" },
  { key: "averageSeoScore", label: "Avg SEO Score", icon: TrendingUp, color: "text-success", suffix: "/100" },
] as const;

export function TestimonialStatsCards({
  stats,
  isLoading,
}: {
  stats?: TestimonialStats;
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
        const value = stats?.[key as keyof TestimonialStats] ?? 0;
        return (
          <Card key={key} className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`rounded-xl bg-admin-muted p-2.5 ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-admin-text-muted">{label}</p>
                <p className="text-xl font-semibold tabular-nums">
                  {value}
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
