"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/hooks/use-navigation";
import { useSidebar } from "@/hooks/use-sidebar";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarGroup } from "./SidebarGroup";
import { SidebarSearch } from "./SidebarSearch";
import { SidebarSkeleton } from "./SidebarSkeleton";

interface SidebarMobileProps {
  onOpenSearch: () => void;
}

export function SidebarMobile({ onOpenSearch }: SidebarMobileProps) {
  const { mobileOpen, setMobileOpen } = useSidebar();
  const { sections, isLoading } = useNavigation();

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          />

          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-y-0 left-0 z-50 flex w-[min(100vw-3rem,280px)] flex-col border-r border-admin-border bg-admin-surface md:hidden"
            aria-label="Mobile navigation"
          >
            <TooltipProvider delayDuration={0}>
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-admin-border px-3">
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <Logo href={false} imageClassName="h-7 lg:h-7 xl:h-7" />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="px-3 py-3">
                <SidebarSearch onOpenSearch={onOpenSearch} />
              </div>

              <nav className="sidebar-scroll min-h-0 flex-1 overflow-y-auto px-3 pb-3">
                {isLoading ? (
                  <SidebarSkeleton />
                ) : (
                  <div className="space-y-4">
                    {sections.map((section) => (
                      <SidebarGroup
                        key={section.id}
                        section={section}
                        onNavigate={() => setMobileOpen(false)}
                      />
                    ))}
                  </div>
                )}
              </nav>

              <SidebarFooter />
            </TooltipProvider>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
