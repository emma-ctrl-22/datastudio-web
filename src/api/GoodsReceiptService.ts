import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiFetch } from '../utils/api';
import type { GoodsReceipt, CreateGoodsReceiptPayload } from '../types';

export function useCreateGoodsReceiptMutation(options?: UseMutationOptions<GoodsReceipt, Error, CreateGoodsReceiptPayload>) {
  return useMutation<GoodsReceipt, Error, CreateGoodsReceiptPayload>({
    mutationFn: (payload) => apiFetch<GoodsReceipt>('/goods-receipts', { method: 'POST', body: JSON.stringify(payload) }),
    ...options,
  });
}
