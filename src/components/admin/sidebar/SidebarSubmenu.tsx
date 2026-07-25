"use client";

import type { NavItem } from "@/types/navigation";
import { SidebarItem } from "./SidebarItem";

interface SidebarSubmenuProps {
  items: NavItem[];
  onNavigate?: () => void;
}

export function SidebarSubmenu({ items, onNavigate }: SidebarSubmenuProps) {
  return (
    <ul className="mt-0.5 space-y-0.5 border-l border-admin-border/80 ml-5 pl-1">
      {items.map((item) => (
        <li key={item.id}>
          <SidebarItem item={item} nested onNavigate={onNavigate} />
        </li>
      ))}
    </ul>
  );
}
