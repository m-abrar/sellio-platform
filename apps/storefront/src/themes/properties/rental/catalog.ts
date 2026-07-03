import { api } from '@/lib/api-client';
import type { Property, Category, Location } from '@/types';
import { matchesExplorePriceRange } from './explore-utils';
import { isRentalProperty } from './property-utils';
import {
  FALLBACK_CATEGORIES,
  FALLBACK_RENTALS,
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

export interface PropertyCatalogFilters {
  searchQuery?: string;
  selectedCategory?: string | number;
  selectedLocation?: string | number;
  selectedBedrooms?: string;
  selectedPriceRange?: string;
}

export function resolveCatalogFailure(
  filters: PropertyCatalogFilters,
  allowDemo: boolean,
): CatalogFailureResolution {
  if (!allowDemo) {
    return { mode: 'empty' };
  }

  return {
    mode: 'demo',
    estates: filterFallbackRentals(filters),
    categories: FALLBACK_CATEGORIES,
    locations: FALLBACK_LOCATIONS,
  };
}

export function buildPropertiesApiParams(
  page: number,
  filters: PropertyCatalogFilters,
  perPage = 9,
): Record<string, string | number> {
  const params: Record<string, string | number> = {
    page,
    per_page: perPage,
    // Backend only recognizes the exact strings 'rental' / 'sale' (PropertyService::applyFilters).
    property_type: 'rental',
  };

  // Param keys below must match PropertyService::applyFilters' raw $request->all() keys exactly
  // ('q', 'category', 'location') — anything else is silently ignored by the backend.
  if (filters.searchQuery) params.q = filters.searchQuery;
  if (filters.selectedCategory) params.category = filters.selectedCategory;
  if (filters.selectedLocation) params.location = filters.selectedLocation;

  if (filters.selectedPriceRange) {
    const range = filters.selectedPriceRange;
    if (range === 'under-1500') {
      params.max_price = 1499;
    } else if (range === '1500-2500') {
      params.min_price = 1500;
      params.max_price = 2500;
    } else if (range === '2500-4000') {
      params.min_price = 2500;
      params.max_price = 4000;
    } else if (range === '4000-plus') {
      params.min_price = 4000;
    }
  }

  return params;
}

export function filterFallbackRentals(filters: PropertyCatalogFilters): Property[] {
  let filtered = [...FALLBACK_RENTALS];

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

  if (filters.selectedPriceRange) {
    filtered = filtered.filter((estate) =>
      matchesExplorePriceRange(estate, filters.selectedPriceRange!),
    );
  }

  return filtered;
}

export function filterRentalProperties(properties: Property[]): Property[] {
  return properties.filter(isRentalProperty);
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
        categories: response.sidebar?.categories ?? FALLBACK_CATEGORIES,
        locations: response.sidebar?.locations ?? FALLBACK_LOCATIONS,
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
