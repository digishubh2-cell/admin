"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, User } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { MarkdownContent } from "@/components/common/MarkdownContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeoScoreBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  values: Partial<BlogPost>;
  seoScore: number;
  readTime: number;
}

export function BlogPreviewTab({ values, seoScore, readTime }: Props) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const widthClass = {
    desktop: "max-w-4xl",
    tablet: "max-w-2xl",
    mobile: "max-w-sm",
  }[device];

  const hasContent = Boolean(values.content?.trim());

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="flex flex-wrap items-center gap-2 lg:col-span-3">
        {(["desktop", "tablet", "mobile"] as const).map((d) => (
          <Button
            key={d}
            type="button"
            size="sm"
            variant={device === d ? "default" : "outline"}
            onClick={() => setDevice(d)}
            className="capitalize"
          >
            {d}
          </Button>
        ))}
        <div className="ml-2 flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => setTheme("light")}
          >
            Light
          </Button>
          <Button
            type="button"
            size="sm"
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </Button>
        </div>
      </div>

      <Card
        className={cn(
          "mx-auto w-full overflow-hidden transition-all lg:col-span-2",
          widthClass
        )}
      >
        <CardContent className="p-0">
          <div
            className={cn(
              "rounded-xl",
              theme === "dark" ? "bg-admin-dark text-white" : "bg-white text-navy"
            )}
          >
            {values.featuredImage?.url && (
              <div className="relative aspect-[1200/630] w-full overflow-hidden">
                <Image
                  src={values.featuredImage.url}
                  alt={values.featuredImage.alt || values.title || "Featured image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            )}

            <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
              {values.categoryName && (
                <span
                  className={cn(
                    "inline-block rounded-full px-3 py-1 text-xs font-medium",
                    theme === "dark"
                      ? "bg-white/10 text-white/80"
                      : "bg-electric/10 text-electric"
                  )}
                >
                  {values.categoryName}
                  {values.subcategory ? ` · ${values.subcategory}` : ""}
                </span>
              )}

              <h1 className="mt-4 text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl">
                {values.title || "Untitled Post"}
              </h1>

              {values.excerpt && (
                <p
                  className={cn(
                    "mt-4 text-lg leading-relaxed",
                    theme === "dark" ? "text-white/75" : "text-slate-600"
                  )}
                >
                  {values.excerpt}
                </p>
              )}

              <div
                className={cn(
                  "mt-5 flex flex-wrap items-center gap-4 border-b pb-5 text-sm",
                  theme === "dark" ? "border-white/10 text-white/60" : "border-navy/10 text-muted"
                )}
              >
                {values.authorName && (
                  <span className="inline-flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {values.authorName}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {readTime} min read
                </span>
                {values.publishedAt && (
                  <span>
                    {new Date(values.publishedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>

              <div className="mt-8 border-t pt-8">
                {hasContent ? (
                  <MarkdownContent content={values.content!} theme={theme} />
                ) : (
                  <p
                    className={cn(
                      "text-sm italic",
                      theme === "dark" ? "text-white/50" : "text-muted"
                    )}
                  >
                    No content to preview yet. Add content in the Content tab.
                  </p>
                )}
              </div>

              {values.tags && values.tags.length > 0 && (
                <div
                  className={cn(
                    "mt-8 flex flex-wrap gap-2 border-t pt-6",
                    theme === "dark" ? "border-white/10" : "border-navy/10"
                  )}
                >
                  {values.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-xs font-medium",
                        theme === "dark"
                          ? "bg-white/10 text-white/70"
                          : "bg-light-bg text-muted"
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>SEO Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <SeoScoreBadge score={seoScore} />
            <p className="mt-3 text-sm font-medium text-[#1a0dab]">
              {values.seo?.metaTitle || values.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-admin-text-muted">
              www.shubhdigi.in › blog › {values.slug || "post-slug"}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[#4d5156]">
              {values.seo?.metaDescription || values.excerpt}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open Graph</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-admin-text-secondary">
            <p className="font-medium">{values.seo?.ogTitle || values.title}</p>
            <p className="mt-1 text-xs text-admin-text-muted">
              {values.seo?.ogDescription || values.excerpt}
            </p>
            {values.seo?.ogImage && (
              <div className="relative mt-3 aspect-[1200/630] overflow-hidden rounded-lg">
                <Image
                  src={values.seo.ogImage}
                  alt="OG preview"
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {values.tableOfContents && values.tableOfContents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Table of Contents</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-1.5 text-sm">
                {values.tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={cn(
                      "block text-admin-text-secondary hover:text-primary",
                      item.level === 3 && "pl-3",
                      item.level === 4 && "pl-6"
                    )}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
