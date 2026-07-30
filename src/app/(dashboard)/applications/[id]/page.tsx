import { Suspense } from "react";
import { ApplicationDetailPage } from "@/components/admin/applications/ApplicationDetailPage";

function DetailFallback() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-72 animate-pulse rounded-xl bg-admin-muted" />
      <div className="h-24 animate-pulse rounded-2xl bg-admin-muted" />
      <div className="h-12 animate-pulse rounded-xl bg-admin-muted" />
      <div className="h-96 animate-pulse rounded-2xl bg-admin-muted" />
    </div>
  );
}

export default async function AdminApplicationDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<DetailFallback />}>
      <ApplicationDetailPage applicationId={id} />
    </Suspense>
  );
}
