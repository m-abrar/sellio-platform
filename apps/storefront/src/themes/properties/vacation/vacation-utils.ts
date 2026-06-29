import type { Property } from '@/types';
import {
  getPropertyImage,
  getPropertyLocation,
  getPropertyPrice,
} from '@/themes/properties/shared/property-utils';

const VACATION_IMAGE_PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='720' height='900' viewBox='0 0 720 900'><rect width='100%' height='100%' fill='%23f0f7ff'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Inter,sans-serif' font-size='14' font-weight='700' fill='%2364748b'>RETREAT PHOTO</text></svg>";

export type VacationRetreatCard = {
  id: number;
  title: string;
  location: string;
  price: string;
  numericPrice: number;
  rating: string;
  image: string;
  slug: string;
  category: string;
  sqft: string;
  guests: string;
  bedrooms: string;
  bathrooms: string;
  yearBuilt: number;
  vibeScore: string;
  description: string;
};

type PropertyWithScores = Property & {
  scores?: { score: number; title?: string }[];
  security?: string;
};

export function getNightlyPrice(property: Property): number {
  const nightly = Number(property.pricing?.price_per_night ?? property.price_per_night ?? 0);
  if (nightly > 0) {
    return nightly;
  }

  const base = Number(property.pricing?.base_price ?? property.base_price ?? 0);
  if (base > 0 && base < 50000) {
    return base;
  }

  return 0;
}

export function formatNightlyPrice(property: Property): string {
  const nightly = getNightlyPrice(property);
  if (property.pricing?.price_formatted && nightly > 0) {
    return property.pricing.price_formatted;
  }

  if (nightly > 0) {
    return `$${nightly.toLocaleString()}`;
  }

  return getPropertyPrice(property);
}

export function getPropertyRatingLabel(property: Property): string {
  if (typeof property.rating === 'number' && property.rating > 0) {
    return property.rating.toFixed(2);
  }

  return 'New';
}

export function getVacationCategory(property: Property): string {
  if (property.category?.title) {
    return property.category.title;
  }

  if (property.specs?.category) {
    return property.specs.category;
  }

  return 'Retreat';
}

export function getVacationVibeScore(property: Property): string {
  const scores = (property as PropertyWithScores).scores;

  if (scores?.length) {
    const average = scores.reduce((sum, item) => sum + item.score, 0) / scores.length;
    return `${Math.round(average)}/100`;
  }

  if (typeof property.rating === 'number' && property.rating > 0) {
    return `${Math.min(100, Math.round(property.rating * 20))}/100`;
  }

  return '—';
}

export function mapPropertyToVacationCard(property: Property, index = 0): VacationRetreatCard {
  const beds = property.specs?.bedrooms ?? property.number_of_bedrooms ?? 1;
  const baths = property.specs?.bathrooms ?? property.number_of_bathrooms ?? 1;
  const guests = property.specs?.max_guests ?? property.maximum_guests ?? beds * 2;
  const sqft =
    property.specs?.area_formatted ||
    (property.area_sq_ft ? `${Number(property.area_sq_ft).toLocaleString()} sq ft` : '—');

  return {
    id: property.id,
    title: property.title,
    location: getPropertyLocation(property),
    price: formatNightlyPrice(property),
    numericPrice: getNightlyPrice(property),
    rating: getPropertyRatingLabel(property),
    image: getPropertyImage(property, VACATION_IMAGE_PLACEHOLDER),
    slug: property.slug,
    category: getVacationCategory(property),
    sqft: String(sqft),
    guests: `${guests} Guest${guests === 1 ? '' : 's'}`,
    bedrooms: `${beds} Bedroom${beds === 1 ? '' : 's'}`,
    bathrooms: `${baths} Bathroom${baths === 1 ? '' : 's'}`,
    yearBuilt: property.specs?.year_built ?? property.year_built ?? 0,
    vibeScore: getVacationVibeScore(property),
    description:
      property.description ||
      property.short_description ||
      'Authentically vetted vacation retreat with verified amenities, local hosting, and flexible check-in.',
  };
}

export function isVacationRentalProperty(property: Property): boolean {
  const status =
    typeof property.status === 'object' && property.status !== null
      ? (property.status as { is_rental?: boolean })
      : null;

  return Boolean(property.is_rental || status?.is_rental || getNightlyPrice(property) > 0);
}

export function buildVacationCategories(properties: VacationRetreatCard[]): string[] {
  return Array.from(new Set(properties.map((item) => item.category).filter(Boolean)));
}

export function matchesVacationPriceRange(numericPrice: number, priceRange: string): boolean {
  if (!priceRange) return true;
  if (priceRange === 'under-500') return numericPrice < 500;
  if (priceRange === '500-1000') return numericPrice >= 500 && numericPrice <= 1000;
  if (priceRange === '1000-plus') return numericPrice >= 1000;
  return true;
}
