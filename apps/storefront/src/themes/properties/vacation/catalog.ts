import { api } from '@/lib/storefront-api';
import type { Category, Location, Property } from '@sellio/types';
import { isVacationRentalProperty } from './vacation-utils';

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

  return 'Vacation listings are temporarily unavailable.';
}

export type VacationCatalogFilters = {
  searchQuery?: string;
  categoryId?: string | number;
  locationId?: string | number;
  minPrice?: number;
  maxPrice?: number;
  checkIn?: string;
  checkOut?: string;
};

export function buildVacationApiParams(
  page: number,
  filters: VacationCatalogFilters = {},
  perPage = 12,
): Record<string, string | number> {
  const params: Record<string, string | number> = {
    page,
    per_page: perPage,
    property_type: 'rental',
  };

  if (filters.searchQuery) params.search = filters.searchQuery;
  if (filters.categoryId) params.category_id = filters.categoryId;
  if (filters.locationId) params.location = filters.locationId;
  if (filters.minPrice != null) params.min_price = filters.minPrice;
  if (filters.maxPrice != null) params.max_price = filters.maxPrice;
  if (filters.checkIn) params.check_in = filters.checkIn;
  if (filters.checkOut) params.check_out = filters.checkOut;

  return params;
}

export type VacationCatalogFetchResult =
  | {
      ok: true;
      data: Property[];
      categories: Category[];
      locations: Location[];
      currentPage: number;
      lastPage: number;
      total: number;
    }
  | { ok: false; error: string };

export async function fetchVacationCatalogPage(
  page: number,
  filters: VacationCatalogFilters = {},
  perPage = 12,
): Promise<VacationCatalogFetchResult> {
  try {
    const response = await api.getProperties(buildVacationApiParams(page, filters, perPage));

    if (!Array.isArray(response?.data)) {
      return { ok: false, error: 'No vacation listings returned from API.' };
    }

    return {
      ok: true,
      data: response.data.filter(isVacationRentalProperty),
      categories: response.sidebar?.categories ?? [],
      locations: response.sidebar?.locations ?? [],
      currentPage: response.meta?.current_page ?? page,
      lastPage: response.meta?.last_page ?? 1,
      total: response.meta?.total ?? response.data.length,
    };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export type VacationDetailPageResult = {
  mode: 'live' | 'not-found' | 'error';
  property: Property | null;
  related: Property[];
  alertError: string | null;
};

export async function loadVacationDetailPage(slug: string): Promise<VacationDetailPageResult> {
  try {
    const response = await api.getPropertyDetails(slug);

    if (response?.success && response.data) {
      const related = (response.related_properties ?? [])
        .filter(isVacationRentalProperty)
        .filter((item) => item.slug !== slug)
        .slice(0, 3);

      return {
        mode: 'live',
        property: response.data,
        related,
        alertError: null,
      };
    }

    return {
      mode: 'not-found',
      property: null,
      related: [],
      alertError: `No published retreat matched "${slug}". Browse listings from the homepage grid.`,
    };
  } catch (error) {
    const status =
      typeof error === 'object' && error !== null && 'response' in error
        ? (error as { response?: { status?: number } }).response?.status
        : undefined;

    if (status === 404) {
      return {
        mode: 'not-found',
        property: null,
        related: [],
        alertError: `No published retreat matched "${slug}". Browse listings from the homepage grid.`,
      };
    }

    return {
      mode: 'error',
      property: null,
      related: [],
      alertError: toErrorMessage(error),
    };
  }
}
