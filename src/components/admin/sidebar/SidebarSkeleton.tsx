import { Skeleton } from "@/components/ui/skeleton";

interface SidebarSkeletonProps {
  collapsed?: boolean;
}

export function SidebarSkeleton({ collapsed = false }: SidebarSkeletonProps) {
  return (
    <div className="space-y-6 p-3">
      {!collapsed && <Skeleton className="mx-2 h-9 w-full rounded-xl" />}
      {Array.from({ length: 4 }).map((_, groupIndex) => (
        <div key={groupIndex} className="space-y-2">
          {!collapsed && <Skeleton className="mx-2 h-3 w-20" />}
          {Array.from({ length: 3 }).map((_, itemIndex) => (
            <Skeleton
              key={itemIndex}
              className={collapsed ? "mx-auto h-9 w-9 rounded-xl" : "mx-2 h-9 w-[calc(100%-1rem)] rounded-xl"}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
