function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function estimateReadTime(content: string) {
  const words = content
    .replace(/<[^>]*>/g, " ")
    .replace(/[#*`_~[\]()]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function estimateSeoScore(values: Record<string, unknown>) {
  let score = 0;
  const title = String(values.title || "");
  const excerpt = String(values.excerpt || "");
  const seo = (values.seo as Record<string, unknown>) || {};

  if (title.length >= 30 && title.length <= 70) score += 15;
  else if (title) score += 8;

  const meta = String(seo.metaDescription || excerpt);
  if (meta.length >= 120 && meta.length <= 160) score += 15;
  else if (meta) score += 8;

  if (values.slug) score += 10;
  if (values.content && String(values.content).length > 600) score += 15;
  if (seo.focusKeyword) score += 10;

  return Math.min(100, score);
}

export { slugify, estimateReadTime, estimateSeoScore };
