export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface RsDashboard {
  periodDays: number;
  funnel: { resumes: number; previews: number; ordersCreated: number; paidOrders: number; exportsReady: number };
  accounts: number;
  imports: number;
  revenue: { grossPaise: number; refundedPaise: number; netPaise: number; byPlan: Record<string, number> };
  exports: { ready: number; failed: number; needsSupport: number };
  aiCostUsd: number;
  storage: { kind: string; count: number; bytes: number }[];
  database: { dataSizeBytes: number; storageSizeBytes: number; indexSizeBytes: number } | null;
  feedback: { count: number; averageRating: number | null };
}

export interface RsTemplateVersion {
  templateKey: string;
  version: number;
  sampleCompile: { status: "pending" | "ok" | "failed"; checkedAt: string | null; durationMs?: number; error?: string | null };
  approvedBy: string | null;
  approvedAt: string | null;
}

export interface RsTemplate {
  key: string;
  version: number;
  name: string;
  description: string;
  category: string;
  tier: "free" | "premium";
  layout: string;
  atsFriendly: boolean;
  photoSupported: boolean;
  status: "draft" | "published";
  sortOrder: number;
  presets: { name: string; colorHex: string; fontKey: string }[];
  thumbnails: Record<string, string>;
  versions: RsTemplateVersion[];
}

export interface RsPlan {
  key: "single" | "pro" | "job";
  name: string;
  pricePaise: number;
  active: boolean;
  description: string;
  includes: { pdf: true; tex: boolean; premiumTemplates: boolean; pro: boolean; jobMatchCredits: number };
  editWindowDays: number;
  maxRecompiles: number;
}

export interface RsPricing {
  currency: "INR";
  gstInclusive: boolean;
  plans: RsPlan[];
}

export interface RsOrder {
  id: string;
  accountId: string;
  accountEmail: string | null;
  resumeId: string;
  resumeTitle: string | null;
  planKey: string;
  type: string;
  amountPaise: number;
  currency: string;
  status: string;
  razorpayOrderId: string | null;
  razorpayPaymentIds: string[];
  statusHistory: { status: string; at: string; source: string }[];
  entitlement: { editWindowEndsAt: string; recompilesLeft: number; includesTex: boolean; includesPro: boolean } | null;
  refunds: { refundId: string; amountPaise: number; status: string; reason?: string; createdAt: string }[];
  flags: string[];
  createdAt: string;
  paidAt?: string;
}

export interface RsExport {
  id: string;
  status: string;
  formats: string[];
  pageCount: number | null;
  attempts: number;
  publicError: string | null;
  reason: string;
  downloads: number;
  createdAt: string;
}

export interface RsPaymentEvent {
  eventId: string;
  type: string;
  paymentId: string | null;
  receivedAt: string;
  processedAt: string | null;
}

export interface RsAiUsage {
  budgetUsdPerDay: number;
  aiEnabled: boolean;
  daily: { day: string; costUsd: number }[];
  byTask: { task: string; model: string; calls: number; inputTokens: number; outputTokens: number; costUsd: number; invalid: number }[];
  decisions: Record<string, number>;
  topPrincipals: { principal: string; costUsd: number }[];
}

export interface RsCompileJob {
  id: string;
  kind: "preview" | "export";
  status: string;
  attempts: number;
  resumeId: string;
  exportId?: string;
  publicError?: string | null;
  result?: { pageCount?: number; errors?: { line: number | null; message: string }[]; warnings?: { code: string; message: string }[]; durationMs?: number } | null;
  createdAt: string;
  updatedAt: string;
}

export interface RsAccount {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  lastLoginAt: string | null;
  resumes: number;
  paidOrders: number;
}

export interface RsFeedback {
  id: string;
  rating: number;
  category: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface RsAuditLog {
  userId: string | null;
  action: string;
  resource: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}
