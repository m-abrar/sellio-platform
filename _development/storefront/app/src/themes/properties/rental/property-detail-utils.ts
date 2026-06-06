import type { PropertyDetail, PropertyBookingBlock } from './property-detail-types';

export function asPropertyDetail(property: unknown): PropertyDetail {
  return property as PropertyDetail;
}

export function normalizeTags(detail: PropertyDetail): string[] {
  const tags = detail.tags;
  if (!Array.isArray(tags)) return [];
  return tags
    .map((tag) => (typeof tag === 'string' ? tag : tag?.title))
    .filter((tag): tag is string => Boolean(tag));
}

export function getCoordinates(property: PropertyDetail): { lat: number; lng: number } | null {
  const lat = Number(property.location?.latitude ?? property.latitude);
  const lng = Number(property.location?.longitude ?? property.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat === 0 && lng === 0) return null;
  return { lat, lng };
}

export function getFullAddress(property: PropertyDetail): string {
  const parts = [
    property.location?.address || property.address,
    property.location?.city || property.city,
    property.location?.state || property.state,
    property.location?.zip_code || property.zip_code,
    property.location?.country || property.country,
  ].filter(Boolean);
  return parts.join(', ');
}

export function isDateWithinBooking(date: Date, bookings: PropertyBookingBlock[]): boolean {
  const day = date.toISOString().slice(0, 10);
  return bookings.some((block) => day >= block.start && day <= block.end);
}

export function getGoogleMapsEmbedUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}&hl=en&z=15&output=embed`;
}

export function getGoogleMapsExternalUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
