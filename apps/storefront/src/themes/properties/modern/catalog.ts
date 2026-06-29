import { api } from '@/lib/api-client';
import type { Property, Category, Location } from '@/types';
import { matchesExplorePriceRange } from './explore-utils';
import { matchesListingFilter, type ListingFilter } from './listing-mode';
import {
  FALLBACK_CATEGORIES,
  FALLBACK_ESTATES,
  FALLBACK_LOCATIONS,
  FALLBACK_CATALOG_ERROR,
} from './fallback-data';

export type CatalogFailureResolution =
  | {
      mode: 'demo';
      estates: Property[];
      categories: Category[];
      locations: Location[];
    }
  | { mode: 'empty' };

export function resolveCatalogFailure(
  filters: PropertyCatalogFilters,
  allowDemo: boolean,
): CatalogFailureResolution {
  if (!allowDemo) {
    return { mode: 'empty' };
  }

  return {
    mode: 'demo',
    estates: filterFallbackEstates(filters),
    categories: FALLBACK_CATEGORIES,
    locations: FALLBACK_LOCATIONS,
  };
}

export interface PropertyCatalogFilters {
  searchQuery?: string;
  selectedCategory?: string | number;
  selectedLocation?: string | number;
  selectedBedrooms?: string;
  selectedPriceRange?: string;
  listingFilter?: ListingFilter;
}

export function buildPropertiesApiParams(
  page: number,
  filters: PropertyCatalogFilters,
  perPage = 9,
): Record<string, string | number> {
  const params: Record<string, string | number> = {
    page,
    per_page: perPage,
  };

  if (filters.searchQuery) params.search = filters.searchQuery;
  if (filters.selectedCategory) params.category_id = filters.selectedCategory;
  if (filters.selectedLocation) params.location = filters.selectedLocation;

  if (filters.listingFilter === 'rental') {
    params.property_type = 'rent';
  } else if (filters.listingFilter === 'sale') {
    params.property_type = 'sale';
  }

  if (filters.selectedPriceRange) {
    const range = filters.selectedPriceRange;
    if (range === 'under-500k') {
      params.max_price = 499999;
    } else if (range === '500k-1m') {
      params.min_price = 500000;
      params.max_price = 1000000;
    } else if (range === '1m-2m') {
      params.min_price = 1000000;
      params.max_price = 2000000;
    } else if (range === '2m-plus') {
      params.min_price = 2000000;
    } else if (range === 'under-200') {
      params.max_price = 199;
    } else if (range === '200-400') {
      params.min_price = 200;
      params.max_price = 400;
    } else if (range === '400-plus') {
      params.min_price = 400;
    }
  }

  return params;
}

export function filterFallbackEstates(filters: PropertyCatalogFilters): Property[] {
  let filtered = [...FALLBACK_ESTATES];

  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    filtered = filtered.filter((estate) => {
      const locationLabel =
        estate.location?.title ||
        [estate.city, estate.state].filter(Boolean).join(', ') ||
        '';
      return (
        estate.title.toLowerCase().includes(q) ||
        estate.description.toLowerCase().includes(q) ||
        locationLabel.toLowerCase().includes(q) ||
        (estate.city?.toLowerCase().includes(q) ?? false)
      );
    });
  }

  if (filters.selectedCategory) {
    filtered = filtered.filter(
      (estate) => estate.category_id === Number(filters.selectedCategory),
    );
  }

  if (filters.selectedLocation) {
    filtered = filtered.filter(
      (estate) =>
        estate.location?.slug === filters.selectedLocation ||
        String(estate.location_id) === String(filters.selectedLocation),
    );
  }

  if (filters.selectedBedrooms) {
    filtered = filtered.filter(
      (estate) =>
        (estate.specs?.bedrooms ?? estate.number_of_bedrooms) >=
        Number(filters.selectedBedrooms),
    );
  }

  if (filters.listingFilter && filters.listingFilter !== 'all') {
    filtered = filtered.filter((estate) =>
      matchesListingFilter(estate, filters.listingFilter!),
    );
  }

  if (filters.selectedPriceRange) {
    filtered = filtered.filter((estate) =>
      matchesExplorePriceRange(
        estate,
        filters.selectedPriceRange!,
        filters.listingFilter ?? 'all',
      ),
    );
  }

  return filtered;
}

export function applyBedroomFilter(
  estates: Property[],
  selectedBedrooms: string,
): Property[] {
  if (!selectedBedrooms) return estates;

  return estates.filter((estate) => {
    const beds = estate.specs?.bedrooms ?? estate.number_of_bedrooms ?? 0;
    return beds >= Number(selectedBedrooms);
  });
}

export function resolveCategoryIdBySlug(
  slug: string,
  categories: Category[],
  allowDemo = false,
): string | number | undefined {
  const fromApi = categories.find((category) => category.slug === slug);
  if (fromApi) return fromApi.id;

  if (!allowDemo) return undefined;

  return FALLBACK_CATEGORIES.find((category) => category.slug === slug)?.id;
}

export type PropertyCatalogFetchResult =
  | {
      ok: true;
      data: Property[];
      categories: Category[];
      locations: Location[];
      currentPage: number;
      lastPage: number;
    }
  | {
      ok: false;
      error: string;
    };

export async function fetchPropertyCatalogPage(
  page: number,
  filters: PropertyCatalogFilters,
  perPage = 9,
): Promise<PropertyCatalogFetchResult> {
  try {
    const response = await api.getProperties(
      buildPropertiesApiParams(page, filters, perPage),
    );

    if (Array.isArray(response?.data)) {
      return {
        ok: true,
        data: response.data,
        categories: response.sidebar?.categories ?? [],
        locations: response.sidebar?.locations ?? [],
        currentPage: response.meta?.current_page ?? page,
        lastPage: response.meta?.last_page ?? 1,
      };
    }

    return { ok: false, error: FALLBACK_CATALOG_ERROR };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
