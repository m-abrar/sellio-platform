import { api } from '@/lib/api-client';
import type { Property, Category, Location } from '@/types';
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

  if (filters.selectedPriceRange) {
    params.property_type = 'sale';
    if (filters.selectedPriceRange === '1m-5m') {
      params.min_price = 1000000;
      params.max_price = 5000000;
    } else if (filters.selectedPriceRange === '5m-10m') {
      params.min_price = 5000000;
      params.max_price = 10000000;
    } else if (filters.selectedPriceRange === '10m-plus') {
      params.min_price = 10000000;
    }
  }

  return params;
}

export function filterFallbackEstates(filters: PropertyCatalogFilters): Property[] {
  let filtered = [...FALLBACK_ESTATES];

  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (estate) =>
        estate.title.toLowerCase().includes(q) ||
        estate.description.toLowerCase().includes(q),
    );
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

  if (filters.selectedPriceRange) {
    filtered = filtered.filter((estate) => {
      const value = Number(estate.pricing?.base_price || estate.base_price);
      if (filters.selectedPriceRange === '1m-5m') {
        return value >= 1000000 && value <= 5000000;
      }
      if (filters.selectedPriceRange === '5m-10m') {
        return value >= 5000000 && value <= 10000000;
      }
      if (filters.selectedPriceRange === '10m-plus') {
        return value >= 10000000;
      }
      return true;
    });
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

    if (response?.data?.length) {
      return {
        ok: true,
        data: response.data,
        categories: response.sidebar?.categories ?? [],
        locations: response.sidebar?.locations ?? [],
        currentPage: response.meta?.current_page ?? page,
        lastPage: response.meta?.last_page ?? page,
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
