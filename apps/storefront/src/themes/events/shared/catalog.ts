import { api } from '@sellio/api-client';
import type { EventListing } from '@sellio/types';
import {
  findClassicFallbackEvent,
  findCorporateFallbackEvent,
  findFallbackEvent,
  getClassicRelatedEvents,
  getCorporateRelatedEvents,
  getFallbackEvents,
  getRelatedFallbackEvents,
} from './fallback-data';

export type EventsThemeVariant = 'corporate' | 'classic' | 'music' | 'creative' | 'festival';

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

  return 'Events are temporarily unavailable.';
}

export async function fetchEventsHome(perPage = 20) {
  try {
    const response = await api.getEvents({ per_page: perPage });
    return { ok: true as const, response };
  } catch (error) {
    return { ok: false as const, error: toErrorMessage(error) };
  }
}

export async function fetchEventsExplore(queryParams: Record<string, unknown>) {
  try {
    const response = await api.getEvents(queryParams);
    return { ok: true as const, response };
  } catch (error) {
    return { ok: false as const, error: toErrorMessage(error) };
  }
}

export async function fetchEventDetail(slug: string) {
  try {
    const response = await api.getEventDetails(slug);
    if (response?.success && response.data) {
      return { ok: true as const, response };
    }
    return { ok: false as const, error: 'Event not found or API returned no data.' };
  } catch (error) {
    return { ok: false as const, error: toErrorMessage(error) };
  }
}

export function resolveEventsFailure(allowDemo: boolean, variant: EventsThemeVariant) {
  if (allowDemo) {
    return {
      mode: 'demo' as const,
      events: getFallbackEvents(variant),
    };
  }

  return { mode: 'empty' as const };
}

export function resolveEventFailure(
  slug: string,
  allowDemo: boolean,
  variant: EventsThemeVariant,
) {
  if (!allowDemo) {
    return { mode: 'empty' as const };
  }

  const event = findFallbackEvent(slug, variant);

  if (!event) {
    return { mode: 'notFound' as const };
  }

  return {
    mode: 'demo' as const,
    event,
    related: getRelatedFallbackEvents(slug, variant),
  };
}

export function extractEventFilters(data: EventListing[]) {
  const categories = new Set<string>();
  const locations = new Set<string>();
  const genres = new Set<string>();

  data.forEach((item) => {
    if (item.specs?.category) categories.add(item.specs.category);
    if (item.location?.city) locations.add(item.location.city);
    if (item.specs?.event_genre) genres.add(item.specs.event_genre);
  });

  return {
    categories: Array.from(categories),
    locations: Array.from(locations),
    genres: Array.from(genres),
  };
}

export type EventExploreFilters = {
  search?: string;
  category?: string;
  location?: string;
  genre?: string;
};

export function filterFallbackEvents(
  events: EventListing[],
  filters: EventExploreFilters,
): EventListing[] {
  return events.filter((event) => {
    const search = filters.search?.toLowerCase();
    const matchesSearch = search
      ? event.title.toLowerCase().includes(search) ||
        event.description.toLowerCase().includes(search)
      : true;
    const matchesCategory = filters.category
      ? event.specs?.category === filters.category
      : true;
    const matchesLocation = filters.location
      ? event.location?.city === filters.location
      : true;
    const matchesGenre = filters.genre ? event.specs?.event_genre === filters.genre : true;

    return matchesSearch && matchesCategory && matchesLocation && matchesGenre;
  });
}

export { findClassicFallbackEvent, findCorporateFallbackEvent, getClassicRelatedEvents, getCorporateRelatedEvents };
