import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { hasPermission } from '../utils/permissions';

export function PermissionRoute({ children, resource, action }: { children: ReactNode; resource: string; action: string }) {
  const perms = useAuthStore(s => s.permissions);
  const user = useAuthStore(s => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (!hasPermission(perms, resource, action)) return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
}


