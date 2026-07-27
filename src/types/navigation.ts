import type { LucideIcon } from "lucide-react";

/** Platform roles — extend as the org grows */
export type NavRole =
  | "super_admin"
  | "admin"
  | "editor"
  | "author"
  | "sales"
  | "hr"
  | "developer"
  | "support"
  | "viewer";

/** Granular permissions for future RBAC */
export type Permission =
  | "dashboard.read"
  | "analytics.read"
  | "reports.read"
  | "leads.read"
  | "leads.write"
  | "crm.read"
  | "crm.write"
  | "clients.read"
  | "forms.read"
  | "forms.write"
  | "blogs.read"
  | "blogs.write"
  | "blogs.delete"
  | "projects.read"
  | "projects.write"
  | "case_studies.read"
  | "case_studies.write"
  | "resources.read"
  | "resources.write"
  | "resources.delete"
  | "testimonials.read"
  | "testimonials.write"
  | "testimonials.delete"
  | "jobs.read"
  | "jobs.write"
  | "applications.read"
  | "applications.write"
  | "assessments.read"
  | "assessments.write"
  | "downloads.read"
  | "documentation.read"
  | "services.read"
  | "industries.read"
  | "locations.read"
  | "seo.manage"
  | "products.read"
  | "tools.read"
  | "apis.read"
  | "media.read"
  | "assets.read"
  | "users.read"
  | "users.write"
  | "roles.read"
  | "team.read"
  | "settings.read"
  | "settings.write"
  | "logs.read"
  | "notifications.read"
  | "integrations.read";

export interface NavItem {
  id: string;
  title: string;
  href: string;
  slug: string;
  icon: LucideIcon;
  description?: string;
  /** Badge label — e.g. "New", "Beta" */
  badge?: string;
  /** Notification count */
  badgeCount?: number;
  permissions?: Permission[];
  roles?: NavRole[];
  /** Nested sub-items (future-ready) */
  children?: NavItem[];
  keywords?: string[];
}

export interface NavSection {
  id: string;
  title: string;
  icon: LucideIcon;
  permissions?: Permission[];
  roles?: NavRole[];
  items: NavItem[];
  defaultOpen?: boolean;
}

export interface SidebarDimensions {
  expanded: number;
  collapsed: number;
}
