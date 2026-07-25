"use client";

import { useEffect, useState } from "react";
import { SidebarProvider, useSidebar } from "@/hooks/use-sidebar";
import { Sidebar, SidebarMobile } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { CommandPalette } from "@/components/admin/layout/CommandPalette";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";

function AdminShellContent({ children }: { children: React.ReactNode }) {
  const { width } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div className="min-h-screen bg-admin-bg text-admin-text">
      <Sidebar onOpenSearch={() => setCommandOpen(true)} />
      <SidebarMobile onOpenSearch={() => setCommandOpen(true)} />

      <div
        className="min-h-screen transition-[padding] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
        style={{ paddingLeft: isMobile ? 0 : width }}
      >
        <AdminHeader onOpenCommand={() => setCommandOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">
          <AdminBreadcrumb />
          {children}
        </main>
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminShellContent>{children}</AdminShellContent>
    </SidebarProvider>
  );
}
