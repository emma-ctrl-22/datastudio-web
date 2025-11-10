import type { Permission } from '../types';

export function hasPermission(perms: Permission[], resource: string, action: string): boolean {
  return perms.some(p => p.resource === resource && p.action === action);
}

export function hasAnyPermission(perms: Permission[], checks: Array<{resource: string; action: string}>): boolean {
  return checks.some(c => hasPermission(perms, c.resource, c.action));
}


