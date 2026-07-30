"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { getNavItemBySlug } from "@/lib/navigation/utils";
import { cn } from "@/lib/utils";

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.replace("/", "").split("/").filter(Boolean);
  const currentSlug = segments[0] || "dashboard";
  const current = getNavItemBySlug(currentSlug);
  const hasDetail = segments.length > 1;

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex items-center gap-2 text-sm text-admin-text-muted"
    >
      <Link
        href="/"
        className="inline-flex items-center gap-1 transition-colors hover:text-admin-text"
      >
        <Home className="h-3.5 w-3.5" />
        Dashboard
      </Link>
      {current && current.slug !== "dashboard" && (
        <>
          <ChevronRight className="h-3.5 w-3.5" />
          {hasDetail ? (
            <Link
              href={current.href}
              className="transition-colors hover:text-admin-text"
            >
              {current.title}
            </Link>
          ) : (
            <span className={cn("font-medium text-admin-text")}>
              {current.title}
            </span>
          )}
        </>
      )}
      {hasDetail && currentSlug === "applications" ? (
        <>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-admin-text">Candidate</span>
        </>
      ) : null}
      {hasDetail && currentSlug === "assessments" && segments[1] !== "questions" && segments[1] !== "templates" ? (
        <>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-admin-text">Attempt</span>
        </>
      ) : null}
    </nav>
  );
}
