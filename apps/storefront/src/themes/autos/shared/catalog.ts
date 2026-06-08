import { api } from '@sellio/api-client';
import type { Vehicle } from '@sellio/types';
import {
  findFallbackVehicle,
  findLuxuryFallbackVehicle,
  findModernFallbackVehicle,
  getFallbackVehicles,
} from './fallback-data';

export type AutosThemeVariant = 'modern' | 'luxury' | 'classic' | 'used' | 'electric';

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

  return 'Vehicles are temporarily unavailable.';
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
    return { ok: false as const, error: 'Vehicle not found or API returned no data.' };
  } catch (error) {
    return { ok: false as const, error: toErrorMessage(error) };
  }
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
