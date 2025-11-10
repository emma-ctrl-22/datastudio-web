import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { apiFetch } from '../utils/api';
import type {
  AuthResponse,
  LoginPayload,
  SignupPayload,
  CreateUserPayload,
  ChangePasswordPayload,
  UpdateUserPayload,
  UserListResponse,
  AssignRolePayload,
  Role,
  User,
} from '../types';

export function useCreateUserMutation(options?: UseMutationOptions<User, Error, CreateUserPayload>) {
  return useMutation<User, Error, CreateUserPayload>({
    mutationFn: (payload) => apiFetch<User>('/users', { method: 'POST', body: JSON.stringify(payload) }),
    ...options,
  });
}

export function useLoginMutation(options?: UseMutationOptions<AuthResponse, Error, LoginPayload>) {
  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: (payload) => apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    ...options
  });
}

export function useSignupMutation(options?: UseMutationOptions<AuthResponse, Error, SignupPayload>) {
  return useMutation<AuthResponse, Error, SignupPayload>({
    mutationFn: (payload) => apiFetch<AuthResponse>('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
    ...options
  });
}

export function useGetUserQuery(id: string, options?: UseQueryOptions<AuthResponse, Error>) {
  return useQuery<AuthResponse, Error>({
    queryKey: ['user', id],
    queryFn: () => apiFetch<AuthResponse>(`/users/${id}`),
    enabled: !!id,
    ...options
  });
}

export function useChangePasswordMutation(id: string, options?: UseMutationOptions<{ success: boolean }, Error, ChangePasswordPayload>) {
  return useMutation<{ success: boolean }, Error, ChangePasswordPayload>({
    mutationFn: (payload) => apiFetch<{ success: boolean }>(`/users/${id}/password`, { method: 'PATCH', body: JSON.stringify(payload) }),
    ...options
  });
}

export function useUpdateUserMutation(options?: UseMutationOptions<AuthResponse, Error, { id: string; payload: UpdateUserPayload }>) {
  return useMutation<AuthResponse, Error, { id: string; payload: UpdateUserPayload }>({
    mutationFn: ({ id, payload }) => apiFetch<AuthResponse>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    ...options
  });
}

export function useListUsersQuery(page = 1, pageSize = 20, options?: UseQueryOptions<UserListResponse, Error>) {
  return useQuery<UserListResponse, Error>({
    queryKey: ['users', page, pageSize],
    queryFn: () => apiFetch<UserListResponse>(`/users?page=${page}&pageSize=${pageSize}`),
    ...options
  });
}

export function useAssignRoleMutation(options?: UseMutationOptions<AuthResponse, Error, { id: string; payload: AssignRolePayload }>) {
  return useMutation<AuthResponse, Error, { id: string; payload: AssignRolePayload }>({
    mutationFn: ({ id, payload }) => apiFetch<AuthResponse>(`/users/${id}/roles`, { method: 'POST', body: JSON.stringify(payload) }),
    ...options
  });
}

export function useRemoveRoleMutation(options?: UseMutationOptions<AuthResponse, Error, { id: string; roleName: string }>) {
  return useMutation<AuthResponse, Error, { id: string; roleName: string }>({
    mutationFn: ({ id, roleName }) => apiFetch<AuthResponse>(`/users/${id}/roles/${encodeURIComponent(roleName)}`, { method: 'DELETE' }),
    ...options
  });
}

export function useDeactivateUserMutation(options?: UseMutationOptions<AuthResponse, Error, string>) {
  return useMutation<AuthResponse, Error, string>({
    mutationFn: (id) => apiFetch<AuthResponse>(`/users/${id}/deactivate`, { method: 'PATCH' }),
    ...options
  });
}

export function useReactivateUserMutation(options?: UseMutationOptions<AuthResponse, Error, string>) {
  return useMutation<AuthResponse, Error, string>({
    mutationFn: (id) => apiFetch<AuthResponse>(`/users/${id}/reactivate`, { method: 'POST' }),
    ...options
  });
}


