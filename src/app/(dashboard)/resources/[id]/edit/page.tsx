import { ResourceEditor } from "@/components/admin/resources/ResourceEditor";

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ResourceEditor resourceId={id} />;
}
