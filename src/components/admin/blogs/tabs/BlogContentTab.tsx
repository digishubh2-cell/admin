"use client";

import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { BlogPost } from "@/types/blog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  register: UseFormRegister<Partial<BlogPost>>;
  setValue: UseFormSetValue<Partial<BlogPost>>;
  values: Partial<BlogPost>;
}

export function BlogContentTab({ register, setValue, values }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Content Editor</CardTitle>
          <CardDescription>
            Markdown / MDX supported. Rich editor integration ready.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contentFormat">Format</Label>
            <Select
              id="contentFormat"
              value={values.contentFormat || "markdown"}
              onChange={(e) =>
                setValue("contentFormat", e.target.value as BlogPost["contentFormat"])
              }
            >
              <option value="markdown">Markdown</option>
              <option value="mdx">MDX</option>
              <option value="html">HTML</option>
            </Select>
          </div>
          <Textarea
            id="content"
            rows={24}
            className="font-mono text-sm"
            placeholder="Write your content here. Supports headings, code blocks, tables, callouts..."
            {...register("content")}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Editor Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-admin-text-secondary">
          <p>✓ Headings &amp; anchor links</p>
          <p>✓ Code blocks &amp; syntax highlighting</p>
          <p>✓ Tables, quotes, callouts</p>
          <p>✓ Images &amp; embeds</p>
          <p>✓ Auto table of contents</p>
          <p>✓ Internal link suggestions</p>
          <p className="pt-2 text-xs text-admin-text-muted">
            Tip: Use ## for H2, ``` for code blocks, &gt; for quotes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
