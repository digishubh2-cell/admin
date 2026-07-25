"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, LogOut, Menu, Monitor, Search, User } from "lucide-react";
import { toast } from "sonner";
import { logoutAllRequest, logoutRequest } from "@/lib/api/auth";
import { useAuth } from "@/hooks/use-auth";
import { useSidebar } from "@/hooks/use-sidebar";
import { ThemeToggle } from "@/components/admin/layout/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminHeaderProps {
  onOpenCommand: () => void;
}

export function AdminHeader({ onOpenCommand }: AdminHeaderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useAuth();
  const { setMobileOpen } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleLogout() {
    try {
      await logoutRequest();
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Failed to logout");
    }
  }

  async function handleLogoutAll() {
    try {
      await logoutAllRequest();
      queryClient.clear();
      toast.success("Logged out from all devices");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Failed to logout from all devices");
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-admin-border bg-admin-bg/80 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          className="hidden h-9 w-72 justify-start gap-2 text-admin-text-muted md:flex"
          onClick={onOpenCommand}
        >
          <Search className="h-4 w-4" />
          <span className="text-sm">Search everywhere...</span>
          <kbd className="ml-auto rounded-md border border-admin-border bg-admin-muted px-1.5 py-0.5 text-[10px] font-medium">
            ⌘K
          </kbd>
        </Button>
        <Button variant="outline" size="icon" className="md:hidden" onClick={onOpenCommand}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {mounted && <ThemeToggle />}

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials || "SA"}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">{user?.name || "Admin"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.name}</span>
                <span className="text-xs font-normal text-admin-text-muted">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Monitor className="h-4 w-4" />
              Sessions
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogoutAll}>
              <LogOut className="h-4 w-4" />
              Logout all devices
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
