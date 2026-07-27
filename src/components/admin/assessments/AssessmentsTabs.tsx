"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/assessments", label: "Attempts", match: (p: string) => p === "/assessments" || /^\/assessments\/[^/]+$/.test(p) },
  { href: "/assessments/questions", label: "Question bank" },
  { href: "/assessments/templates", label: "Templates" },
];

export function AssessmentsTabs() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-1 rounded-xl border border-admin-border bg-admin-surface p-1">
      {TABS.map((tab) => {
        const active = tab.match ? tab.match(pathname) : pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-white"
                : "text-admin-text-secondary hover:bg-admin-muted/60 hover:text-admin-text"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
