import { apiClient, unwrapData } from '../lib/apiClient';
import { ApiError } from '../lib/apiError';
import { normalizeEvent } from '../lib/eventAdapter';
import type { LaravelResponse } from '../types/api';

export interface EventFormMeta {
  categories: Array<{ id: number; title: string }>;
  types: Array<{ id: number; title: string }>;
  locations: Array<{ id: number; title: string }>;
}

let cachedFormMeta: EventFormMeta | null = null;

const extractFormMeta = (response: { data: LaravelResponse<unknown> }): EventFormMeta => {
  const form = (response.data.meta?.form ?? response.data.data) as EventFormMeta | undefined;

  return {
    categories: form?.categories ?? [],
    types: form?.types ?? [],
    locations: form?.locations ?? [],
  };
};

export const getEventFormMeta = async (): Promise<EventFormMeta> => {
  if (cachedFormMeta) {
    return cachedFormMeta;
  }

  const response = await apiClient.get('/dashboard/partner/events/form-data');
  cachedFormMeta = extractFormMeta(response);
  return cachedFormMeta;
};

export const getEvents = async () => {
  const response = await apiClient.get('/dashboard/partner/events');
  const events = unwrapData<any[]>(response).map(normalizeEvent);
  cachedFormMeta = extractFormMeta(response);

  return {
    data: events,
    meta: response.data.meta,
  };
};

export const getEventBySlug = async (slug: string) => {
  const response = await apiClient.get(`/dashboard/partner/events/slug/${slug}`);
  const event = normalizeEvent(unwrapData(response));

  return { data: event };
};

export const createEvent = async (formData: FormData) => {
  try {
    const response = await apiClient.post('/dashboard/partner/events', formData);
    return {
      data: normalizeEvent(unwrapData(response)),
      message: response.data.message,
    };
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('Failed to create event.', 500);
  }
};

export const updateEvent = async (id: number, formData: FormData) => {
  formData.append('_method', 'PATCH');

  try {
    const response = await apiClient.post(`/dashboard/partner/events/${id}`, formData);
    return {
      data: normalizeEvent(unwrapData(response)),
      message: response.data.message,
    };
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('Failed to update event.', 500);
  }
};

export const deleteEvent = async (id: number) => {
  const response = await apiClient.delete(`/dashboard/partner/events/${id}`);
  return {
    message: response.data.message,
  };
};
