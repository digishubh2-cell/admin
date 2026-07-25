import { JobEditor } from "@/components/admin/jobs/JobEditor";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <JobEditor jobId={id} />;
}
