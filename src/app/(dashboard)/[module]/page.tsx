import { notFound } from "next/navigation";
import { flattenNavItems } from "@/lib/navigation/utils";
import { navigation } from "@/constants/admin-navigation";
import { ModulePlaceholder } from "@/components/admin/modules/ModulePlaceholder";

interface ModulePageProps {
  params: Promise<{ module: string }>;
}

export async function generateStaticParams() {
  const slugs = flattenNavItems(navigation)
    .map((item) => item.slug)
    .filter((slug) => slug !== "dashboard");

  return slugs.map((module) => ({ module }));
}

export default async function AdminModulePage({ params }: ModulePageProps) {
  const { module } = await params;
  const exists = flattenNavItems(navigation).some((item) => item.slug === module);

  if (!exists || module === "dashboard") {
    notFound();
  }

  return <ModulePlaceholder slug={module} />;
}
