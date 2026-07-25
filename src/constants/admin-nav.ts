import { getNavItemBySlug } from "@/lib/navigation/utils";
import { navigation } from "@/constants/admin-navigation";

export { navigation };

export function getAdminNavItem(slug: string) {
  return getNavItemBySlug(slug, navigation);
}

export const dashboardStats = [
  { label: "Total Leads", value: "1,284", change: "+12.4%", trend: "up" as const },
  { label: "Active Projects", value: "38", change: "+3", trend: "up" as const },
  { label: "Published Blogs", value: "156", change: "+8", trend: "up" as const },
  { label: "Conversion Rate", value: "4.8%", change: "-0.2%", trend: "down" as const },
];

export const recentLeads = [
  { name: "Rahul Sharma", company: "FinEdge", status: "New", time: "2m ago" },
  { name: "Priya Patel", company: "HealthStack", status: "Qualified", time: "18m ago" },
  { name: "Amit Verma", company: "RetailNova", status: "Proposal", time: "1h ago" },
  { name: "Sneha Iyer", company: "EduLeap", status: "Contacted", time: "3h ago" },
];

export const recentActivity = [
  { action: "Blog published", detail: "AI in Enterprise SaaS", time: "10m ago" },
  { action: "Lead assigned", detail: "Rahul Sharma → Sales", time: "32m ago" },
  { action: "Project updated", detail: "CRM Platform v2", time: "1h ago" },
  { action: "SEO redirect added", detail: "/old → /new", time: "2h ago" },
];
