"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { BlogPost } from "@/types/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SCHEMA_TYPES = [
  "BlogPosting",
  "Article",
  "FAQ",
  "HowTo",
  "BreadcrumbList",
  "Organization",
  "Person",
  "WebPage",
];

interface Props {
  setValue: UseFormSetValue<Partial<BlogPost>>;
  values: Partial<BlogPost>;
}

export function BlogSchemaTab({ setValue, values }: Props) {
  const schema = values.schema || { types: ["BlogPosting"] };

  function generateJsonLd() {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": schema.types?.[0] || "BlogPosting",
      headline: values.title,
      description: values.excerpt || values.shortDescription,
      image: values.featuredImage?.url,
      author: { "@type": "Person", name: values.authorName || "ShubhDigi" },
      publisher: {
        "@type": "Organization",
        name: "ShubhDigi",
        logo: { "@type": "ImageObject", url: "https://www.shubhdigi.in/logo.png" },
      },
      datePublished: values.publishedAt || new Date().toISOString(),
      dateModified: values.updatedAt || new Date().toISOString(),
    };
    setValue("schema", { ...schema, jsonLd: JSON.stringify(jsonLd, null, 2) });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Structured Data (JSON-LD)</CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={generateJsonLd}>
          Auto Generate
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {SCHEMA_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setValue("schema", { ...schema, types: [type] })}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                schema.types?.includes(type)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-admin-border text-admin-text-muted hover:border-primary/30"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <Label>JSON-LD Preview</Label>
          <Textarea
            rows={16}
            className="font-mono text-xs"
            value={schema.jsonLd || ""}
            onChange={(e) => setValue("schema", { ...schema, jsonLd: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
