import { Suspense } from "react";
import { ApplicationListPage } from "@/components/admin/applications/ApplicationListPage";
import { Skeleton } from "@/components/ui/skeleton";

function ApplicationsFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );
}

export default function AdminApplicationsPage() {
  return (
    <Suspense fallback={<ApplicationsFallback />}>
      <ApplicationListPage />
    </Suspense>
  );
}
