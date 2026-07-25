export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function estimateReadTime(content = "") {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.ceil(words / 180) || 5);
}

export function estimateCaseStudySeoScore(values: Record<string, unknown>) {
  let score = 0;
  const seo = (values.seo || {}) as Record<string, unknown>;
  const projectName = values.projectName as string;
  const shortSummary = values.shortSummary as string;
  const media = values.media as { featuredImage?: { url?: string } };
  const results = values.results as { metrics?: unknown[]; summary?: string };
  const faq = values.faq as unknown[];
  const aiSeo = values.aiSeo as { summary?: string };
  const testimonials = values.testimonials as unknown[];
  const technology = values.technology as { stack?: unknown[] };

  if (projectName?.length >= 20 && projectName.length <= 70) score += 12;
  else if (projectName) score += 6;

  const metaDesc = (seo.metaDescription as string) || shortSummary;
  if (metaDesc?.length >= 120 && metaDesc.length <= 160) score += 12;
  else if (metaDesc) score += 6;

  if (seo.focusKeyword && projectName?.toLowerCase().includes(String(seo.focusKeyword).toLowerCase()))
    score += 8;
  if (values.slug) score += 8;
  if (media?.featuredImage?.url) score += 8;
  if (seo.canonicalUrl || values.canonicalUrl) score += 5;
  if (results?.summary) score += 10;
  if (seo.ogTitle && seo.ogDescription) score += 8;
  if (faq?.length >= 3) score += 8;
  if (aiSeo?.summary) score += 5;
  if (testimonials?.length) score += 5;
  if (results?.metrics?.length) score += 8;
  if (technology?.stack?.length) score += 5;

  return Math.min(100, score);
}
