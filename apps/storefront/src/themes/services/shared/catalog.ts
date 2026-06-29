import { api } from '@/lib/api-client';
import type { ServiceConsultationRecord, ServiceListing } from '@/types';
import {
  findFallbackService,
  findLocalFallbackService,
  findMarketplaceFallbackService,
  getFallbackServices,
} from './fallback-data';

export type ServicesThemeVariant = 'marketplace' | 'local' | 'corporate' | 'creative' | 'health';

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

  return 'Services are temporarily unavailable.';
}

export function normalizeServiceQueryParams(params: Record<string, unknown> = {}) {
  const normalized: Record<string, unknown> = { ...params };

  if (normalized.search === undefined && normalized.q) {
    normalized.search = normalized.q;
    delete normalized.q;
  }

  return normalized;
}

export async function fetchServicesHome(params: Record<string, unknown> = {}) {
  try {
    const response = await api.getServices({
      per_page: 8,
      ...normalizeServiceQueryParams(params),
    });
    return { ok: true as const, response };
  } catch (error) {
    return { ok: false as const, error: toErrorMessage(error) };
  }
}

export async function fetchServicesExplore(params: Record<string, unknown> = {}) {
  try {
    const response = await api.getServices({
      per_page: 12,
      ...normalizeServiceQueryParams(params),
    });
    return { ok: true as const, response };
  } catch (error) {
    return { ok: false as const, error: toErrorMessage(error) };
  }
}

export async function fetchServiceDetail(slug: string) {
  try {
    const service = await api.getServiceBySlug(slug);
    if (service) {
      return { ok: true as const, service };
    }
    return { ok: false as const, error: 'Service not found or API returned no data.' };
  } catch (error) {
    return { ok: false as const, error: toErrorMessage(error) };
  }
}

function resolveApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    let host = window.location.hostname;
    if (host === 'localhost') {
      host = '127.0.0.1';
    }
    return `http://${host}:8000/api`;
  }

  return 'http://127.0.0.1:8000/api';
}

export async function fetchServiceConsultation(
  consultationId: number,
): Promise<{ ok: true; consultation: ServiceConsultationRecord } | { ok: false; error: string }> {
  try {
    if (typeof api.getServiceConsultation === 'function') {
      const consultation = await api.getServiceConsultation(consultationId);
      return { ok: true, consultation };
    }

    const response = await fetch(`${resolveApiBaseUrl()}/v1/services/consultations/${consultationId}`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return { ok: false, error: 'Unable to load booking details.' };
    }

    const payload = (await response.json()) as { data?: ServiceConsultationRecord };
    if (!payload.data) {
      return { ok: false, error: 'Consultation not found.' };
    }

    return { ok: true, consultation: payload.data };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export function resolveServicesFailure(allowDemo: boolean, variant: ServicesThemeVariant) {
  if (allowDemo) {
    return {
      mode: 'demo' as const,
      services: getFallbackServices(variant),
    };
  }

  return { mode: 'empty' as const };
}

export function resolveServiceFailure(
  slug: string,
  allowDemo: boolean,
  variant: ServicesThemeVariant,
) {
  if (!allowDemo) {
    return { mode: 'empty' as const };
  }

  const service = findFallbackService(slug, variant);

  if (!service) {
    return { mode: 'notFound' as const };
  }

  return { mode: 'demo' as const, service };
}

export { findLocalFallbackService, findMarketplaceFallbackService };
