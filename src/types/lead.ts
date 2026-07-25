export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "won"
  | "lost"
  | "archived";

export type LeadType = "consultation" | "proposal" | "general";

export interface LeadSource {
  page: string;
  pageUrl?: string | null;
  pageTitle?: string | null;
  section: string;
  ctaLabel?: string | null;
  referrer?: string | null;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message?: string | null;
  serviceInterest?: string | null;
  type: LeadType;
  status: LeadStatus;
  source: LeadSource;
  notes?: string | null;
  contactedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  won: number;
  lost: number;
  bySource: Array<{ page: string; section: string; count: number }>;
  byType: Record<string, number>;
}

export interface LeadListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: LeadStatus;
  type?: LeadType;
  sourcePage?: string;
  sourceSection?: string;
  sortBy?: "createdAt" | "updatedAt" | "name" | "email" | "status";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedLeads {
  items: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message?: string | null;
  serviceInterest?: string | null;
  type?: LeadType;
  source?: Partial<LeadSource>;
}

export interface LeadFormOpenOptions {
  section: string;
  ctaLabel?: string;
  type?: LeadType;
  title?: string;
  subtitle?: string;
  serviceInterest?: string;
}
