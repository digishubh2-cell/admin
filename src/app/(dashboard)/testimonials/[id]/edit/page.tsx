import { TestimonialEditor } from "@/components/admin/testimonials/TestimonialEditor";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <TestimonialEditor testimonialId={id} />;
}
