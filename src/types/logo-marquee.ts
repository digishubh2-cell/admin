export type PageScope = { mode: "GLOBAL" | "INCLUDE" | "EXCLUDE"; pages: string[] };
export type LogoDraft = {
  name: string; slug: string; alt: string; category: string; sourceType: "ADMIN_UPLOAD" | "DISCOVERED" | "IMPORTED";
  sourceUrl: string; status: "DRAFT" | "APPROVED" | "ARCHIVED"; isActive: boolean; priority: number; displayOrder: number;
  rowPreference: "AUTO" | "ROW_1" | "ROW_2"; pageScope: PageScope; fileId: string;
};
export type LogoAsset = Omit<LogoDraft, "fileId"> & { id: string; createdAt: string; updatedAt: string; sourceAssetUrl?: string;
  media: { fileId: string; filePath: string; url: string; width: number; height: number; mimeType: string; fileSize: number; uploadedAt: string } };
export type LogoSettings = {
  enabled: boolean; title: string; subtitle: string; backgroundVariant: "midnight" | "graphite"; rowCount: 1 | 2;
  row1Direction: "left" | "right"; row2Direction: "left" | "right"; speed: number;
  logoHeightDesktop: number; logoHeightTablet: number; logoHeightMobile: number; gapDesktop: number; gapTablet: number; gapMobile: number;
  pauseOnHover: boolean; showOnMobile: boolean; pageScope: PageScope; updatedAt?: string;
};
export type LogoList = { items: LogoAsset[]; categories: string[]; pagination: { page: number; limit: number; total: number; totalPages: number } };
export type Candidate = { id: string; name: string; category: string; sourceUrl: string };
