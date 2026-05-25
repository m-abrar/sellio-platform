import { apiClient, unwrapData } from '../lib/apiClient';
import { ApiError } from '../lib/apiError';
import { normalizeJob } from '../lib/jobAdapter';
import type { LaravelResponse } from '../types/api';

export interface JobFormMeta {
  categories: Array<{ id: number; title: string }>;
  types: Array<{ id: number; title: string }>;
  locations: Array<{ id: number; title: string }>;
}

let cachedFormMeta: JobFormMeta | null = null;

const extractFormMeta = (response: { data: LaravelResponse<unknown> }): JobFormMeta => {
  const form = (response.data.meta?.form ?? response.data.data) as JobFormMeta | undefined;

  return {
    categories: form?.categories ?? [],
    types: form?.types ?? [],
    locations: form?.locations ?? [],
  };
};

export const getJobFormMeta = async (): Promise<JobFormMeta> => {
  if (cachedFormMeta) {
    return cachedFormMeta;
  }

  const response = await apiClient.get('/dashboard/partner/joblistings/form-data');
  cachedFormMeta = extractFormMeta(response);
  return cachedFormMeta;
};

export const getJobs = async () => {
  const response = await apiClient.get('/dashboard/partner/joblistings');
  const jobs = unwrapData<any[]>(response).map(normalizeJob);
  cachedFormMeta = extractFormMeta(response);

  return {
    data: jobs,
    meta: response.data.meta,
  };
};

export const getJobBySlug = async (slug: string) => {
  const response = await apiClient.get(`/dashboard/partner/joblistings/slug/${slug}`);
  const job = normalizeJob(unwrapData(response));

  return { data: job };
};

export const createJob = async (formData: FormData) => {
  try {
    const response = await apiClient.post('/dashboard/partner/joblistings', formData);
    return {
      data: normalizeJob(unwrapData(response)),
      message: response.data.message,
    };
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('Failed to create job.', 500);
  }
};

export const updateJob = async (id: number, formData: FormData) => {
  formData.append('_method', 'PATCH');

  try {
    const response = await apiClient.post(`/dashboard/partner/joblistings/${id}`, formData);
    return {
      data: normalizeJob(unwrapData(response)),
      message: response.data.message,
    };
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('Failed to update job.', 500);
  }
};

export const deleteJob = async (id: number) => {
  const response = await apiClient.delete(`/dashboard/partner/joblistings/${id}`);
  return {
    message: response.data.message,
  };
};
