"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isNavItemActive } from "@/lib/navigation/utils";
import type { NavItem } from "@/types/navigation";
import { SidebarTooltip } from "./SidebarTooltip";

interface SidebarItemProps {
  item: NavItem;
  collapsed?: boolean;
  nested?: boolean;
  onNavigate?: () => void;
}

export function SidebarItem({
  item,
  collapsed = false,
  nested = false,
  onNavigate,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = isNavItemActive(pathname, item.href);
  const Icon = item.icon;

  const content = (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        nested ? "py-2 pl-9 pr-3" : "px-3 py-2",
        collapsed && "justify-center px-2 py-2.5",
        isActive
          ? "bg-primary/[0.08] text-primary shadow-sm"
          : "text-admin-text-secondary hover:bg-admin-muted/70 hover:text-admin-text"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && (
        <span
          className={cn(
            "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary transition-all",
            collapsed && "left-0 h-4 w-[2px]"
          )}
          aria-hidden
        />
      )}

      <Icon
        className={cn(
          "h-[18px] w-[18px] shrink-0 transition-colors",
          isActive
            ? "text-primary"
            : "text-admin-text-muted group-hover:text-admin-text"
        )}
      />

      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.title}</span>
          {item.badge && (
            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              {item.badge}
            </span>
          )}
          {item.badgeCount != null && item.badgeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-white">
              {item.badgeCount > 99 ? "99+" : item.badgeCount}
            </span>
          )}
        </>
      )}

      {collapsed && item.badgeCount != null && item.badgeCount > 0 && (
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <SidebarTooltip label={item.title} show>
        {content}
      </SidebarTooltip>
    );
  }

  return content;
}
