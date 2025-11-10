import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { apiFetch } from '../utils/api';
import type {
  Product,
  Category,
  ProductListResponse,
  CategoryListResponse,
  ListProductsParams,
  CreateProductPayload,
  UpdateProductPayload,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  ProductImage,
  AddProductImagePayload,
} from '../types';

//-================================================================================================
//? Product Hooks
//================================================================================================

export function useListProductsQuery(params: ListProductsParams, options?: Omit<UseQueryOptions<ProductListResponse, Error>, 'queryKey' | 'queryFn'>) {
  const queryParams = new URLSearchParams({
    page: String(params.page || 1),
    pageSize: String(params.pageSize || 10),
    ...(params.search && { search: params.search }),
    ...(params.category_id && { category_id: params.category_id }),
    ...(params.is_active !== undefined && { is_active: String(params.is_active) }),
  }).toString();

  return useQuery<ProductListResponse, Error>({
    queryKey: ['products', params],
    queryFn: () => apiFetch<ProductListResponse>(`/products?${queryParams}`),
    ...options,
  });
}

export function useGetProductQuery(id: string, options?: Omit<UseQueryOptions<Product, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: () => apiFetch<Product>(`/products/${id}`),
    enabled: !!id,
    ...options,
  });
}

export function useCreateProductMutation(options?: UseMutationOptions<Product, Error, CreateProductPayload>) {
  return useMutation<Product, Error, CreateProductPayload>({
    mutationFn: (payload) => apiFetch<Product>('/products', { method: 'POST', body: JSON.stringify(payload) }),
    ...options,
  });
}

export function useUpdateProductMutation(options?: UseMutationOptions<Product, Error, { id: string; payload: UpdateProductPayload }>) {
  return useMutation<Product, Error, { id: string; payload: UpdateProductPayload }>({
    mutationFn: ({ id, payload }) => apiFetch<Product>(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    ...options,
  });
}

export function useDeleteProductMutation(options?: UseMutationOptions<{ success: boolean }, Error, string>) {
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id) => apiFetch<{ success: boolean }>(`/products/${id}`, { method: 'DELETE' }),
    ...options,
  });
}

//-================================================================================================
//? Product Image Hooks
//================================================================================================

export function useListProductImagesQuery(productId: string, options?: Omit<UseQueryOptions<ProductImage[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery<ProductImage[], Error>({
    queryKey: ['product-images', productId],
    queryFn: () => apiFetch<ProductImage[]>(`/products/${productId}/images`),
    enabled: !!productId,
    ...options,
  });
}

export function useAddProductImageMutation(productId: string, options?: UseMutationOptions<ProductImage, Error, AddProductImagePayload>) {
  return useMutation<ProductImage, Error, AddProductImagePayload>({
    mutationFn: (payload) => apiFetch<ProductImage>(`/products/${productId}/images`, { method: 'POST', body: JSON.stringify(payload) }),
    ...options,
  });
}

export function useDeleteProductImageMutation(options?: UseMutationOptions<{ success: boolean }, Error, string>) {
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id) => apiFetch<{ success: boolean }>(`/product-images/${id}`, { method: 'DELETE' }),
    ...options,
  });
}


//-================================================================================================
//? Category Hooks
//================================================================================================

export function useGetCategoryQuery(id: string, options?: Omit<UseQueryOptions<Category, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery<Category, Error>({
    queryKey: ['category', id],
    queryFn: () => apiFetch<Category>(`/categories/${id}`),
    enabled: !!id,
    ...options,
  });
}

export function useListCategoriesQuery(activeOnly = false, options?: Omit<UseQueryOptions<CategoryListResponse, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery<CategoryListResponse, Error>({
    queryKey: ['categories', { activeOnly }],
    queryFn: () => apiFetch<CategoryListResponse>(`/categories?activeOnly=${activeOnly}`),
    ...options,
  });
}

export function useCreateCategoryMutation(options?: UseMutationOptions<Category, Error, CreateCategoryPayload>) {
  return useMutation<Category, Error, CreateCategoryPayload>({
    mutationFn: (payload) => apiFetch<Category>('/categories', { method: 'POST', body: JSON.stringify(payload) }),
    ...options,
  });
}

export function useUpdateCategoryMutation(options?: UseMutationOptions<Category, Error, { id: string; payload: UpdateCategoryPayload }>) {
  return useMutation<Category, Error, { id: string; payload: UpdateCategoryPayload }>({
    mutationFn: ({ id, payload }) => apiFetch<Category>(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    ...options,
  });
}

export function useDeleteCategoryMutation(options?: UseMutationOptions<{ success: boolean }, Error, string>) {
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id) => apiFetch<{ success: boolean }>(`/categories/${id}`, { method: 'DELETE' }),
    ...options,
  });
}
