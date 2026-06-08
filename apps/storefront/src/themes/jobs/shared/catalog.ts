import { api } from '@sellio/api-client';
import type { JobListing } from '@sellio/types';
import {
  findCorporateFallbackJob,
  findFallbackJob,
  findStartupFallbackJob,
  getCorporateRelatedJobs,
  getFallbackJobs,
  getRelatedFallbackJobs,
  getStartupRelatedJobs,
} from './fallback-data';

export type JobsThemeVariant = 'startup' | 'corporate' | 'tech' | 'modern' | 'freelance' | 'blue_collar';

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) {
      return response.data.message;
    }
  }

  return 'Jobs are temporarily unavailable.';
}

export async function fetchJobsHome(perPage = 6) {
  try {
    const response = await api.getJobs({ per_page: perPage });
    return { ok: true as const, response };
  } catch (error) {
    return { ok: false as const, error: toErrorMessage(error) };
  }
}

export async function fetchJobsExplore(queryParams: Record<string, unknown>) {
  try {
    const response = await api.getJobs(queryParams);
    return { ok: true as const, response };
  } catch (error) {
    return { ok: false as const, error: toErrorMessage(error) };
  }
}

export async function fetchJobDetail(slug: string) {
  try {
    const response = await api.getJobDetails(slug);
    if (response?.success && response.data) {
      return { ok: true as const, response };
    }
    return { ok: false as const, error: 'Job not found or API returned no data.' };
  } catch (error) {
    return { ok: false as const, error: toErrorMessage(error) };
  }
}

export function resolveJobsFailure(allowDemo: boolean, variant: JobsThemeVariant) {
  if (allowDemo) {
    return {
      mode: 'demo' as const,
      jobs: getFallbackJobs(variant),
    };
  }

  return { mode: 'empty' as const };
}

export function resolveJobFailure(
  slug: string,
  allowDemo: boolean,
  variant: JobsThemeVariant,
) {
  if (!allowDemo) {
    return { mode: 'empty' as const };
  }

  const job = findFallbackJob(slug, variant);

  if (!job) {
    return { mode: 'notFound' as const };
  }

  return {
    mode: 'demo' as const,
    job,
    related: getRelatedFallbackJobs(slug, variant),
  };
}

export type JobExploreFilters = {
  search?: string;
  category?: string;
  location?: string;
  workplace?: string;
  experience?: string;
};

export function filterFallbackJobs(
  jobs: JobListing[],
  filters: JobExploreFilters,
): JobListing[] {
  return jobs.filter((job) => {
    const search = filters.search?.toLowerCase();
    const matchesSearch = search
      ? job.title.toLowerCase().includes(search) ||
        job.description.toLowerCase().includes(search) ||
        job.company?.name?.toLowerCase().includes(search)
      : true;
    const matchesCategory = filters.category
      ? job.taxonomy?.category?.toLowerCase() === filters.category.toLowerCase() ||
        job.taxonomy?.category?.toLowerCase().includes(filters.category.toLowerCase())
      : true;
    const matchesLocation = filters.location
      ? job.location?.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
        job.location?.display?.toLowerCase().includes(filters.location.toLowerCase())
      : true;
    const matchesWorkplace = filters.workplace
      ? String(job.employment?.workplace_id) === filters.workplace ||
        job.employment?.workplace?.toLowerCase() === filters.workplace.toLowerCase()
      : true;
    const matchesExperience = filters.experience
      ? job.employment?.experience_level?.toLowerCase().includes(filters.experience.toLowerCase())
      : true;

    return matchesSearch && matchesCategory && matchesLocation && matchesWorkplace && matchesExperience;
  });
}

export { findCorporateFallbackJob, findStartupFallbackJob, getCorporateRelatedJobs, getStartupRelatedJobs };
