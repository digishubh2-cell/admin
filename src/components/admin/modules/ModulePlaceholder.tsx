import { getNavItemBySlug } from "@/lib/navigation/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ModulePlaceholderProps {
  slug: string;
}

export function ModulePlaceholder({ slug }: ModulePlaceholderProps) {
  const module = getNavItemBySlug(slug);

  if (!module) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Module not found</CardTitle>
          <CardDescription>The requested admin module does not exist.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const Icon = module.icon;

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{module.title}</h1>
        <p className="mt-2 max-w-2xl text-admin-text-secondary">{module.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module scaffold ready</CardTitle>
          <CardDescription>
            This module is wired into the admin navigation and ready for feature development.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button>Create {module.title.slice(0, -1) || module.title}</Button>
          <Button variant="outline">Import data</Button>
          <Button variant="secondary">Configure</Button>
        </CardContent>
      </Card>
    </div>
  );
}
