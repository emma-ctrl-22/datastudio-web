import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { apiFetch } from '../utils/api';
import type {
  DispatchOrder,
  DispatchOrderListResponse,
  ListDispatchOrdersParams,
  CreateDispatchOrderPayload,
  UpdateDispatchOrderPayload,
} from '../types';

export function useListDispatchOrdersQuery(params: ListDispatchOrdersParams, options?: UseQueryOptions<DispatchOrderListResponse, Error>) {
  const queryParams = new URLSearchParams({
    page: String(params.page || 1),
    pageSize: String(params.pageSize || 10),
    ...(params.status && { status: params.status }),
    ...(params.recipient_type && { recipient_type: params.recipient_type }),
    ...(params.start_date && { start_date: params.start_date }),
    ...(params.end_date && { end_date: params.end_date }),
  }).toString();

  return useQuery<DispatchOrderListResponse, Error>({
    queryKey: ['dispatch-orders', params],
    queryFn: () => apiFetch<DispatchOrderListResponse>(`/dispatch-orders?${queryParams}`),
    ...options,
  });
}

export function useGetDispatchOrderQuery(id: string, options?: Omit<UseQueryOptions<DispatchOrder, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery<DispatchOrder, Error>({
    queryKey: ['dispatch-order', id],
    queryFn: () => apiFetch<DispatchOrder>(`/dispatch-orders/${id}`),
    enabled: !!id,
    ...options,
  });
}

export function useCreateDispatchOrderMutation(options?: UseMutationOptions<DispatchOrder, Error, CreateDispatchOrderPayload>) {
  return useMutation<DispatchOrder, Error, CreateDispatchOrderPayload>({
    mutationFn: (payload) => apiFetch<DispatchOrder>('/dispatch-orders', { method: 'POST', body: JSON.stringify(payload) }),
    ...options,
  });
}

export function useUpdateDispatchOrderMutation(options?: UseMutationOptions<DispatchOrder, Error, { id: string; payload: UpdateDispatchOrderPayload }>) {
  return useMutation<DispatchOrder, Error, { id: string; payload: UpdateDispatchOrderPayload }>({
    mutationFn: ({ id, payload }) => apiFetch<DispatchOrder>(`/dispatch-orders/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    ...options,
  });
}

export function useDeleteDispatchOrderMutation(options?: UseMutationOptions<{ success: boolean }, Error, string>) {
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id) => apiFetch<{ success: boolean }>(`/dispatch-orders/${id}`, { method: 'DELETE' }),
    ...options,
  });
}
