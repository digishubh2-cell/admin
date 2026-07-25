"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

interface SidebarTooltipProps {
  label: string;
  children: React.ReactNode;
  side?: "right" | "top" | "bottom" | "left";
  show?: boolean;
}

export function SidebarTooltip({
  label,
  children,
  side = "right",
  show = true,
}: SidebarTooltipProps) {
  if (!show) return <>{children}</>;

  return (
    <TooltipPrimitive.Root delayDuration={0}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={8}
          className={cn(
            "z-[100] rounded-lg bg-admin-dark px-2.5 py-1.5 text-xs font-medium text-white shadow-lg",
            "animate-in fade-in-0 zoom-in-95"
          )}
        >
          {label}
          <TooltipPrimitive.Arrow className="fill-admin-dark" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
