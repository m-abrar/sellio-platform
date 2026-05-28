import { apiClient, unwrapData } from '../lib/apiClient';
import { ApiError } from '../lib/apiError';
import { normalizeProduct } from '../lib/productAdapter';
import type { LaravelResponse } from '../types/api';

export interface ProductFormMeta {
  categories: Array<{ id: number; title: string }>;
  brands: Array<{ id: number; title: string }>;
  types: Array<{ id: number; title: string }>;
  features: Array<{ id: number; title: string; icon?: string }>;
}

let cachedFormMeta: ProductFormMeta | null = null;

const extractFormMeta = (response: { data: LaravelResponse<unknown> }): ProductFormMeta => {
  const sidebar = response.data.meta?.sidebar as any;

  return {
    categories: sidebar?.categories ?? [],
    brands: sidebar?.brands ?? [],
    types: sidebar?.types ?? [],
    features: sidebar?.features ?? [],
  };
};

export const getProductFormMeta = async (): Promise<ProductFormMeta> => {
  if (cachedFormMeta) {
    return cachedFormMeta;
  }

  const response = await apiClient.get('/dashboard/partner/products', { params: { per_page: 1 } });
  cachedFormMeta = extractFormMeta(response);
  return cachedFormMeta;
};

export const getProducts = async () => {
  const response = await apiClient.get('/dashboard/partner/products');
  const products = unwrapData<any[]>(response).map(normalizeProduct);
  cachedFormMeta = extractFormMeta(response);

  return {
    data: products,
    meta: response.data.meta,
  };
};

export const getProductBySlug = async (slug: string) => {
  const response = await apiClient.get(`/dashboard/partner/products/slug/${slug}`);
  const product = normalizeProduct(unwrapData(response));

  return { data: product };
};

export const createProduct = async (formData: FormData) => {
  try {
    const response = await apiClient.post('/dashboard/partner/products', formData);
    return {
      data: normalizeProduct(unwrapData(response)),
      message: response.data.message,
    };
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('Failed to create product.', 500);
  }
};

export const updateProduct = async (id: number, formData: FormData) => {
  formData.append('_method', 'PATCH');

  try {
    const response = await apiClient.post(`/dashboard/partner/products/${id}`, formData);
    return {
      data: normalizeProduct(unwrapData(response)),
      message: response.data.message,
    };
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('Failed to update product.', 500);
  }
};

export const deleteProduct = async (id: number) => {
  const response = await apiClient.delete(`/dashboard/partner/products/${id}`);
  return {
    message: response.data.message,
  };
};
