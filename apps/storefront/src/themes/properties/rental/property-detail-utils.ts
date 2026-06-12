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

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compare = new Date(date);
  compare.setHours(0, 0, 0, 0);
  return compare < today;
}

export function isDateWithinBooking(date: Date, bookings: PropertyBookingBlock[]): boolean {
  const day = formatLocalDate(date);
  return bookings.some((block) => day >= block.start && day <= block.end);
}

export function isStayRangeBlocked(
  checkIn: string,
  checkOut: string,
  bookings: PropertyBookingBlock[],
): boolean {
  if (!checkIn || !checkOut || checkOut <= checkIn) {
    return false;
  }

  const cursor = parseLocalDate(checkIn);
  const end = parseLocalDate(checkOut);

  while (cursor < end) {
    if (isDateWithinBooking(cursor, bookings)) {
      return true;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return false;
}

export function countNightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut || checkOut <= checkIn) {
    return 0;
  }

  const start = parseLocalDate(checkIn);
  const end = parseLocalDate(checkOut);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function getGoogleMapsEmbedUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}&hl=en&z=15&output=embed`;
}

export function getGoogleMapsExternalUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
