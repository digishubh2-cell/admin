import { BlogEditor } from "@/components/admin/blogs/BlogEditor";

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  return <BlogEditor blogId={id} />;
}
