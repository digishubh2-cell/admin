"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { warnIfCacheFailed } from "@/lib/cache/afterMutation";
import {
  useBlog,
  useBlogCategories,
  useBlogMutations,
} from "@/hooks/use-blogs";
import type { BlogPost } from "@/types/blog";
import { estimateReadTime, estimateSeoScore, slugify } from "@/lib/blog/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeoScoreBadge, StatusBadge } from "@/components/ui/badge";
import { BlogGeneralTab } from "./tabs/BlogGeneralTab";
import { BlogContentTab } from "./tabs/BlogContentTab";
import { BlogMediaTab } from "./tabs/BlogMediaTab";
import { BlogSeoTab } from "./tabs/BlogSeoTab";
import { BlogAiSeoTab } from "./tabs/BlogAiSeoTab";
import { BlogSchemaTab } from "./tabs/BlogSchemaTab";
import { BlogPublishingTab } from "./tabs/BlogPublishingTab";
import { BlogSettingsTab } from "./tabs/BlogSettingsTab";
import { BlogPreviewTab } from "./tabs/BlogPreviewTab";

const defaultValues: Partial<BlogPost> = {
  title: "",
  slug: "",
  excerpt: "",
  shortDescription: "",
  content: "",
  contentFormat: "markdown",
  tags: [],
  language: "en",
  featured: false,
  sticky: false,
  priority: 0,
  status: "draft",
  workflowStatus: "draft",
  visibility: "public",
  gallery: [],
  seo: {
    robots: "index,follow",
    twitterCard: "summary_large_image",
    secondaryKeywords: [],
    breadcrumb: [],
    faq: [],
  },
  aiSeo: {
    keyTakeaways: [],
    questionsAnswered: [],
    structuredFacts: [],
    entityMentions: [],
    relatedConcepts: [],
    semanticKeywords: [],
    citationReady: false,
  },
  schema: { types: ["BlogPosting"], jsonLd: null },
  settings: {
    comments: true,
    enableIndexing: true,
    enableAds: false,
    enableNewsletter: true,
    allowSharing: true,
    allowDownload: false,
    allowTranslation: false,
    showToc: true,
    enableReadingProgress: true,
    showAuthor: true,
    showUpdatedDate: true,
  },
  relatedPostIds: [],
};

interface BlogEditorProps {
  blogId?: string;
}

export function BlogEditor({ blogId }: BlogEditorProps) {
  const router = useRouter();
  const isEdit = !!blogId;
  const { data: existing, isLoading } = useBlog(blogId || "");
  const { data: categories = [] } = useBlogCategories();
  const { create, update } = useBlogMutations();
  const [activeTab, setActiveTab] = useState("general");
  const [autoSlug, setAutoSlug] = useState(!isEdit);

  const form = useForm<Partial<BlogPost>>({
    defaultValues,
  });

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
  const seoScore = estimateSeoScore(values as Record<string, unknown>);

  async function onSubmit(data: Partial<BlogPost>) {
    const category = categories.find((c) => c.id === data.categoryId);
    const payload = {
      ...data,
      categoryName: category?.name || data.categoryName,
      readTimeMinutes: readTime,
    };

    try {
      if (isEdit && blogId) {
        const blog = await update.mutateAsync({ id: blogId, payload });
        toast.success("Blog saved");
        warnIfCacheFailed(blog);
      } else {
        const blog = await create.mutateAsync(payload);
        toast.success("Blog created");
        warnIfCacheFailed(blog);
        router.push(`/blogs/${blog.id}/edit`);
      }
    } catch {
      toast.error("Failed to save blog");
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
      {/* Sticky header */}
      <div className="sticky top-14 z-20 -mx-4 border-b border-admin-border bg-admin-bg/90 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/blogs">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">
                {isEdit ? "Edit Blog" : "Create Blog"}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {values.status && <StatusBadge status={values.status} />}
                <SeoScoreBadge score={seoScore} />
                <span className="text-xs text-admin-text-muted">
                  {readTime} min read
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setValue("status", "draft")}
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
        <TabsList className="overflow-x-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="ai-seo">AI SEO</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <BlogGeneralTab
            register={register}
            setValue={setValue}
            values={values}
            categories={categories}
            autoSlug={autoSlug}
            setAutoSlug={setAutoSlug}
            readTime={readTime}
          />
        </TabsContent>
        <TabsContent value="content">
          <BlogContentTab register={register} setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="media">
          <BlogMediaTab setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="seo">
          <BlogSeoTab setValue={setValue} values={values} seoScore={seoScore} />
        </TabsContent>
        <TabsContent value="ai-seo">
          <BlogAiSeoTab setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="schema">
          <BlogSchemaTab setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="publishing">
          <BlogPublishingTab register={register} setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="settings">
          <BlogSettingsTab setValue={setValue} values={values} />
        </TabsContent>
        <TabsContent value="preview">
          <BlogPreviewTab values={values} seoScore={seoScore} readTime={readTime} />
        </TabsContent>
      </Tabs>

      {formState.errors.title && (
        <p className="text-sm text-danger">{formState.errors.title.message}</p>
      )}
    </form>
  );
}
