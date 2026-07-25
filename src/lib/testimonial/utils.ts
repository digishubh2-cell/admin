import type { Testimonial } from "@/types/testimonial";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function estimateTestimonialSeoScore(testimonial: Record<string, unknown>): number {
  let score = 0;
  const seo = (testimonial.seo || {}) as Record<string, unknown>;
  const review = (testimonial.review || {}) as Record<string, unknown>;
  const media = (testimonial.media || {}) as Record<string, unknown>;
  const aiSeo = (testimonial.aiSeo || {}) as Record<string, unknown>;
  const name = testimonial.fullName as string;

  if (name && name.length >= 3) score += 8;
  if (testimonial.designation) score += 5;
  if (testimonial.companyName) score += 8;
  if (testimonial.industry) score += 4;

  const metaDesc = (seo.metaDescription || review.shortReview) as string;
  if (metaDesc && metaDesc.length >= 80 && metaDesc.length <= 160) score += 10;
  else if (metaDesc) score += 5;

  if (seo.metaTitle) score += 8;
  if (seo.focusKeyword) score += 5;
  if (testimonial.slug) score += 6;
  if (testimonial.reviewType) score += 5;
  if (review.rating && (review.rating as number) >= 4) score += 8;
  if (review.shortReview && (review.shortReview as string).length >= 50) score += 8;
  if (review.detailedReview && (review.detailedReview as string).length >= 150) score += 8;

  const profileImage = (media.profileImage as Record<string, unknown>)?.url;
  const companyLogo = (media.companyLogo as Record<string, unknown>)?.url;
  if (profileImage) score += 7;
  if (companyLogo) score += 5;
  if ((media.video as Record<string, unknown>)?.url || media.youtubeUrl) score += 6;
  if (seo.canonicalUrl || testimonial.canonicalUrl) score += 5;
  if (seo.ogTitle && seo.ogDescription) score += 6;
  if (aiSeo.executiveSummary) score += 5;
  if (aiSeo.citationReadySummary) score += 5;
  if ((aiSeo.semanticKeywords as string[])?.length >= 3) score += 4;
  if ((review.highlights as string[])?.length >= 2) score += 4;
  if ((review.keyBenefits as string[])?.length >= 2) score += 4;
  if (testimonial.linkedinUrl) score += 3;

  return Math.min(100, score);
}

export function getDisplayName(t: Partial<Testimonial>): string {
  return t.fullName || "Untitled Testimonial";
}

export function hasVideo(t: Partial<Testimonial>): boolean {
  return !!(
    t.reviewType === "video_testimonial" ||
    t.media?.video?.url ||
    t.media?.youtubeUrl
  );
}

export function renderStars(rating = 0): string {
  return "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
}
