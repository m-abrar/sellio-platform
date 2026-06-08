import { api } from '@sellio/api-client';
import type { ServiceListing } from '@sellio/types';
import {
  LOCAL_FALLBACK_SERVICES,
  MARKETPLACE_FALLBACK_SERVICES,
  findLocalFallbackService,
  findMarketplaceFallbackService,
} from './fallback-data';

export type ServicesThemeVariant = 'marketplace' | 'local';

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

export async function fetchServicesHome(params: Record<string, unknown> = {}) {
  try {
    const response = await api.getServices({ per_page: 8, ...params });
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

export function resolveServicesFailure(allowDemo: boolean, variant: ServicesThemeVariant) {
  if (allowDemo) {
    return {
      mode: 'demo' as const,
      services:
        variant === 'marketplace' ? MARKETPLACE_FALLBACK_SERVICES : LOCAL_FALLBACK_SERVICES,
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

  const service =
    variant === 'marketplace'
      ? findMarketplaceFallbackService(slug)
      : findLocalFallbackService(slug);

  if (!service) {
    return { mode: 'notFound' as const };
  }

  return { mode: 'demo' as const, service };
}
