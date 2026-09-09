"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { warnIfCacheFailed } from "@/lib/cache/afterMutation";
import { useCaseStudy, useCaseStudyMutations } from "@/hooks/use-case-studies";
import type { CaseStudy } from "@/types/case-study";
import { estimateCaseStudySeoScore, estimateReadTime, slugify } from "@/lib/case-study/utils";
import { caseStudyDefaultValues } from "./caseStudyDefaults";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeoScoreBadge, StatusBadge } from "@/components/ui/badge";
import { CaseStudyOverviewTab } from "./tabs/CaseStudyOverviewTab";
import { CaseStudyStoryTab } from "./tabs/CaseStudyStoryTab";
import { CaseStudyExecutionTab } from "./tabs/CaseStudyExecutionTab";
import { CaseStudyResultsTab } from "./tabs/CaseStudyResultsTab";
import { CaseStudyMediaTab } from "./tabs/CaseStudyMediaTab";
import { CaseStudyContentTab } from "./tabs/CaseStudyContentTab";
import { CaseStudyFaqTab } from "./tabs/CaseStudyFaqTab";
import { CaseStudyMetaSeoTab } from "./tabs/CaseStudyMetaSeoTab";
import { CaseStudyAiSeoTab } from "./tabs/CaseStudyAiSeoTab";
import { CaseStudyPublishingTab, CaseStudySchemaTab, CaseStudySettingsTab } from "./tabs/CaseStudyPublishingTab";
import { CaseStudyPreviewTab } from "./tabs/CaseStudyPreviewTab";

interface Props {
  caseStudyId?: string;
}

export function CaseStudyEditor({ caseStudyId }: Props) {
  const router = useRouter();
  const isEdit = !!caseStudyId;
  const { data: existing, isLoading } = useCaseStudy(caseStudyId || "");
  const { create, update } = useCaseStudyMutations();
  const [activeTab, setActiveTab] = useState("overview");
  const [autoSlug, setAutoSlug] = useState(!isEdit);

  const form = useForm<Partial<CaseStudy>>({ defaultValues: caseStudyDefaultValues });
  const { register, handleSubmit, watch, setValue, reset, formState } = form;
  const values = watch();

  useEffect(() => {
    if (existing) {
      reset(existing);
      setAutoSlug(false);
    }
  }, [existing, reset]);

  useEffect(() => {
    if (autoSlug && values.projectName) {
      setValue("slug", slugify(values.projectName));
    }
  }, [values.projectName, autoSlug, setValue]);

  const readTime = estimateReadTime(values.content || "");
  const seoScore = estimateCaseStudySeoScore(values as Record<string, unknown>);

  async function onSubmit(data: Partial<CaseStudy>) {
    try {
      if (isEdit && caseStudyId) {
        const cs = await update.mutateAsync({ id: caseStudyId, payload: { ...data, readTimeMinutes: readTime } });
        toast.success("Case study saved");
        warnIfCacheFailed(cs);
      } else {
        const cs = await create.mutateAsync({ ...data, readTimeMinutes: readTime });
        toast.success("Case study created");
        warnIfCacheFailed(cs);
        router.push(`/case-studies/${cs.id}/edit`);
      }
    } catch {
      toast.error("Failed to save case study");
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
              <Link href="/case-studies"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{isEdit ? "Edit Case Study" : "Create Case Study"}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {values.status && <StatusBadge status={values.status} />}
                <SeoScoreBadge score={seoScore} />
                <span className="text-xs text-admin-text-muted">{readTime} min read</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setValue("status", "draft")}>Save Draft</Button>
            <Button type="submit" disabled={isSaving} onClick={() => setValue("status", "published")}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {values.status === "published" ? "Update" : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex h-auto flex-wrap gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="story">Story</TabsTrigger>
          <TabsTrigger value="execution">Execution</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="ai-seo">LLM SEO</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="overview"><CaseStudyOverviewTab register={register} setValue={setValue} values={values} autoSlug={autoSlug} setAutoSlug={setAutoSlug} /></TabsContent>
        <TabsContent value="story"><CaseStudyStoryTab setValue={setValue} values={values} /></TabsContent>
        <TabsContent value="execution"><CaseStudyExecutionTab setValue={setValue} values={values} /></TabsContent>
        <TabsContent value="results"><CaseStudyResultsTab setValue={setValue} values={values} /></TabsContent>
        <TabsContent value="content"><CaseStudyContentTab register={register} /></TabsContent>
        <TabsContent value="media"><CaseStudyMediaTab setValue={setValue} values={values} /></TabsContent>
        <TabsContent value="faq"><CaseStudyFaqTab setValue={setValue} values={values} /></TabsContent>
        <TabsContent value="seo"><CaseStudyMetaSeoTab setValue={setValue} values={values} seoScore={seoScore} /></TabsContent>
        <TabsContent value="ai-seo"><CaseStudyAiSeoTab setValue={setValue} values={values} /></TabsContent>
        <TabsContent value="schema"><CaseStudySchemaTab setValue={setValue} values={values} /></TabsContent>
        <TabsContent value="publishing"><CaseStudyPublishingTab register={register} setValue={setValue} values={values} /></TabsContent>
        <TabsContent value="settings"><CaseStudySettingsTab setValue={setValue} values={values} /></TabsContent>
        <TabsContent value="preview"><CaseStudyPreviewTab values={values} seoScore={seoScore} readTime={readTime} /></TabsContent>
      </Tabs>

      {formState.errors.projectName && (
        <p className="text-sm text-danger">Project name is required</p>
      )}
    </form>
  );
}
