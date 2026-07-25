"use client";

import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  collapsed?: boolean;
}

export function SidebarHeader({ collapsed = false }: SidebarHeaderProps) {
  const { toggleCollapsed } = useSidebar();

  return (
    <div
      className={cn(
        "flex h-14 shrink-0 items-center border-b border-admin-border px-3",
        collapsed ? "justify-center" : "justify-between"
      )}
    >
      {!collapsed && (
        <Link href="/" className="flex min-w-0 items-center gap-2.5 px-1">
          <Logo href={false} imageClassName="h-7 lg:h-7 xl:h-7" />
        </Link>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleCollapsed}
        className="h-8 w-8 shrink-0 text-admin-text-muted hover:text-admin-text"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <PanelLeftOpen className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
