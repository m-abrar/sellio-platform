import { apiClient, unwrapData } from '../lib/apiClient';
import { ApiError } from '../lib/apiError';
import { normalizeService } from '../lib/serviceAdapter';
import type { LaravelResponse } from '../types/api';

export interface ServiceFormMeta {
  categories: Array<{ id: number; title: string }>;
  types: Array<{ id: number; title: string }>;
  locations: Array<{ id: number; title: string }>;
}

let cachedFormMeta: ServiceFormMeta | null = null;

const extractFormMeta = (response: { data: LaravelResponse<unknown> }): ServiceFormMeta => {
  const form = (response.data.meta?.form ?? response.data.data) as ServiceFormMeta | undefined;

  return {
    categories: form?.categories ?? [],
    types: form?.types ?? [],
    locations: form?.locations ?? [],
  };
};

export const getServiceFormMeta = async (): Promise<ServiceFormMeta> => {
  if (cachedFormMeta) {
    return cachedFormMeta;
  }

  const response = await apiClient.get('/dashboard/partner/services/form-data');
  cachedFormMeta = extractFormMeta(response);
  return cachedFormMeta;
};

export const getServices = async () => {
  const response = await apiClient.get('/dashboard/partner/services');
  const services = unwrapData<any[]>(response).map(normalizeService);
  cachedFormMeta = extractFormMeta(response);

  return {
    data: services,
    meta: response.data.meta,
  };
};

export const getServiceBySlug = async (slug: string) => {
  const response = await apiClient.get(`/dashboard/partner/services/slug/${slug}`);
  const service = normalizeService(unwrapData(response));

  return { data: service };
};

export const createService = async (formData: FormData) => {
  try {
    const response = await apiClient.post('/dashboard/partner/services', formData);
    return {
      data: normalizeService(unwrapData(response)),
      message: response.data.message,
    };
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('Failed to create service.', 500);
  }
};

export const updateService = async (id: number, formData: FormData) => {
  formData.append('_method', 'PATCH');

  try {
    const response = await apiClient.post(`/dashboard/partner/services/${id}`, formData);
    return {
      data: normalizeService(unwrapData(response)),
      message: response.data.message,
    };
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('Failed to update service.', 500);
  }
};

export const deleteService = async (id: number) => {
  const response = await apiClient.delete(`/dashboard/partner/services/${id}`);
  return {
    message: response.data.message,
  };
};
