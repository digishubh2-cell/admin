"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useTestimonial, useTestimonialMutations } from "@/hooks/use-testimonials";
import type { Testimonial } from "@/types/testimonial";
import { estimateTestimonialSeoScore, slugify } from "@/lib/testimonial/utils";
import { testimonialDefaultValues } from "./testimonialDefaults";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeoScoreBadge, StatusBadge } from "@/components/ui/badge";
import { TestimonialGeneralTab } from "./tabs/TestimonialGeneralTab";
import { TestimonialReviewTab } from "./tabs/TestimonialReviewTab";
import { TestimonialMediaTab } from "./tabs/TestimonialMediaTab";
import { TestimonialCompanyTab } from "./tabs/TestimonialCompanyTab";
import { TestimonialSeoTab } from "./tabs/TestimonialSeoTab";
import { TestimonialAiSeoTab } from "./tabs/TestimonialAiSeoTab";
import {
  TestimonialPublishingTab,
  TestimonialSchemaTab,
  TestimonialSettingsTab,
} from "./tabs/TestimonialPublishingTab";
import { TestimonialPreviewTab } from "./tabs/TestimonialPreviewTab";

interface Props {
  testimonialId?: string;
}

export function TestimonialEditor({ testimonialId }: Props) {
  const router = useRouter();
  const isEdit = !!testimonialId;
  const { data: existing, isLoading } = useTestimonial(testimonialId || "");
  const { create, update } = useTestimonialMutations();
  const [activeTab, setActiveTab] = useState("general");
  const [autoSlug, setAutoSlug] = useState(!isEdit);

  const form = useForm<Partial<Testimonial>>({ defaultValues: testimonialDefaultValues });
  const { register, handleSubmit, watch, setValue, reset, formState } = form;
  const values = watch();

  useEffect(() => {
    if (existing) {
      reset(existing);
      setAutoSlug(false);
    }
  }, [existing, reset]);

  useEffect(() => {
    if (autoSlug && values.fullName) {
      const base = values.companyName ? `${values.fullName}-${values.companyName}` : values.fullName;
      setValue("slug", slugify(base));
    }
  }, [values.fullName, values.companyName, autoSlug, setValue]);

  const seoScore = estimateTestimonialSeoScore(values as Record<string, unknown>);

  async function onSubmit(data: Partial<Testimonial>) {
    try {
      if (isEdit && testimonialId) {
        await update.mutateAsync({ id: testimonialId, payload: data });
        toast.success("Testimonial saved");
      } else {
        const t = await create.mutateAsync(data);
        toast.success("Testimonial created");
        router.push(`/testimonials/${t.id}/edit`);
      }
    } catch {
      toast.error("Failed to save testimonial");
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
              <Link href="/testimonials"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">
                {isEdit ? "Edit Testimonial" : "Create Testimonial"}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {values.status && <StatusBadge status={values.status} />}
                <SeoScoreBadge score={seoScore} />
                {values.fullName && (
                  <span className="text-xs text-admin-text-muted">{values.fullName}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setValue("status", "draft")}>
              Save Draft
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              onClick={() => setValue("status", "published")}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {values.status === "published" ? "Update" : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex h-auto flex-wrap gap-1">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="ai-seo">LLM SEO</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <TestimonialGeneralTab
            register={register}
            setValue={setValue}
            values={values}
            autoSlug={autoSlug}
            setAutoSlug={setAutoSlug}
          />
        </TabsContent>
        <TabsContent value="review">
          <TestimonialReviewTab setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="media">
          <TestimonialMediaTab setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="company">
          <TestimonialCompanyTab setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="seo">
          <TestimonialSeoTab setValue={setValue} values={values} seoScore={seoScore} />
        </TabsContent>
        <TabsContent value="ai-seo">
          <TestimonialAiSeoTab setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="schema">
          <TestimonialSchemaTab values={values} />
        </TabsContent>
        <TabsContent value="publishing">
          <TestimonialPublishingTab register={register} setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="settings">
          <TestimonialSettingsTab setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="preview">
          <TestimonialPreviewTab values={values} seoScore={seoScore} />
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-0 -mx-4 border-t border-admin-border bg-admin-bg/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex items-center justify-between">
          <p className="text-xs text-admin-text-muted">
            {formState.isDirty ? "Unsaved changes" : "All changes saved"}
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setActiveTab("preview")}>
              Preview
            </Button>
            <Button type="submit" size="sm" disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
