import type { Property } from '@sellio/types';
import {
  getListingModeLabel,
  getPropertyListingMode,
  type ListingMode,
} from './listing-mode';

const DEMO_FALLBACK_IMAGE = '/demo-assets/properties/item-01.svg';

const STRUCTURE_ICONS = ['🏙️', '🏢', '🏗️', '🏬', '🏛️', '🏘️'];

export type ExplorePropertyCard = {
  title: string;
  slug: string;
  image: string;
  location: string;
  price: string;
  listingMode: ListingMode;
  listingLabel: string;
  beds: string;
  baths: string;
  area: string;
};

export function getPropertyPrice(property: Property) {
  const mode = getPropertyListingMode(property);
  if (mode === 'rental') {
    const nightly = property.pricing?.price_per_night;
    if (nightly) {
      return `$${Number(nightly).toLocaleString()} / night`;
    }
  }

  return (
    property.pricing?.price_formatted ||
    (property.base_price
      ? `$${Number(property.base_price).toLocaleString()}`
      : 'Price on request')
  );
}

export function getPropertyLocation(property: Property) {
  return (
    property.location?.title ||
    [property.city, property.state].filter(Boolean).join(', ') ||
    property.address ||
    'Location TBA'
  );
}

export function getPropertyFallbackImage(index = 0) {
  const slot = (index % 6) + 1;
  return `/demo-assets/properties/item-${String(slot).padStart(2, '0')}.svg`;
}

function extractImageUrl(item: unknown): string | null {
  if (typeof item === 'string' && item.trim()) {
    return item;
  }
  if (!item || typeof item !== 'object') {
    return null;
  }
  const record = item as Record<string, unknown>;
  for (const key of ['hero', 'url', 'original_url', 'thumbnail', 'preview']) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }
  return null;
}

export function collectPropertyImages(property: Property, index = 0): string[] {
  const images: string[] = [];
  const add = (url?: string | null) => {
    if (url && !images.includes(url)) {
      images.push(url);
    }
  };

  if (Array.isArray(property.gallery)) {
    const items = [...property.gallery].sort((a, b) => {
      const left = (a as { order?: number })?.order ?? 0;
      const right = (b as { order?: number })?.order ?? 0;
      return left - right;
    });
    items.forEach((item) => add(extractImageUrl(item)));
  }

  add(property.primary_image_url);
  add(property.featured_image);
  add(property.thumbnail_image);
  add(property.thumbnail_url);

  if (Array.isArray(property.media)) {
    property.media.forEach((item) => add(extractImageUrl(item)));
  }

  const featured = property.featured_image || property.primary_image_url;
  if (featured) {
    const existing = images.indexOf(featured);
    if (existing > 0) {
      images.splice(existing, 1);
      images.unshift(featured);
    } else if (existing === -1) {
      images.unshift(featured);
    }
  }

  if (!images.length) {
    images.push(getPropertyFallbackImage(index));
  }

  return images;
}

export function mapPropertyToExploreCard(
  property: Property,
  index: number,
): ExplorePropertyCard {
  const listingMode = getPropertyListingMode(property);
  const beds = property.specs?.bedrooms ?? property.number_of_bedrooms;
  const baths = property.specs?.bathrooms ?? property.number_of_bathrooms;
  const area =
    property.specs?.area_formatted ||
    (property.area_sq_ft
      ? `${Number(property.area_sq_ft).toLocaleString()} sq ft`
      : '—');

  return {
    title: property.title,
    slug: property.slug,
    image: collectPropertyImages(property, index)[0],
    location: getPropertyLocation(property),
    price: getPropertyPrice(property),
    listingMode,
    listingLabel: getListingModeLabel(listingMode),
    beds: beds ? String(beds) : '—',
    baths: baths ? String(baths) : '—',
    area,
  };
}

export function mapPropertyToStructure(property: Property, index = 0) {
  const area =
    property.specs?.area_formatted ||
    (property.area_sq_ft
      ? `${Number(property.area_sq_ft).toLocaleString()} sqft`
      : 'Area TBA');

  return {
    title: property.title,
    units: String(
      property.specs?.total_units ||
        property.maximum_guests ||
        property.number_of_bedrooms ||
        1,
    ),
    area,
    icon: STRUCTURE_ICONS[index % STRUCTURE_ICONS.length],
    slug: property.slug,
    image: collectPropertyImages(property, index)[0],
    price: getPropertyPrice(property),
    location: getPropertyLocation(property),
  };
}

export function getPropertySpecs(property: Property) {
  return {
    beds: property.specs?.bedrooms ?? property.number_of_bedrooms,
    baths: property.specs?.bathrooms ?? property.number_of_bathrooms,
    area:
      property.specs?.area_formatted ||
      (property.area_sq_ft
        ? `${Number(property.area_sq_ft).toLocaleString()} sqft`
        : null),
    parking: property.specs?.parking_spots ?? property.number_of_parking_spots,
    year: property.specs?.year_built ?? property.year_built,
    category:
      property.specs?.category ||
      property.category?.title ||
      'Property',
  };
}

export { DEMO_FALLBACK_IMAGE };
