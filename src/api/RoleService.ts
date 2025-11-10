import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { apiFetch } from '../utils/api';
import type { Role, Permission, CreateRolePayload, UpdateRolePayload } from '../types';

export function useListRolesQuery(options?: UseQueryOptions<Role[], Error>) {
  return useQuery<Role[], Error>({
    queryKey: ['roles'],
    queryFn: () => apiFetch<Role[]>('/roles'),
    ...options,
  });
}

export function useListPermissionsQuery(options?: UseQueryOptions<Permission[], Error>) {
  return useQuery<Permission[], Error>({
    queryKey: ['permissions'],
    queryFn: () => apiFetch<Permission[]>('/roles/permissions'),
    ...options,
  });
}

export function useCreateRoleMutation(options?: UseMutationOptions<Role, Error, CreateRolePayload>) {
  return useMutation<Role, Error, CreateRolePayload>({
    mutationFn: (payload) => apiFetch<Role>('/roles', { method: 'POST', body: JSON.stringify(payload) }),
    ...options,
  });
}

export function useUpdateRoleMutation(options?: UseMutationOptions<Role, Error, { id: string; payload: UpdateRolePayload }>) {
  return useMutation<Role, Error, { id: string; payload: UpdateRolePayload }>({
    mutationFn: ({ id, payload }) => apiFetch<Role>(`/roles/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    ...options,
  });
}

export function useDeleteRoleMutation(options?: UseMutationOptions<{ success: boolean }, Error, string>) {
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id) => apiFetch<{ success: boolean }>(`/roles/${id}`, { method: 'DELETE' }),
    ...options,
  });
}

export function useGetRoleQuery(id: string, options?: UseQueryOptions<Role & { permissions: Permission[] }, Error>) {
  return useQuery<Role & { permissions: Permission[] }, Error>({
    queryKey: ['role', id],
    queryFn: () => apiFetch<Role & { permissions: Permission[] }>(`/roles/${id}`),
    ...options,
  });
}
