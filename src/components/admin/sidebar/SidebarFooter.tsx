"use client";

import { SidebarUser } from "./SidebarUser";

interface SidebarFooterProps {
  collapsed?: boolean;
}

export function SidebarFooter({ collapsed = false }: SidebarFooterProps) {
  return (
    <div className="shrink-0 border-t border-admin-border p-3">
      <SidebarUser collapsed={collapsed} />
    </div>
  );
}
