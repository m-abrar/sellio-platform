import { api } from '@/lib/api-client';
import type { Vehicle } from '@/types';
import {
  findFallbackVehicle,
  findLuxuryFallbackVehicle,
  findModernFallbackVehicle,
  getFallbackVehicles,
} from './fallback-data';

export type AutosThemeVariant = 'modern' | 'luxury' | 'classic' | 'used' | 'electric';

function getApiError(error: unknown): {
  message: string;
  status?: number;
  notFound: boolean;
} {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as {
      response?: { status?: number; data?: { message?: string } };
    }).response;
    const status = response?.status;

    return {
      message:
        response?.data?.message ??
        (status ? `Request failed with status code ${status}` : 'Vehicles are temporarily unavailable.'),
      status,
      notFound: status === 404,
    };
  }

  if (error instanceof Error) {
    return { message: error.message, notFound: false };
  }

  return { message: 'Vehicles are temporarily unavailable.', notFound: false };
}

function toErrorMessage(error: unknown): string {
  return getApiError(error).message;
}

export async function fetchVehiclesHome(perPage = 6) {
  try {
    const response = await api.getVehicles({ per_page: perPage });
    return { ok: true as const, response };
  } catch (error) {
    return { ok: false as const, error: toErrorMessage(error) };
  }
}

export async function fetchVehiclesExplore(queryParams: Record<string, unknown>) {
  try {
    const response = await api.getVehicles(queryParams);
    return { ok: true as const, response };
  } catch (error) {
    return { ok: false as const, error: toErrorMessage(error) };
  }
}

export async function fetchVehicleDetail(slug: string) {
  try {
    const response = await api.getVehicleDetails(slug);
    if (response?.success && response.data) {
      return { ok: true as const, response };
    }
    return {
      ok: false as const,
      error: 'Vehicle not found or API returned no data.',
      notFound: true,
    };
  } catch (error) {
    const apiError = getApiError(error);
    return {
      ok: false as const,
      error: apiError.message,
      notFound: apiError.notFound,
      status: apiError.status,
    };
  }
}

export type VehicleDetailPageResult =
  | {
      mode: 'live';
      vehicle: Vehicle;
      related: Vehicle[];
      useFallback: false;
      alertError: null;
      previewSample: false;
    }
  | {
      mode: 'preview-sample';
      vehicle: Vehicle;
      related: Vehicle[];
      useFallback: true;
      alertError: null;
      previewSample: true;
    }
  | {
      mode: 'demo-fallback';
      vehicle: Vehicle;
      related: Vehicle[];
      useFallback: true;
      alertError: string;
      previewSample: false;
    }
  | {
      mode: 'not-found';
      vehicle: null;
      related: Vehicle[];
      useFallback: false;
      alertError: string;
      previewSample: false;
    }
  | {
      mode: 'empty';
      vehicle: null;
      related: Vehicle[];
      useFallback: false;
      alertError: string;
      previewSample: false;
    };

/** Loads a vehicle detail page with clear live vs preview-sample vs API-failure handling. */
export async function loadVehicleDetailPage(
  slug: string,
  variant: AutosThemeVariant,
  allowDemo: boolean,
): Promise<VehicleDetailPageResult> {
  const result = await fetchVehicleDetail(slug);

  if (result.ok) {
    return {
      mode: 'live',
      vehicle: result.response.data,
      related: result.response.related_vehicles ?? [],
      useFallback: false,
      alertError: null,
      previewSample: false,
    };
  }

  if (result.notFound) {
    const sample = allowDemo ? findFallbackVehicle(slug, variant) : null;

    if (sample) {
      return {
        mode: 'preview-sample',
        vehicle: sample,
        related: getFallbackVehicles(variant)
          .filter((item) => item.slug !== slug)
          .slice(0, 3),
        useFallback: true,
        alertError: null,
        previewSample: true,
      };
    }

    return {
      mode: 'not-found',
      vehicle: null,
      related: [],
      useFallback: false,
      alertError: `No published vehicle matched "${slug}". Open a listing from Explore or the homepage.`,
      previewSample: false,
    };
  }

  if (allowDemo) {
    const resolution = resolveVehicleFailure(slug, allowDemo, variant);

    if (resolution.mode === 'demo') {
      return {
        mode: 'demo-fallback',
        vehicle: resolution.vehicle,
        related: resolution.related,
        useFallback: true,
        alertError: result.error,
        previewSample: false,
      };
    }
  }

  return {
    mode: 'empty',
    vehicle: null,
    related: [],
    useFallback: false,
    alertError: result.error,
    previewSample: false,
  };
}

export function resolveVehiclesFailure(allowDemo: boolean, variant: AutosThemeVariant) {
  if (allowDemo) {
    return {
      mode: 'demo' as const,
      vehicles: getFallbackVehicles(variant),
    };
  }

  return { mode: 'empty' as const };
}

export function resolveVehicleFailure(
  slug: string,
  allowDemo: boolean,
  variant: AutosThemeVariant,
) {
  if (!allowDemo) {
    return { mode: 'empty' as const };
  }

  const vehicle = findFallbackVehicle(slug, variant);

  if (vehicle) {
    return {
      mode: 'demo' as const,
      vehicle,
      related: getFallbackVehicles(variant).filter((item) => item.slug !== slug).slice(0, 3),
    };
  }

  return { mode: 'empty' as const };
}

export function getFallbackRelatedVehicles(
  slug: string,
  variant: AutosThemeVariant,
): Vehicle[] {
  return getFallbackVehicles(variant).filter((vehicle) => vehicle.slug !== slug).slice(0, 3);
}

export { findLuxuryFallbackVehicle, findModernFallbackVehicle };
