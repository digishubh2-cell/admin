"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useResource, useResourceMutations } from "@/hooks/use-resources";
import type { Resource } from "@/types/resource";
import { estimateReadTime, estimateResourceSeoScore, slugify } from "@/lib/resource/utils";
import { resourceDefaultValues } from "./resourceDefaults";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeoScoreBadge, StatusBadge } from "@/components/ui/badge";
import { ResourceGeneralTab } from "./tabs/ResourceGeneralTab";
import { ResourceContentTab } from "./tabs/ResourceContentTab";
import { ResourceMediaTab } from "./tabs/ResourceMediaTab";
import { ResourceDownloadsTab } from "./tabs/ResourceDownloadsTab";
import { ResourceSeoTab } from "./tabs/ResourceSeoTab";
import { ResourceAiSeoTab } from "./tabs/ResourceAiSeoTab";
import {
  ResourcePublishingTab,
  ResourceSchemaTab,
  ResourceSettingsTab,
} from "./tabs/ResourcePublishingTab";
import { ResourcePreviewTab } from "./tabs/ResourcePreviewTab";

interface Props {
  resourceId?: string;
}

export function ResourceEditor({ resourceId }: Props) {
  const router = useRouter();
  const isEdit = !!resourceId;
  const { data: existing, isLoading } = useResource(resourceId || "");
  const { create, update } = useResourceMutations();
  const [activeTab, setActiveTab] = useState("general");
  const [autoSlug, setAutoSlug] = useState(!isEdit);

  const form = useForm<Partial<Resource>>({ defaultValues: resourceDefaultValues });
  const { register, handleSubmit, watch, setValue, reset, formState } = form;
  const values = watch();

  useEffect(() => {
    if (existing) {
      reset(existing);
      setAutoSlug(false);
    }
  }, [existing, reset]);

  useEffect(() => {
    if (autoSlug && values.title) {
      setValue("slug", slugify(values.title));
    }
  }, [values.title, autoSlug, setValue]);

  const readTime = estimateReadTime(values.content || "");
  const downloadTime = values.downloads?.length
    ? Math.max(1, Math.ceil(values.downloads.length * 0.5))
    : 0;
  const seoScore = estimateResourceSeoScore(values as Record<string, unknown>);

  async function onSubmit(data: Partial<Resource>) {
    try {
      const payload = { ...data, readTimeMinutes: readTime, downloadTimeMinutes: downloadTime };
      if (isEdit && resourceId) {
        await update.mutateAsync({ id: resourceId, payload });
        toast.success("Resource saved");
      } else {
        const r = await create.mutateAsync(payload);
        toast.success("Resource created");
        router.push(`/resources/${r.id}/edit`);
      }
    } catch {
      toast.error("Failed to save resource");
    }
  }

  if (isEdit && isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isSaving = create.isPending || update.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="sticky top-14 z-20 -mx-4 border-b border-admin-border bg-admin-bg/90 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/resources"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{isEdit ? "Edit Resource" : "Create Resource"}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {values.status && <StatusBadge status={values.status} />}
                <SeoScoreBadge score={seoScore} />
                <span className="text-xs text-admin-text-muted">{readTime} min read</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setValue("status", "draft")}>
              Save Draft
            </Button>
            <Button type="submit" disabled={isSaving} onClick={() => setValue("status", "published")}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {values.status === "published" ? "Update" : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex h-auto flex-wrap gap-1">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="ai-seo">LLM SEO</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <ResourceGeneralTab
            register={register}
            setValue={setValue}
            values={values}
            autoSlug={autoSlug}
            setAutoSlug={setAutoSlug}
            readTime={readTime}
            downloadTime={downloadTime}
          />
        </TabsContent>
        <TabsContent value="content">
          <ResourceContentTab register={register} setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="media">
          <ResourceMediaTab setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="downloads">
          <ResourceDownloadsTab setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="seo">
          <ResourceSeoTab setValue={setValue} values={values} seoScore={seoScore} />
        </TabsContent>
        <TabsContent value="ai-seo">
          <ResourceAiSeoTab setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="schema">
          <ResourceSchemaTab setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="publishing">
          <ResourcePublishingTab register={register} setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="settings">
          <ResourceSettingsTab setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="preview">
          <ResourcePreviewTab values={values} seoScore={seoScore} readTime={readTime} />
        </TabsContent>
      </Tabs>

      {formState.errors.title && (
        <p className="text-sm text-danger">Title is required</p>
      )}
    </form>
  );
}
