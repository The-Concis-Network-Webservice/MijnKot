import type { UserRole } from "../../types";

export const roleRank: Record<UserRole, number> = {
  super_admin: 4,
  admin: 3,
  editor: 2,
  viewer: 1
};

export function hasRole(role: UserRole | null, required: UserRole) {
  if (!role) return false;
  return roleRank[role] >= roleRank[required];
}

export function canManageUsers(role: UserRole | null) {
  return role === "super_admin";
}

export function canManageVestigingen(role: UserRole | null) {
  return role === "super_admin" || role === "admin";
}

export function canEditContent(role: UserRole | null) {
  return role === "super_admin" || role === "admin" || role === "editor";
}

