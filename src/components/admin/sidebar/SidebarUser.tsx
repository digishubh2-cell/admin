"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Settings } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { logoutRequest } from "@/lib/api/auth";
import { useNavigation } from "@/hooks/use-navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SidebarTooltip } from "./SidebarTooltip";

interface SidebarUserProps {
  collapsed?: boolean;
}

export function SidebarUser({ collapsed = false }: SidebarUserProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, role } = useNavigation();

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roleLabel = role.replace(/_/g, " ");

  async function handleLogout() {
    try {
      await logoutRequest();
      queryClient.clear();
      toast.success("Logged out");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Logout failed");
    }
  }

  const profile = (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl border border-admin-border bg-admin-muted/30 p-2",
        collapsed && "justify-center border-0 bg-transparent p-0"
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
          {initials || "SD"}
        </AvatarFallback>
      </Avatar>

      {!collapsed && (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-admin-text">
            {user?.name || "Admin"}
          </p>
          <p className="truncate text-[11px] capitalize text-admin-text-muted">
            {roleLabel}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-1.5">
      {collapsed ? (
        <SidebarTooltip label={user?.name || "Account"}>{profile}</SidebarTooltip>
      ) : (
        profile
      )}

      <div className={cn("flex gap-1", collapsed && "flex-col items-center")}>
        {collapsed ? (
          <>
            <SidebarTooltip label="Settings">
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
            </SidebarTooltip>
            <SidebarTooltip label="Logout">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-admin-text-muted hover:text-danger"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </SidebarTooltip>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" className="h-8 flex-1 gap-1.5 text-xs" asChild>
              <Link href="/settings">
                <Settings className="h-3.5 w-3.5" />
                Settings
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 flex-1 gap-1.5 text-xs text-admin-text-muted hover:text-danger"
              onClick={handleLogout}
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
