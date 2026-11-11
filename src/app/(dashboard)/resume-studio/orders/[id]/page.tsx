import { RsOrderDetailPage } from "@/components/admin/resume-studio/RsOrderDetailPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RsOrderDetailPage id={id} />;
}
