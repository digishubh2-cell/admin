"use client";

import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { BlogPost } from "@/types/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface Props {
  register: UseFormRegister<Partial<BlogPost>>;
  setValue: UseFormSetValue<Partial<BlogPost>>;
  values: Partial<BlogPost>;
}

export function BlogPublishingTab({ register, setValue, values }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Publishing Workflow</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={values.status || "draft"}
            onChange={(e) => {
              setValue("status", e.target.value as BlogPost["status"]);
              setValue("workflowStatus", e.target.value);
            }}
          >
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="approved">Approved</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Visibility</Label>
          <Select
            value={values.visibility || "public"}
            onChange={(e) => setValue("visibility", e.target.value as BlogPost["visibility"])}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="password">Password Protected</option>
          </Select>
        </div>
        {values.visibility === "password" && (
          <div className="space-y-2 lg:col-span-2">
            <Label>Password</Label>
            <Input type="password" {...register("password")} />
          </div>
        )}
        <div className="space-y-2">
          <Label>Publish Date</Label>
          <Input type="datetime-local" {...register("publishAt")} />
        </div>
        <div className="space-y-2">
          <Label>Expiry Date</Label>
          <Input type="datetime-local" {...register("expireAt")} />
        </div>
        <div className="lg:col-span-2 rounded-xl bg-admin-muted/40 p-4 text-sm text-admin-text-secondary">
          <p className="font-medium text-admin-text">Workflow</p>
          <p className="mt-1">Draft → Review → Approved → Scheduled → Published → Updated → Archived</p>
        </div>
      </CardContent>
    </Card>
  );
}
