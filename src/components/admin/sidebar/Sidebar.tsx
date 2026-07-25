"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useNavigation } from "@/hooks/use-navigation";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarGroup } from "./SidebarGroup";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarSearch } from "./SidebarSearch";
import { SidebarSkeleton } from "./SidebarSkeleton";

interface SidebarProps {
  onOpenSearch: () => void;
  className?: string;
}

export function Sidebar({ onOpenSearch, className }: SidebarProps) {
  const { collapsed, width } = useSidebar();
  const { sections, isLoading } = useNavigation();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-admin-border bg-admin-surface md:flex",
          "transition-[width] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          className
        )}
        style={{ width }}
        aria-label="Main navigation"
      >
        <SidebarHeader collapsed={collapsed} />

        <div className={cn("shrink-0 px-3 py-3", collapsed && "px-2")}>
          <SidebarSearch collapsed={collapsed} onOpenSearch={onOpenSearch} />
        </div>

        <nav
          className="sidebar-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3"
          aria-label="Sidebar navigation"
        >
          {isLoading ? (
            <SidebarSkeleton collapsed={collapsed} />
          ) : (
            <div className="space-y-4">
              {sections.map((section) => (
                <SidebarGroup
                  key={section.id}
                  section={section}
                  collapsed={collapsed}
                />
              ))}
            </div>
          )}
        </nav>

        <SidebarFooter collapsed={collapsed} />
      </aside>
    </TooltipProvider>
  );
}
