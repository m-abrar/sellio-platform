import { api } from '@sellio/api-client';
import type { ClassifiedListing } from '@sellio/types';
import { classifiedCategoriesMatch } from '@/lib/classified-category';
import {
  findFallbackListing,
  getFallbackClassifieds,
  getFallbackRelatedListings,
  type ClassifiedsFallbackVariant,
} from './fallback-data';

export type ClassifiedsThemeVariant = ClassifiedsFallbackVariant;

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

export function normalizeClassifiedQueryParams(params: Record<string, unknown> = {}) {
  const normalized: Record<string, unknown> = { ...params };

  if (normalized.search === undefined && normalized.q) {
    normalized.search = normalized.q;
    delete normalized.q;
  }

  return normalized;
}

export async function fetchClassifiedsHome(params: Record<string, unknown> = {}) {
  try {
    const response = await api.getClassifieds(normalizeClassifiedQueryParams(params));
    return { ok: true as const, response };
  } catch (error) {
    return { ok: false as const, error: toErrorMessage(error) };
  }
}

export async function fetchClassifiedsExplore(params: Record<string, unknown> = {}) {
  try {
    const response = await api.getClassifieds({
      per_page: 12,
      ...normalizeClassifiedQueryParams(params),
    });
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
      listings: getFallbackClassifieds(variant),
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

  const listing = findFallbackListing(slug, variant);

  if (!listing) {
    return { mode: 'notFound' as const };
  }

  return {
    mode: 'demo' as const,
    listing,
    related: getFallbackRelatedListings(listing, variant),
  };
}

export function getRelatedFromApi(
  listing: ClassifiedListing,
  related: ClassifiedListing[] | undefined,
  slug: string,
  allListings: ClassifiedListing[] | undefined,
): ClassifiedListing[] {
  if (related && related.length > 0) {
    return related.slice(0, 4);
  }

  if (!allListings) {
    return [];
  }

  return allListings
    .filter(
      (item) =>
        classifiedCategoriesMatch(item.taxonomy?.category, listing.taxonomy?.category) &&
        item.slug !== slug,
    )
    .slice(0, 4);
}
