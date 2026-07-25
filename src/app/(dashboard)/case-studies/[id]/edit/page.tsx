import { CaseStudyEditor } from "@/components/admin/case-studies/CaseStudyEditor";

export default async function EditCaseStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CaseStudyEditor caseStudyId={id} />;
}
