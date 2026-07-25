"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useJob, useJobMutations } from "@/hooks/use-jobs";
import type { Job } from "@/types/job";
import { slugify } from "@/lib/case-study/utils";
import { jobDefaultValues } from "./jobDefaults";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/badge";
import { JobOverviewTab } from "./tabs/JobOverviewTab";
import { JobDescriptionTab } from "./tabs/JobDescriptionTab";
import { JobRequirementsTab } from "./tabs/JobRequirementsTab";
import { JobMediaTab } from "./tabs/JobMediaTab";
import { JobSeoTab } from "./tabs/JobSeoTab";
import { JobPublishingTab } from "./tabs/JobPublishingTab";
import { JobPreviewTab } from "./tabs/JobPreviewTab";

interface Props {
  jobId?: string;
}

export function JobEditor({ jobId }: Props) {
  const router = useRouter();
  const isEdit = !!jobId;
  const { data: existing, isLoading } = useJob(jobId || "");
  const { create, update } = useJobMutations();
  const [activeTab, setActiveTab] = useState("overview");
  const [autoSlug, setAutoSlug] = useState(!isEdit);

  const form = useForm<Partial<Job>>({ defaultValues: jobDefaultValues });
  const { register, handleSubmit, watch, setValue, reset } = form;
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

  async function onSubmit(data: Partial<Job>) {
    try {
      if (isEdit && jobId) {
        await update.mutateAsync({ id: jobId, payload: data });
        toast.success("Job saved");
      } else {
        const job = await create.mutateAsync(data);
        toast.success("Job created");
        router.push(`/jobs/${job.id}/edit`);
      }
    } catch {
      toast.error("Failed to save job");
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
              <Link href="/jobs">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">
                {isEdit ? "Edit Job" : "Create Job"}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {values.status ? <StatusBadge status={values.status} /> : null}
                <span className="text-xs capitalize text-admin-text-muted">
                  {values.type || "job"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setValue("status", "draft");
                void handleSubmit(onSubmit)();
              }}
            >
              Save Draft
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              onClick={() => setValue("status", "published")}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {values.status === "published" ? "Update" : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex h-auto flex-wrap gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <JobOverviewTab
            register={register}
            setValue={setValue}
            values={values}
            autoSlug={autoSlug}
            setAutoSlug={setAutoSlug}
          />
        </TabsContent>
        <TabsContent value="description">
          <JobDescriptionTab setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="requirements">
          <JobRequirementsTab setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="media">
          <JobMediaTab setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="seo">
          <JobSeoTab setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="publishing">
          <JobPublishingTab register={register} setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="preview">
          <JobPreviewTab values={values} />
        </TabsContent>
      </Tabs>
    </form>
  );
}
