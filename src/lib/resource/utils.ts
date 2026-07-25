export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

export function estimateResourceSeoScore(resource: Record<string, unknown>): number {
  let score = 0;
  const seo = (resource.seo as Record<string, unknown>) || {};
  const title = resource.title as string;

  if (title && title.length >= 20 && title.length <= 70) score += 10;
  else if (title) score += 5;

  const metaDesc = (seo.metaDescription as string) || (resource.shortDescription as string);
  if (metaDesc && metaDesc.length >= 120 && metaDesc.length <= 160) score += 10;
  else if (metaDesc) score += 5;

  if (
    seo.focusKeyword &&
    title?.toLowerCase().includes((seo.focusKeyword as string).toLowerCase())
  )
    score += 8;
  if (resource.slug) score += 6;
  if (resource.type) score += 5;
  if (resource.category) score += 5;
  if ((resource.media as { featuredImage?: { url?: string } })?.featuredImage?.url) score += 8;
  if (resource.content && (resource.content as string).length > 500) score += 8;
  if ((resource.tags as string[])?.length >= 2) score += 5;
  if ((resource.downloads as unknown[])?.length) score += 7;
  if ((resource.aiSeo as { summary?: string })?.summary) score += 5;

  return Math.min(100, score);
}
