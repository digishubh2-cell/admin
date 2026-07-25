"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useNavigation } from "@/hooks/use-navigation";
import { searchNavItems } from "@/lib/navigation/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { sections } = useNavigation();

  const results = searchNavItems(query, sections);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  function navigate(href: string) {
    onOpenChange(false);
    setQuery("");
    router.push(href);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Search everywhere</DialogTitle>
        </DialogHeader>
        <Command className="bg-admin-surface" shouldFilter={false}>
          <div className="flex items-center border-b border-admin-border px-4">
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search pages, blogs, leads, settings..."
              className="flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-admin-text-muted"
            />
          </div>
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-admin-text-muted">
              No results found.
            </Command.Empty>
            <Command.Group heading="Navigate" className="px-2 text-xs text-admin-text-muted">
              {results.map((item) => {
                const Icon = item.icon;
                return (
                  <Command.Item
                    key={item.href}
                    value={item.id}
                    onSelect={() => navigate(item.href)}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm aria-selected:bg-admin-muted"
                  >
                    <Icon className="h-4 w-4 text-admin-text-muted" />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-admin-text-muted">{item.description}</p>
                      )}
                    </div>
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
