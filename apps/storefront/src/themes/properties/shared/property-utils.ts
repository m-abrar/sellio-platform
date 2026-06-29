import type { Property } from '@/types';

export function getPropertyPrice(property: Property): string {
  return (
    property.pricing?.price_formatted ||
    (property.base_price
      ? `$${Number(property.base_price).toLocaleString()}`
      : 'Price on request')
  );
}

export function getPropertyLocation(property: Property): string {
  return (
    property.location?.title ||
    [property.city, property.state].filter(Boolean).join(', ') ||
    property.address ||
    'Location TBA'
  );
}

export function getPropertyImage(property: Property, fallback = '/themes/properties/modern/1.webp'): string {
  return property.featured_image || property.thumbnail_image || fallback;
}

export function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
}
