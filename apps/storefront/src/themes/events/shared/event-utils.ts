import type { EventListing } from '@sellio/types';

const CORPORATE_IMAGE_FALLBACK = '/themes/events/corporate/1.webp';
const CLASSIC_IMAGE_FALLBACK = '/themes/events/classic/1.webp';
const MUSIC_IMAGE_FALLBACK = '/themes/events/music/11.webp';
const CREATIVE_IMAGE_FALLBACK = '/themes/events/creative/1.webp';
const FESTIVAL_IMAGE_FALLBACK = '/themes/events/festival/11.webp';

const months = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];

export function formatEventPrice(event: EventListing): string {
  if (event.ticketing?.is_free) {
    return 'Free';
  }

  if (event.ticketing?.price_formatted) {
    return event.ticketing.price_formatted;
  }

  if (event.ticketing?.base_price) {
    return `$${Number(event.ticketing.base_price).toLocaleString()}`;
  }

  return 'Contact for pricing';
}

export function getCorporateEventImage(event: EventListing): string {
  return event.media?.poster || event.media?.preview || CORPORATE_IMAGE_FALLBACK;
}

export function getClassicEventImage(event: EventListing): string {
  return (
    event.media?.poster ||
    event.media?.preview ||
    event.media?.gallery?.[0]?.url ||
    CLASSIC_IMAGE_FALLBACK
  );
}

export function getMusicEventImage(event: EventListing): string {
  return event.media?.poster || event.media?.preview || MUSIC_IMAGE_FALLBACK;
}

export function getCreativeEventImage(event: EventListing): string {
  return event.media?.poster || event.media?.preview || CREATIVE_IMAGE_FALLBACK;
}

export function getFestivalEventImage(event: EventListing): string {
  return event.media?.poster || event.media?.preview || FESTIVAL_IMAGE_FALLBACK;
}

export function formatEventDateLong(event: EventListing): string {
  if (!event.schedule?.start_at) {
    return 'Date TBA';
  }

  return new Date(event.schedule.start_at).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatEventDateShort(event: EventListing): string {
  if (!event.schedule?.start_at) {
    return 'Date TBA';
  }

  return new Date(event.schedule.start_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatEventDateUnderscore(dateStr?: string | null): string {
  if (!dateStr) {
    return 'Date TBA';
  }

  const date = new Date(dateStr);
  return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')} ${date.getFullYear()}`;
}

export function getEventLocationLabel(event: EventListing): string {
  return (
    event.location?.map_title ||
    [event.location?.city, event.location?.state].filter(Boolean).join(', ') ||
    event.location?.address ||
    'Venue TBA'
  );
}

export function mapEventToOccasion(event: EventListing) {
  return {
    title: event.title,
    location: getEventLocationLabel(event),
    date: formatEventDateUnderscore(event.schedule?.start_at),
    category: event.specs?.category || event.specs?.type || 'Event',
    slug: event.slug,
  };
}

export function getClassicEventPriceLabel(event: EventListing): string {
  return (
    event.ticketing?.price_formatted ||
    (event.ticketing?.is_free ? 'Free admission' : 'Tickets on request')
  );
}
