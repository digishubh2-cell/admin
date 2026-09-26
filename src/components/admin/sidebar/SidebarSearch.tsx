"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarSearchProps {
  collapsed?: boolean;
  onOpenSearch: () => void;
}

export function SidebarSearch({ collapsed = false, onOpenSearch }: SidebarSearchProps) {
  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onOpenSearch}
        className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl border border-admin-border bg-admin-muted/40 text-admin-text-muted transition-colors hover:bg-admin-muted hover:text-admin-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        aria-label="Search everywhere"
      >
        <Search className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpenSearch}
      className={cn(
        "flex h-9 w-full items-center gap-2 rounded-xl border border-admin-border bg-admin-muted/30 px-3 text-sm text-admin-text-muted",
        "transition-all hover:border-admin-border hover:bg-admin-muted/60 hover:text-admin-text-secondary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
      )}
    >
      <Search className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-left">Search everywhere...</span>
      <kbd className="type-tech hidden rounded border border-admin-border bg-admin-surface px-1.5 py-0.5 sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}
