import { apiClient, unwrapData } from '../lib/apiClient';
import { ApiError } from '../lib/apiError';
import { normalizeAuto } from '../lib/autoAdapter';
import type { LaravelResponse } from '../types/api';

export interface AutoFormMeta {
  categories: Array<{ id: number; title: string }>;
  brands: Array<{ id: number; title: string }>;
  types: Array<{ id: number; title: string }>;
  locations: Array<{ id: number; title: string }>;
}

let cachedFormMeta: AutoFormMeta | null = null;

const extractFormMeta = (response: { data: LaravelResponse<unknown> }): AutoFormMeta => {
  const form = (response.data.meta?.form ?? response.data.data) as AutoFormMeta | undefined;

  return {
    categories: form?.categories ?? [],
    brands: form?.brands ?? [],
    types: form?.types ?? [],
    locations: form?.locations ?? [],
  };
};

export const getAutoFormMeta = async (): Promise<AutoFormMeta> => {
  if (cachedFormMeta) {
    return cachedFormMeta;
  }

  const response = await apiClient.get('/dashboard/partner/autos/form-data');
  cachedFormMeta = extractFormMeta(response);
  return cachedFormMeta;
};

export const getAutos = async () => {
  const response = await apiClient.get('/dashboard/partner/autos');
  const autos = unwrapData<any[]>(response).map(normalizeAuto);
  cachedFormMeta = extractFormMeta(response);

  return {
    data: autos,
    meta: response.data.meta,
  };
};

export const getAutoBySlug = async (slug: string) => {
  const response = await apiClient.get(`/dashboard/partner/autos/slug/${slug}`);
  const auto = normalizeAuto(unwrapData(response));

  return { data: auto };
};

export const createAuto = async (formData: FormData) => {
  try {
    const response = await apiClient.post('/dashboard/partner/autos', formData);
    return {
      data: normalizeAuto(unwrapData(response)),
      message: response.data.message,
    };
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('Failed to create vehicle.', 500);
  }
};

export const updateAuto = async (id: number, formData: FormData) => {
  formData.append('_method', 'PATCH');

  try {
    const response = await apiClient.post(`/dashboard/partner/autos/${id}`, formData);
    return {
      data: normalizeAuto(unwrapData(response)),
      message: response.data.message,
    };
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('Failed to update vehicle.', 500);
  }
};

export const deleteAuto = async (id: number) => {
  const response = await apiClient.delete(`/dashboard/partner/autos/${id}`);
  return {
    message: response.data.message,
  };
};
