"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { Testimonial } from "@/types/testimonial";
import { StringListEditor, TextAreaField } from "@/components/admin/case-studies/forms/FormHelpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  setValue: UseFormSetValue<Partial<Testimonial>>;
  values: Partial<Testimonial>;
}

export function TestimonialReviewTab({ setValue, values }: Props) {
  const review = values.review || {};

  function updateReview(patch: Partial<typeof review>) {
    setValue("review", { ...review, ...patch });
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Review Content</CardTitle>
          <p className="text-sm text-admin-text-muted">The core testimonial content that builds trust and drives conversions.</p>
        </CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="reviewTitle">Title</Label>
            <Input
              id="reviewTitle"
              placeholder="Exceptional digital transformation partner"
              defaultValue={review.title || ""}
              onChange={(e) => updateReview({ title: e.target.value })}
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="shortReview">Short Review</Label>
            <Textarea
              id="shortReview"
              rows={3}
              placeholder="A concise quote for cards and previews..."
              defaultValue={review.shortReview || ""}
              onChange={(e) => updateReview({ shortReview: e.target.value })}
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="detailedReview">Detailed Review</Label>
            <Textarea
              id="detailedReview"
              rows={6}
              placeholder="Full testimonial with context, results, and impact..."
              defaultValue={review.detailedReview || ""}
              onChange={(e) => updateReview({ detailedReview: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Rating (1–5)</Label>
            <Input
              id="rating"
              type="number"
              min={1}
              max={5}
              defaultValue={review.rating ?? 5}
              onChange={(e) => updateReview({ rating: Number(e.target.value) })}
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <Checkbox
              checked={review.wouldRecommend !== false}
              onCheckedChange={(c) => updateReview({ wouldRecommend: c === true })}
            />
            <Label>Would Recommend</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Context</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-2">
            <Label>Project Name</Label>
            <Input
              defaultValue={review.projectName || ""}
              onChange={(e) => updateReview({ projectName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Project Category</Label>
            <Input
              defaultValue={review.projectCategory || ""}
              onChange={(e) => updateReview({ projectCategory: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Project URL</Label>
            <Input
              defaultValue={review.projectUrl || ""}
              onChange={(e) => updateReview({ projectUrl: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Timeline</Label>
            <Input
              placeholder="3 months, Q1 2025..."
              defaultValue={review.timeline || ""}
              onChange={(e) => updateReview({ timeline: e.target.value })}
            />
          </div>

          <div className="lg:col-span-2">
            <StringListEditor
              label="Services Used"
              items={review.servicesUsed || []}
              onChange={(items) => updateReview({ servicesUsed: items })}
              placeholder="Web Development, SEO, etc."
            />
          </div>

          <div className="lg:col-span-2">
            <StringListEditor
              label="Highlights"
              items={review.highlights || []}
              onChange={(items) => updateReview({ highlights: items })}
              placeholder="Key achievement or milestone"
            />
          </div>

          <div className="lg:col-span-2">
            <StringListEditor
              label="Key Benefits"
              items={review.keyBenefits || []}
              onChange={(items) => updateReview({ keyBenefits: items })}
              placeholder="Business benefit delivered"
            />
          </div>

          <div className="lg:col-span-2">
            <TextAreaField
              label="Business Outcome"
              value={review.businessOutcome}
              onChange={(v) => updateReview({ businessOutcome: v })}
              rows={3}
              placeholder="Quantifiable results: 40% increase in conversions..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
