import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { apiFetch } from '../utils/api';
import type {
  Supplier,
  SupplierListResponse,
  CreateSupplierPayload,
  UpdateSupplierPayload,
  ProductSupplier,
} from '../types';

export function useListSuppliersQuery(activeOnly = false, options?: Omit<UseQueryOptions<SupplierListResponse, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery<SupplierListResponse, Error>({
    queryKey: ['suppliers', { activeOnly }],
    queryFn: () => apiFetch<SupplierListResponse>(`/suppliers?activeOnly=${activeOnly}`),
    ...options,
  });
}

export function useGetSupplierQuery(id: string, options?: Omit<UseQueryOptions<Supplier, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery<Supplier, Error>({
    queryKey: ['supplier', id],
    queryFn: () => apiFetch<Supplier>(`/suppliers/${id}`),
    enabled: !!id,
    ...options,
  });
}

export function useCreateSupplierMutation(options?: UseMutationOptions<Supplier, Error, CreateSupplierPayload>) {
  return useMutation<Supplier, Error, CreateSupplierPayload>({
    mutationFn: (payload) => apiFetch<Supplier>('/suppliers', { method: 'POST', body: JSON.stringify(payload) }),
    ...options,
  });
}

export function useUpdateSupplierMutation(options?: UseMutationOptions<Supplier, Error, { id: string; payload: UpdateSupplierPayload }>) {
  return useMutation<Supplier, Error, { id: string; payload: UpdateSupplierPayload }>({
    mutationFn: ({ id, payload }) => apiFetch<Supplier>(`/suppliers/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    ...options,
  });
}

export function useDeleteSupplierMutation(options?: UseMutationOptions<{ success: boolean }, Error, string>) {
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id) => apiFetch<{ success: boolean }>(`/suppliers/${id}`, { method: 'DELETE' }),
    ...options,
  });
}

export function useGetProductsBySupplierQuery(supplierId: string, options?: Omit<UseQueryOptions<ProductSupplier[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery<ProductSupplier[], Error>({
    queryKey: ['supplier-products', supplierId],
    queryFn: () => apiFetch<ProductSupplier[]>(`/suppliers/${supplierId}/products`),
    enabled: !!supplierId,
    ...options,
  });
}
