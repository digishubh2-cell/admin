"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SIDEBAR_STORAGE_KEYS, SIDEBAR_WIDTH } from "@/constants/admin-navigation";

interface SidebarContextValue {
  collapsed: boolean;
  mobileOpen: boolean;
  groupState: Record<string, boolean>;
  width: number;
  toggleCollapsed: () => void;
  setCollapsed: (value: boolean) => void;
  setMobileOpen: (value: boolean) => void;
  toggleGroup: (groupId: string) => void;
  isGroupOpen: (groupId: string, defaultOpen?: boolean) => boolean;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

function readCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SIDEBAR_STORAGE_KEYS.collapsed) === "true";
}

function readGroupState(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SIDEBAR_STORAGE_KEYS.groups);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsedState] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [groupState, setGroupState] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCollapsedState(readCollapsed());
    setGroupState(readGroupState());
    setHydrated(true);
  }, []);

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value);
    localStorage.setItem(SIDEBAR_STORAGE_KEYS.collapsed, String(value));
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed]);

  const toggleGroup = useCallback((groupId: string) => {
    setGroupState((prev) => {
      const next = { ...prev, [groupId]: !(prev[groupId] ?? true) };
      localStorage.setItem(SIDEBAR_STORAGE_KEYS.groups, JSON.stringify(next));
      return next;
    });
  }, []);

  const isGroupOpen = useCallback(
    (groupId: string, defaultOpen = true) => {
      if (!hydrated) return defaultOpen;
      return groupState[groupId] ?? defaultOpen;
    },
    [groupState, hydrated]
  );

  const width = collapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded;

  const value = useMemo(
    () => ({
      collapsed,
      mobileOpen,
      groupState,
      width,
      toggleCollapsed,
      setCollapsed,
      setMobileOpen,
      toggleGroup,
      isGroupOpen,
    }),
    [
      collapsed,
      mobileOpen,
      groupState,
      width,
      toggleCollapsed,
      setCollapsed,
      toggleGroup,
      isGroupOpen,
    ]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}
