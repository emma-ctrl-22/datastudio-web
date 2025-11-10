import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { apiFetch } from '../utils/api';
import type {
  PurchaseOrder,
  PurchaseOrderListResponse,
  ListPurchaseOrdersParams,
  CreatePurchaseOrderPayload,
  UpdatePurchaseOrderPayload,
} from '../types';

export function useListPurchaseOrdersQuery(params: ListPurchaseOrdersParams, options?: Omit<UseQueryOptions<PurchaseOrderListResponse, Error>, 'queryKey' | 'queryFn'>) {
  const queryParams = new URLSearchParams({
    page: String(params.page || 1),
    pageSize: String(params.pageSize || 10),
    ...(params.supplier_id && { supplier_id: params.supplier_id }),
    ...(params.status && { status: params.status }),
    ...(params.start_date && { start_date: params.start_date }),
    ...(params.end_date && { end_date: params.end_date }),
  }).toString();

  return useQuery<PurchaseOrderListResponse, Error>({
    queryKey: ['purchase-orders', params],
    queryFn: () => apiFetch<PurchaseOrderListResponse>(`/purchase-orders?${queryParams}`),
    ...options,
  });
}

export function useGetPurchaseOrderQuery(id: string, options?: Omit<UseQueryOptions<PurchaseOrder, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery<PurchaseOrder, Error>({
    queryKey: ['purchase-order', id],
    queryFn: () => apiFetch<PurchaseOrder>(`/purchase-orders/${id}`),
    ...options,
  });
}

export function useCreatePurchaseOrderMutation(options?: UseMutationOptions<PurchaseOrder, Error, CreatePurchaseOrderPayload>) {
  return useMutation<PurchaseOrder, Error, CreatePurchaseOrderPayload>({
    mutationFn: (payload) => apiFetch<PurchaseOrder>('/purchase-orders', { method: 'POST', body: JSON.stringify(payload) }),
    ...options,
  });
}

export function useUpdatePurchaseOrderMutation(options?: UseMutationOptions<PurchaseOrder, Error, { id: string; payload: UpdatePurchaseOrderPayload }>) {
  return useMutation<PurchaseOrder, Error, { id: string; payload: UpdatePurchaseOrderPayload }>({
    mutationFn: ({ id, payload }) => apiFetch<PurchaseOrder>(`/purchase-orders/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    ...options,
  });
}

export function useDeletePurchaseOrderMutation(options?: UseMutationOptions<{ success: boolean }, Error, string>) {
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id) => apiFetch<{ success: boolean }>(`/purchase-orders/${id}`, { method: 'DELETE' }),
    ...options,
  });
}
