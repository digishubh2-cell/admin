import { AttemptDetailPage } from "@/components/admin/assessments/AttemptDetailPage";

export default async function AdminAssessmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AttemptDetailPage attemptId={id} />;
}
