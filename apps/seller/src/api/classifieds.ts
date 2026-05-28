import { apiClient, unwrapData } from '../lib/apiClient';
import { ApiError } from '../lib/apiError';
import { normalizeClassified } from '../lib/classifiedAdapter';
import type { LaravelResponse } from '../types/api';

export interface ClassifiedFormMeta {
  categories: Array<{ id: number; title: string }>;
  types: Array<{ id: number; title: string }>;
  locations: Array<{ id: number; title: string }>;
  brands: Array<{ id: number; title: string }>;
}

let cachedFormMeta: ClassifiedFormMeta | null = null;

const extractFormMeta = (response: { data: LaravelResponse<unknown> }): ClassifiedFormMeta => {
  const form = (response.data.meta?.form ?? response.data.data) as ClassifiedFormMeta | undefined;

  return {
    categories: form?.categories ?? [],
    types: form?.types ?? [],
    locations: form?.locations ?? [],
    brands: (form as any)?.brands ?? [],
  };
};

export const getClassifiedFormMeta = async (): Promise<ClassifiedFormMeta> => {
  if (cachedFormMeta) {
    return cachedFormMeta;
  }

  const response = await apiClient.get('/dashboard/partner/classifieds/form-data');
  cachedFormMeta = extractFormMeta(response);
  return cachedFormMeta;
};

export const getClassifieds = async () => {
  const response = await apiClient.get('/dashboard/partner/classifieds');
  const classifieds = unwrapData<any[]>(response).map(normalizeClassified);
  cachedFormMeta = extractFormMeta(response);

  return {
    data: classifieds,
    meta: response.data.meta,
  };
};

export const getClassifiedBySlug = async (slug: string) => {
  const response = await apiClient.get(`/dashboard/partner/classifieds/slug/${slug}`);
  const classified = normalizeClassified(unwrapData(response));

  return { data: classified };
};

export const createClassified = async (formData: FormData) => {
  try {
    const response = await apiClient.post('/dashboard/partner/classifieds', formData);
    return {
      data: normalizeClassified(unwrapData(response)),
      message: response.data.message,
    };
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('Failed to create classified.', 500);
  }
};

export const updateClassified = async (id: number, formData: FormData) => {
  formData.append('_method', 'PATCH');

  try {
    const response = await apiClient.post(`/dashboard/partner/classifieds/${id}`, formData);
    return {
      data: normalizeClassified(unwrapData(response)),
      message: response.data.message,
    };
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('Failed to update classified.', 500);
  }
};

export const deleteClassified = async (id: number) => {
  const response = await apiClient.delete(`/dashboard/partner/classifieds/${id}`);
  return {
    message: response.data.message,
  };
};
