"use client";

import { useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { filterNavigation, flattenNavItems, resolveNavRole } from "@/lib/navigation/utils";

export function useNavigation() {
  const { data: user, isLoading } = useAuth();
  const role = resolveNavRole(user?.role);

  const sections = useMemo(() => filterNavigation(role), [role]);
  const items = useMemo(() => flattenNavItems(sections), [sections]);

  return {
    role,
    sections,
    items,
    isLoading,
    user,
  };
}
