export interface NormalizedEvent {
  id: number;
  title: string;
  slug: string;
  description?: string;
  price?: string;
  sku?: string;
  location?: string;
  is_active: boolean;
  featured_image?: string | null;
  gallery: Array<{ id: number; url: string; thumbnail?: string }>;
  media: Array<{ original_url: string }>;
  category_id?: number;
  base_price?: number | string | null;
  date?: string;
  time?: string;
  venue?: string;
  capacity?: number | string | null;
  organizer?: string;
  is_published?: boolean;
  is_virtual?: boolean;
  virtual_link?: string;
  organizer_email?: string;
  organizer_phone?: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  event_genre?: string | null;
  venue_size?: number | string | null;
  brand_id?: number;
  type_id?: number;
  location_id?: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  ticket_types?: Array<{ id: number | string; title: string; base_price: number }>;
  occurrences?: Array<{
    id: number | string;
    start_date_time: string;
    duration_hours: number;
    max_attendees: number;
    venue_details?: string;
  }>;
  schedule?: Record<string, unknown>;
  ticketing?: Record<string, unknown>;
  status?: Record<string, unknown>;
}

const buildLocationLabel = (event: any): string => {
  const location = event.location ?? {};
  const parts = [location.city, location.state, location.country].filter(Boolean);

  if (parts.length) {
    return parts.join(', ');
  }

  const firstOccurrence = event.occurrences?.[0];
  if (firstOccurrence?.venue_details) {
    return firstOccurrence.venue_details;
  }

  return location.address || 'N/A';
};

const parseScheduleParts = (event: any): { date: string; time: string } => {
  const occurrence = event.occurrences?.[0];
  const startAt = occurrence?.start_date_time ?? event.schedule?.start_at;

  if (!startAt) {
    return { date: '', time: '' };
  }

  const parsed = new Date(startAt);
  if (Number.isNaN(parsed.getTime())) {
    return { date: '', time: '' };
  }

  const date = parsed.toISOString().slice(0, 10);
  const time = parsed.toTimeString().slice(0, 5);

  return { date, time };
};

export const normalizeEvent = (event: any): NormalizedEvent => {
  const gallery = Array.isArray(event.media?.gallery)
    ? event.media.gallery.map((item: any) => ({
        id: item.id,
        url: item.url,
        thumbnail: item.thumbnail ?? item.url,
      }))
    : [];

  const featuredImage = event.media?.poster ?? event.media?.preview ?? null;
  const media = [
    ...(featuredImage ? [{ original_url: featuredImage }] : []),
    ...gallery
      .filter((item) => item.url !== featuredImage)
      .map((item) => ({ original_url: item.url })),
  ];

  const { date, time } = parseScheduleParts(event);
  const firstOccurrence = event.occurrences?.[0];

  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    price:
      event.ticketing?.price_formatted ??
      event.ticketing?.price_formatted_k ??
      (event.ticketing?.base_price != null ? `$${Number(event.ticketing.base_price).toFixed(2)}` : undefined),
    sku: `EVT-${event.id}`,
    location: buildLocationLabel(event),
    is_active: event.status?.is_published ?? false,
    featured_image: featuredImage,
    gallery,
    media: media.length ? media : [{ original_url: 'https://via.placeholder.com/400x300?text=Event' }],
    category_id: event.category_id,
    base_price: event.ticketing?.base_price,
    date,
    time,
    venue: firstOccurrence?.venue_details ?? '',
    capacity: firstOccurrence?.max_attendees ?? event.ticketing?.max_attendees ?? null,
    organizer: event.organizer_name ?? event.organizer?.name ?? '',
    organizer_email: event.organizer_email ?? '',
    organizer_phone: event.organizer_phone ?? '',
    is_published: event.status?.is_published ?? false,
    is_virtual: event.schedule?.is_virtual ?? false,
    virtual_link: event.schedule?.virtual_link ?? '',
    latitude: event.location?.latitude,
    longitude: event.location?.longitude,
    event_genre: event.specs?.event_genre ?? '',
    venue_size: event.specs?.venue_size ?? '',
    brand_id: event.specs?.brand_id,
    type_id: event.specs?.type_id,
    location_id: event.location_id,
    address: event.location?.address ?? '',
    city: event.location?.city ?? '',
    state: event.location?.state ?? '',
    country: event.location?.country ?? '',
    zip_code: event.location?.zip_code ?? '',
    ticket_types: event.ticket_types ?? [],
    occurrences: event.occurrences ?? [],
    schedule: event.schedule ?? {},
    ticketing: event.ticketing ?? {},
    status: event.status ?? {},
  };
};
