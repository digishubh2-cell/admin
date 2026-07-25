"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { isSectionActive } from "@/lib/navigation/utils";
import type { NavSection } from "@/types/navigation";
import { useSidebar } from "@/hooks/use-sidebar";
import { SidebarItem } from "./SidebarItem";
import { SidebarSubmenu } from "./SidebarSubmenu";
import { usePathname } from "next/navigation";

interface SidebarGroupProps {
  section: NavSection;
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function SidebarGroup({
  section,
  collapsed = false,
  onNavigate,
}: SidebarGroupProps) {
  const pathname = usePathname();
  const { isGroupOpen, toggleGroup } = useSidebar();
  const open = isGroupOpen(section.id, section.defaultOpen ?? true);
  const hasActiveChild = isSectionActive(pathname, section);
  const SectionIcon = section.icon;

  if (collapsed) {
    return (
      <div className="space-y-0.5">
        {section.items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            collapsed
            onNavigate={onNavigate}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => toggleGroup(section.id)}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors",
          "hover:bg-admin-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
          hasActiveChild && "text-admin-text"
        )}
        aria-expanded={open}
      >
        <SectionIcon className="h-3.5 w-3.5 shrink-0 text-admin-text-muted" />
        <span className="flex-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-admin-text-muted">
          {section.title}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-admin-text-muted transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key={`${section.id}-content`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <ul className="space-y-0.5 pb-1" role="group" aria-label={section.title}>
              {section.items.map((item) => (
                <li key={item.id}>
                  <SidebarItem item={item} onNavigate={onNavigate} />
                  {item.children && item.children.length > 0 && (
                    <SidebarSubmenu
                      items={item.children}
                      onNavigate={onNavigate}
                    />
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
