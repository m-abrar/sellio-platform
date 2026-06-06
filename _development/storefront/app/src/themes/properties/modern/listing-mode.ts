import type { Property } from '@sellio/types';
import type { PropertyDetail } from './property-detail-types';

export type ListingMode = 'rental' | 'sale';
export type ListingFilter = 'all' | ListingMode;

export function getListingMode(detail: PropertyDetail): ListingMode {
  const status =
    typeof detail.status === 'object' && detail.status !== null ? detail.status : null;

  const isRental =
    Boolean(detail.is_rental) ||
    Boolean(status?.is_rental) ||
    detail.specs?.property_type?.toLowerCase() === 'rent';

  return isRental ? 'rental' : 'sale';
}

export function getListingModeLabel(mode: ListingMode): string {
  return mode === 'rental' ? 'For rent' : 'For sale';
}

export function getPropertyListingMode(property: Property): ListingMode {
  const isRental =
    Boolean(property.is_rental) ||
    property.specs?.property_type?.toLowerCase() === 'rent';

  return isRental ? 'rental' : 'sale';
}

export function matchesListingFilter(
  property: Property,
  filter: ListingFilter,
): boolean {
  if (filter === 'all') return true;
  return getPropertyListingMode(property) === filter;
}
