import type { Vehicle } from '@/types';

const MODERN_IMAGE_FALLBACK = '/themes/autos/modern/11.webp';
const LUXURY_IMAGE_FALLBACK = '/themes/autos/luxury/mercedes.png';

export function formatVehiclePrice(vehicle: Vehicle): string {
  if (vehicle.pricing?.formatted) {
    return vehicle.pricing.formatted;
  }

  if (vehicle.pricing?.base_price) {
    return `$${Number(vehicle.pricing.base_price).toLocaleString()}`;
  }

  return 'Contact for pricing';
}

export function getVehicleImage(
  vehicle: Vehicle,
  fallback = MODERN_IMAGE_FALLBACK,
): string {
  return vehicle.media?.main_photo || vehicle.featured_image || fallback;
}

export function getLuxuryVehicleImage(vehicle: Vehicle): string {
  return getVehicleImage(vehicle, LUXURY_IMAGE_FALLBACK);
}

export function getVehicleSpecLabel(vehicle: Vehicle): string {
  const year = vehicle.specs?.year || '2025';
  const engine = vehicle.specs?.engine || 'Electric';
  const transmission = vehicle.specs?.transmission || 'Automatic';
  return `${year} | ${engine} | ${transmission}`;
}

export function getConditionLabel(conditionRating: number | null | undefined): string {
  if (conditionRating == null) return 'Available';
  if (conditionRating >= 9) return 'Excellent';
  if (conditionRating >= 7) return 'Very Good';
  if (conditionRating >= 5) return 'Good';
  if (conditionRating >= 3) return 'Fair';
  return 'As-Is';
}

export function getLuxuryVehicleSpecLabel(vehicle: Vehicle): string {
  const parts = [
    vehicle.specs?.year,
    vehicle.specs?.engine,
    vehicle.specs?.transmission,
    vehicle.specs?.mileage,
  ].filter(Boolean);

  return parts.join(' | ') || getVehicleSpecLabel(vehicle);
}
