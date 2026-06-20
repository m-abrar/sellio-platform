import { PUBLIC_API_BASE_URL } from '../config/api';
import { apiRequest } from './apiClient';

export interface LocationOption {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
}

function toOption(loc: any): LocationOption {
  return {
    id: loc.id,
    title: loc.title,
    slug: loc.slug,
    subtitle: [loc.state, loc.country].filter(Boolean).join(', '),
  };
}

// apiRequest auto-unwraps { data: [...] } via normalizeResponse, so payload may be the raw array.
export const searchLocations = async (query: string): Promise<LocationOption[]> => {
  if (!query.trim()) return [];
  const payload = await apiRequest<any>(
    `${PUBLIC_API_BASE_URL}/locations?search=${encodeURIComponent(query)}&is_published=1`,
  );
  const items: any[] = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : []);
  return items.slice(0, 8).map(toOption);
};

// Resolves a stored slug back to a LocationOption (used on profile load to get the display title).
// Returns null if the slug doesn't match any location (callers fall back to raw text display).
export const fetchLocationBySlug = async (slug: string): Promise<LocationOption | null> => {
  if (!slug) return null;
  try {
    const loc = await apiRequest<any>(
      `${PUBLIC_API_BASE_URL}/locations/${encodeURIComponent(slug)}`,
    );
    if (!loc?.slug) return null;
    return toOption(loc);
  } catch {
    return null;
  }
};
