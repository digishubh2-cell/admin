"use client";

import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { Testimonial } from "@/types/testimonial";
import { INDUSTRIES, LANGUAGES, TESTIMONIAL_TYPES } from "@/constants/testimonial";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface Props {
  register: UseFormRegister<Partial<Testimonial>>;
  setValue: UseFormSetValue<Partial<Testimonial>>;
  values: Partial<Testimonial>;
  autoSlug: boolean;
  setAutoSlug: (v: boolean) => void;
}

export function TestimonialGeneralTab({
  register,
  setValue,
  values,
  autoSlug,
  setAutoSlug,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <p className="text-sm text-admin-text-muted">Person, company, and testimonial classification.</p>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input id="fullName" placeholder="John Smith" {...register("fullName", { required: true })} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="designation">Designation</Label>
          <Input id="designation" placeholder="CEO, CTO, Marketing Director..." {...register("designation")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input id="companyName" placeholder="Acme Corp" {...register("companyName")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyWebsite">Company Website</Label>
          <Input id="companyWebsite" placeholder="https://acme.com" {...register("companyWebsite")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select
            id="industry"
            value={values.industry || ""}
            onChange={(e) => setValue("industry", e.target.value)}
          >
            <option value="">Select industry</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" placeholder="India" {...register("country")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" placeholder="Mumbai" {...register("city")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" type="email" placeholder="john@acme.com" {...register("email")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
          <Input id="linkedinUrl" placeholder="https://linkedin.com/in/..." {...register("linkedinUrl")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reviewType">Review Type</Label>
          <Select
            id="reviewType"
            value={values.reviewType || "client_testimonial"}
            onChange={(e) => setValue("reviewType", e.target.value as Testimonial["reviewType"])}
          >
            {TESTIMONIAL_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select
            id="language"
            value={values.language || "en"}
            onChange={(e) => setValue("language", e.target.value)}
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="slug">Slug</Label>
            <label className="flex items-center gap-2 text-xs text-admin-text-muted">
              <Checkbox checked={autoSlug} onCheckedChange={(c) => setAutoSlug(c === true)} />
              Auto-generate
            </label>
          </div>
          <Input id="slug" placeholder="john-smith-acme" {...register("slug")} disabled={autoSlug} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Input
            id="priority"
            type="number"
            min={0}
            max={100}
            {...register("priority", { valueAsNumber: true })}
          />
        </div>

        <div className="flex items-center gap-6 lg:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={!!values.featured}
              onCheckedChange={(c) => setValue("featured", c === true)}
            />
            Featured testimonial
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
