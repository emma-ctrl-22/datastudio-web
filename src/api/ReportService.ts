import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiFetch } from '../utils/api';
import type { DashboardSummary, LowStockAlert, EnhancedDashboardSummary,DispatchHistoryListResponse,MoversReportListResponse,PurchaseHistoryListResponse,ListPurchaseHistoryParams,ListDispatchHistoryParams,ListMoversReportParams} from '../types';

/**
 * Fetches the aggregated data for the main dashboard.
 */
export function useDashboardSummaryQuery(options?: UseQueryOptions<DashboardSummary, Error>) {
  return useQuery<DashboardSummary, Error>({
    queryKey: ['dashboard-summary'],
    queryFn: () => apiFetch<DashboardSummary>('/reports/dashboard-summary'),
    ...options,
  });
}

/**
 * Fetches enhanced dashboard summary data.
 */
export function useEnhancedDashboardSummaryQuery(options?: UseQueryOptions<EnhancedDashboardSummary, Error>) {
  return useQuery<EnhancedDashboardSummary, Error>({
    queryKey: ['enhanced-dashboard-summary'],
    queryFn: () => apiFetch<EnhancedDashboardSummary>('/reports/dashboard-summary-enhanced'),
    ...options,
  });
}

/**
 * Fetches a list of products that are currently below their reorder level.
 */
export function useLowStockAlertsQuery(options?: UseQueryOptions<LowStockAlert[], Error>) {
  return useQuery<LowStockAlert[], Error>({
    queryKey: ['low-stock-alerts'],
    queryFn: () => apiFetch<LowStockAlert[]>('/reports/low-stock'),
    ...options,
  });
}

/**
 * Fetches purchase history data with filtering options.
 */
export function usePurchaseHistoryQuery(params: ListPurchaseHistoryParams, options?: Omit<UseQueryOptions<PurchaseHistoryListResponse, Error>, 'queryKey' | 'queryFn'>) {
  const queryParams = new URLSearchParams({
    page: String(params.page || 1),
    pageSize: String(params.pageSize || 10),
    ...(params.start_date && { start_date: params.start_date }),
    ...(params.end_date && { end_date: params.end_date }),
    ...(params.product_id && { product_id: params.product_id }),
    ...(params.supplier_id && { supplier_id: params.supplier_id }),
  }).toString();

  return useQuery<PurchaseHistoryListResponse, Error>({
    queryKey: ['purchase-history', params],
    queryFn: () => apiFetch<PurchaseHistoryListResponse>(`/reports/purchase-history?${queryParams}`),
    ...options,
  });
}

/**
 * Fetches dispatch history data with filtering options.
 */
export function useDispatchHistoryQuery(params: ListDispatchHistoryParams, options?: Omit<UseQueryOptions<DispatchHistoryListResponse, Error>, 'queryKey' | 'queryFn'>) {
  const queryParams = new URLSearchParams({
    page: String(params.page || 1),
    pageSize: String(params.pageSize || 10),
    ...(params.start_date && { start_date: params.start_date }),
    ...(params.end_date && { end_date: params.end_date }),
    ...(params.product_id && { product_id: params.product_id }),
    ...(params.recipient_type && { recipient_type: params.recipient_type }),
  }).toString();

  return useQuery<DispatchHistoryListResponse, Error>({
    queryKey: ['dispatch-history', params],
    queryFn: () => apiFetch<DispatchHistoryListResponse>(`/reports/dispatch-history?${queryParams}`),
    ...options,
  });
}

/**
 * Fetches fast-moving items report data with filtering options.
 */
export function useFastMovingItemsQuery(params: ListMoversReportParams, options?: Omit<UseQueryOptions<MoversReportListResponse, Error>, 'queryKey' | 'queryFn'>) {
  const queryParams = new URLSearchParams({
    page: String(params.page || 1),
    pageSize: String(params.pageSize || 10),
    ...(params.time_window && { time_window: params.time_window }),
  }).toString();

  return useQuery<MoversReportListResponse, Error>({
    queryKey: ['fast-moving-items', params],
    queryFn: () => apiFetch<MoversReportListResponse>(`/reports/fast-movers?${queryParams}`),
    ...options,
  });
}

/**
 * Fetches slow-moving items report data with filtering options.
 */
export function useSlowMovingItemsQuery(params: ListMoversReportParams, options?: Omit<UseQueryOptions<MoversReportListResponse, Error>, 'queryKey' | 'queryFn'>) {
  const queryParams = new URLSearchParams({
    page: String(params.page || 1),
    pageSize: String(params.pageSize || 10),
    ...(params.time_window && { time_window: params.time_window }),
  }).toString();

  return useQuery<MoversReportListResponse, Error>({
    queryKey: ['slow-moving-items', params],
    queryFn: () => apiFetch<MoversReportListResponse>(`/reports/slow-movers?${queryParams}`),
    ...options,
  });
}

