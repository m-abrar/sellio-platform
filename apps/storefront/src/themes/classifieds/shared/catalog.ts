import { api } from '@/lib/storefront-api';
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
    const status =
      typeof error === 'object' && error !== null && 'response' in error
        ? (error as { response?: { status?: number } }).response?.status
        : undefined;

    if (status === 404) {
      return {
        ok: false as const,
        notFound: true as const,
        error: 'Listing not found.',
      };
    }

    return { ok: false as const, error: toErrorMessage(error) };
  }
}

export async function fetchClassifiedInquiry(inquiryId: number) {
  try {
    if (typeof api.getClassifiedInquiry === 'function') {
      const inquiry = await api.getClassifiedInquiry(inquiryId);
      return { ok: true as const, inquiry };
    }

    return { ok: false as const, error: 'Inquiry lookup is unavailable.' };
  } catch (error) {
    return { ok: false as const, error: toErrorMessage(error) };
  }
}

export type ClassifiedDetailPageResult = {
  mode: 'live' | 'not-found' | 'error';
  listing: ClassifiedListing | null;
  related: ClassifiedListing[];
  alertError: string | null;
};

export async function loadClassifiedDetailPage(slug: string): Promise<ClassifiedDetailPageResult> {
  const result = await fetchClassifiedDetail(slug);

  if (result.ok && result.response.data) {
    let related = getRelatedFromApi(
      result.response.data,
      result.response.related_classifieds,
      slug,
      undefined,
    );

    if (!related.length && result.response.data.taxonomy?.category) {
      const listResult = await fetchClassifiedsHome({ per_page: 24 });
      if (listResult.ok && listResult.response.data) {
        related = getRelatedFromApi(
          result.response.data,
          undefined,
          slug,
          listResult.response.data,
        );
      }
    }

    return {
      mode: 'live',
      listing: result.response.data,
      related,
      alertError: null,
    };
  }

  if ('notFound' in result && result.notFound) {
    return {
      mode: 'not-found',
      listing: null,
      related: [],
      alertError: `No published listing matched "${slug}". Browse listings from the map or explore page.`,
    };
  }

  return {
    mode: 'error',
    listing: null,
    related: [],
    alertError: result.error ?? 'Classifieds are temporarily unavailable.',
  };
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
