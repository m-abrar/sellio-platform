import { apiClient, unwrapData } from '../lib/apiClient';
import { ApiError } from '../lib/apiError';
import { normalizeProperty } from '../lib/propertyAdapter';
import type { LaravelResponse } from '../types/api';

export interface PropertyFormMeta {
  categories: Array<{ id: number; title: string }>;
  types: Array<{ id: number; title: string }>;
  locations: Array<{ id: number; title: string }>;
  amenities: Array<{ id: number; title: string }>;
  brands: Array<{ id: number; title: string }>;
  features: Array<{ id: number; title: string }>;
  google_maps_api_key?: string | null;
}

let cachedFormMeta: PropertyFormMeta | null = null;

const extractFormMeta = (response: { data: LaravelResponse<unknown> }): PropertyFormMeta => {
  const form = (response.data.meta?.form ?? response.data.data) as PropertyFormMeta | undefined;

  return {
    categories: form?.categories ?? [],
    types: form?.types ?? [],
    locations: form?.locations ?? [],
    amenities: form?.amenities ?? [],
    brands: (form as any)?.brands ?? [],
    features: (form as any)?.features ?? [],
    google_maps_api_key: (form as any)?.google_maps_api_key ?? null,
  };
};

export const getPropertyFormMeta = async (): Promise<PropertyFormMeta> => {
  if (cachedFormMeta) {
    return cachedFormMeta;
  }

  const response = await apiClient.get('/dashboard/partner/properties/form-data');
  cachedFormMeta = extractFormMeta(response);
  return cachedFormMeta;
};

export const getProperties = async () => {
  const response = await apiClient.get('/dashboard/partner/properties');
  const properties = unwrapData<any[]>(response).map(normalizeProperty);
  cachedFormMeta = extractFormMeta(response);

  return {
    data: properties,
    meta: response.data.meta,
  };
};

export const getPropertyBySlug = async (slug: string) => {
  const response = await apiClient.get(`/dashboard/partner/properties/slug/${slug}`);
  const property = normalizeProperty(unwrapData(response));

  return { data: property };
};

export const createProperty = async (formData: FormData) => {
  try {
    const response = await apiClient.post('/dashboard/partner/properties', formData);
    return {
      data: normalizeProperty(unwrapData(response)),
      message: response.data.message,
    };
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('Failed to create property.', 500);
  }
};

export const updateProperty = async (id: number, formData: FormData) => {
  formData.append('_method', 'PATCH');

  try {
    const response = await apiClient.post(`/dashboard/partner/properties/${id}`, formData);
    return {
      data: normalizeProperty(unwrapData(response)),
      message: response.data.message,
    };
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('Failed to update property.', 500);
  }
};

export const deleteProperty = async (id: number) => {
  const response = await apiClient.delete(`/dashboard/partner/properties/${id}`);
  return {
    message: response.data.message,
  };
};
