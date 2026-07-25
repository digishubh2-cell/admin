import type { NavItem, NavRole, NavSection, Permission } from "@/types/navigation";
import { AUTH_ROLE_MAP, ROLE_PERMISSIONS, navigation } from "@/constants/admin-navigation";

export function resolveNavRole(authRole?: string): NavRole {
  if (!authRole) return "viewer";
  return AUTH_ROLE_MAP[authRole] ?? "viewer";
}

export function getRolePermissions(role: NavRole): Permission[] | "*" {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function hasPermission(
  role: NavRole,
  required?: Permission[]
): boolean {
  if (!required?.length) return true;

  const perms = getRolePermissions(role);
  if (perms === "*") return true;

  return required.some((p) => perms.includes(p));
}

export function hasRoleAccess(
  userRole: NavRole,
  allowedRoles?: NavRole[]
): boolean {
  if (!allowedRoles?.length) return true;
  if (userRole === "super_admin") return true;
  return allowedRoles.includes(userRole);
}

function filterItem(item: NavItem, role: NavRole): NavItem | null {
  if (!hasRoleAccess(role, item.roles)) return null;
  if (!hasPermission(role, item.permissions)) return null;

  const children = item.children
    ?.map((child) => filterItem(child, role))
    .filter((child): child is NavItem => child !== null);

  return { ...item, children: children?.length ? children : undefined };
}

export function filterNavigation(role: NavRole, sections = navigation): NavSection[] {
  return sections
    .filter((section) => hasRoleAccess(role, section.roles))
    .map((section) => {
      const items = section.items
        .map((item) => filterItem(item, role))
        .filter((item): item is NavItem => item !== null);

      return { ...section, items };
    })
    .filter((section) => section.items.length > 0);
}

export function flattenNavItems(sections: NavSection[]): NavItem[] {
  const result: NavItem[] = [];

  for (const section of sections) {
    for (const item of section.items) {
      result.push(item);
      if (item.children) {
        result.push(...item.children);
      }
    }
  }

  return result;
}

export function getNavItemBySlug(slug: string, sections = navigation): NavItem | undefined {
  return flattenNavItems(sections).find((item) => item.slug === slug);
}

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isSectionActive(pathname: string, section: NavSection): boolean {
  return section.items.some((item) => isNavItemActive(pathname, item.href));
}

export function searchNavItems(query: string, sections: NavSection[]): NavItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return flattenNavItems(sections);

  return flattenNavItems(sections).filter((item) => {
    const haystack = [
      item.title,
      item.description,
      item.slug,
      ...(item.keywords ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}
