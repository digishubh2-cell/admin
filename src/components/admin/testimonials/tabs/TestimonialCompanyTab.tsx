"use client";

import type { UseFormSetValue } from "react-hook-form";
import type { Testimonial } from "@/types/testimonial";
import { BUSINESS_TYPES, COMPANY_SIZES } from "@/constants/testimonial";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface Props {
  setValue: UseFormSetValue<Partial<Testimonial>>;
  values: Partial<Testimonial>;
}

export function TestimonialCompanyTab({ setValue, values }: Props) {
  const company = values.company || {};

  function update(patch: Partial<typeof company>) {
    setValue("company", { ...company, ...patch });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Details</CardTitle>
        <p className="text-sm text-admin-text-muted">Organization context for trust signals and schema markup.</p>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <Label>Company Size</Label>
          <Select
            value={company.size || ""}
            onChange={(e) => update({ size: (e.target.value || null) as Testimonial["company"]["size"] })}
          >
            <option value="">Select size</option>
            {COMPANY_SIZES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Business Type</Label>
          <Select
            value={company.businessType || ""}
            onChange={(e) =>
              update({ businessType: (e.target.value || null) as Testimonial["company"]["businessType"] })
            }
          >
            <option value="">Select type</option>
            {BUSINESS_TYPES.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Industry</Label>
          <Input
            defaultValue={company.industry || values.industry || ""}
            onChange={(e) => update({ industry: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Location</Label>
          <Input
            placeholder="Mumbai, India"
            defaultValue={company.location || ""}
            onChange={(e) => update({ location: e.target.value })}
          />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <Label>Website</Label>
          <Input
            placeholder="https://company.com"
            defaultValue={company.website || values.companyWebsite || ""}
            onChange={(e) => update({ website: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
