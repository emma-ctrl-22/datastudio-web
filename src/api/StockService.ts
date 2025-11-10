import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiFetch } from '../utils/api';
import type { CurrentStockLevel, StockMovementListResponse, ListStockMovementsParams } from '../types';

export type ListStockBalancesParams = {
  product_id?: string;
};

/**
 * Fetches current stock levels for all products or a specific product.
 */
export function useCurrentStockLevelsQuery(params?: ListStockBalancesParams, options?: UseQueryOptions<StockBalance[], Error>) {
  const queryParams = new URLSearchParams({
    ...(params?.product_id && { product_id: params.product_id }),
  }).toString();

  return useQuery<StockBalance[], Error>({
    queryKey: ['stock-balances', params],
    queryFn: () => apiFetch<StockBalance[]>(`/reports/stock-levels?${queryParams}`),
    ...options,
  });
}

/**
 * Fetches a paginated list of stock movements.
 */
export function useListStockMovementsQuery(params: ListStockMovementsParams, options?: UseQueryOptions<StockMovementListResponse, Error>) {
  const queryParams = new URLSearchParams({
    page: String(params.page || 1),
    pageSize: String(params.pageSize || 10),
    ...(params.product_id && { product_id: params.product_id }),
    ...(params.movement_type && { movement_type: params.movement_type }),
    ...(params.reference_type && { reference_type: params.reference_type }),
    ...(params.start_date && { start_date: params.start_date }),
    ...(params.end_date && { end_date: params.end_date }),
  }).toString();

  return useQuery<StockMovementListResponse, Error>({
    queryKey: ['stock-movements', params],
    queryFn: () => apiFetch<StockMovementListResponse>(`/stock/movements?${queryParams}`),
    ...options,
  });
}
