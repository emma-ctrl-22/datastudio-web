import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { apiFetch } from '../utils/api';
import type {
  ProductSupplier,
  LinkProductSupplierPayload,
  UpdateProductSupplierPayload,
} from '../types';

export function useListProductSuppliersQuery(productId: string, options?: UseQueryOptions<ProductSupplier[], Error>) {
  return useQuery<ProductSupplier[], Error>({
    queryKey: ['product-suppliers', productId],
    queryFn: () => apiFetch<ProductSupplier[]>(`/products/${productId}/suppliers`),
    enabled: !!productId,
    ...options,
  });
}

export function useLinkProductSupplierMutation(productId: string, options?: UseMutationOptions<ProductSupplier, Error, LinkProductSupplierPayload>) {
  return useMutation<ProductSupplier, Error, LinkProductSupplierPayload>({
    mutationFn: (payload) => apiFetch<ProductSupplier>(`/products/${productId}/suppliers`, { method: 'POST', body: JSON.stringify(payload) }),
    ...options,
  });
}

export function useUpdateProductSupplierMutation(options?: UseMutationOptions<ProductSupplier, Error, { id: string; payload: UpdateProductSupplierPayload }>) {
  return useMutation<ProductSupplier, Error, { id: string; payload: UpdateProductSupplierPayload }>({
    mutationFn: ({ id, payload }) => apiFetch<ProductSupplier>(`/product-suppliers/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    ...options,
  });
}

export function useDeleteProductSupplierMutation(options?: UseMutationOptions<{ success: boolean }, Error, string>) {
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id) => apiFetch<{ success: boolean }>(`/product-suppliers/${id}`, { method: 'DELETE' }),
    ...options,
  });
}
