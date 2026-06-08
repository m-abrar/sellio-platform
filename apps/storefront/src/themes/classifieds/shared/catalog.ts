import { api } from '@sellio/api-client';
import type { ClassifiedListing } from '@sellio/types';
import {
  GENERAL_FALLBACK_CLASSIFIEDS,
  LOCAL_FALLBACK_CLASSIFIEDS,
  findGeneralFallbackListing,
  findLocalFallbackListing,
  getGeneralRelatedListings,
  getLocalRelatedListings,
} from './fallback-data';

export type ClassifiedsThemeVariant = 'local' | 'general';

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

  return 'Classifieds are temporarily unavailable.';
}

export async function fetchClassifiedsHome(params: Record<string, unknown> = {}) {
  try {
    const response = await api.getClassifieds(params);
    return { ok: true as const, response };
  } catch (error) {
    return { ok: false as const, error: toErrorMessage(error) };
  }
}

export async function fetchClassifiedDetail(slug: string) {
  try {
    const response = await api.getClassifiedDetails(slug);
    if (response?.data) {
      return { ok: true as const, response };
    }
    return { ok: false as const, error: 'Listing not found or API returned no data.' };
  } catch (error) {
    return { ok: false as const, error: toErrorMessage(error) };
  }
}

export function resolveClassifiedsFailure(allowDemo: boolean, variant: ClassifiedsThemeVariant) {
  if (allowDemo) {
    return {
      mode: 'demo' as const,
      listings:
        variant === 'local' ? LOCAL_FALLBACK_CLASSIFIEDS : GENERAL_FALLBACK_CLASSIFIEDS,
    };
  }

  return { mode: 'empty' as const };
}

export function resolveClassifiedFailure(
  slug: string,
  allowDemo: boolean,
  variant: ClassifiedsThemeVariant,
) {
  if (!allowDemo) {
    return { mode: 'empty' as const };
  }

  const listing =
    variant === 'local'
      ? findLocalFallbackListing(slug)
      : findGeneralFallbackListing(slug);

  if (!listing) {
    return { mode: 'notFound' as const };
  }

  const related =
    variant === 'local'
      ? getLocalRelatedListings(listing)
      : getGeneralRelatedListings(listing);

  return { mode: 'demo' as const, listing, related };
}

export function getRelatedFromApi(
  listing: ClassifiedListing,
  related: ClassifiedListing[] | undefined,
  slug: string,
  allListings: ClassifiedListing[] | undefined,
): ClassifiedListing[] {
  if (related && related.length > 0) {
    return related.slice(0, 3);
  }

  if (!allListings) {
    return [];
  }

  return allListings
    .filter(
      (item) =>
        item.taxonomy?.category === listing.taxonomy?.category && item.slug !== slug,
    )
    .slice(0, 3);
}
