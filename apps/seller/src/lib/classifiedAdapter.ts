export interface NormalizedClassified {
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
  type_id?: number;
  location_id?: number;
  base_price?: number | string | null;
  condition?: string;
  condition_rating?: number;
  is_published?: boolean;
  pricing?: Record<string, unknown>;
  item_specs?: Record<string, unknown>;
  status?: Record<string, unknown>;
}

const conditionMap: Record<string, number> = {
  New: 10,
  'Used - Like New': 9,
  'Used - Excellent': 8,
  'Used - Good': 6,
  'Used - Fair': 4,
  Refurbished: 7,
};

export const mapConditionToRating = (condition: string): number => conditionMap[condition] ?? 6;

export const mapRatingToCondition = (rating?: number | null): string => {
  if (!rating) return 'Used - Good';
  if (rating >= 10) return 'New';
  if (rating >= 9) return 'Used - Like New';
  if (rating >= 8) return 'Used - Excellent';
  if (rating >= 6) return 'Used - Good';
  return 'Used - Fair';
};

const buildLocationLabel = (classified: any): string => {
  const location = classified.location ?? {};
  const parts = [location.city, location.state, location.country].filter(Boolean);
  return parts.length ? parts.join(', ') : 'N/A';
};

export const normalizeClassified = (classified: any): NormalizedClassified => {
  const gallery = Array.isArray(classified.media?.gallery)
    ? classified.media.gallery.map((item: any) => ({
        id: item.id,
        url: item.url,
        thumbnail: item.thumb ?? item.url,
      }))
    : [];

  const featuredImage = classified.media?.main_photo ?? null;
  const media = [
    ...(featuredImage ? [{ original_url: featuredImage }] : []),
    ...gallery.map((item) => ({ original_url: item.url })),
  ];

  const conditionRating = classified.item_specs?.condition_rating ?? null;

  return {
    id: classified.id,
    title: classified.title,
    slug: classified.slug,
    description: classified.description,
    price: classified.pricing?.formatted ?? classified.pricing?.formatted_short ?? undefined,
    sku: `AD-${classified.id}`,
    location: buildLocationLabel(classified),
    is_active: classified.status?.is_published ?? false,
    featured_image: featuredImage,
    gallery,
    media: media.length ? media : [{ original_url: 'https://via.placeholder.com/400x300?text=Listing' }],
    category_id: classified.category_id,
    type_id: classified.type_id,
    location_id: classified.location_id,
    base_price: classified.pricing?.base_price,
    condition: mapRatingToCondition(conditionRating),
    condition_rating: conditionRating ?? undefined,
    is_published: classified.status?.is_published ?? false,
    pricing: classified.pricing ?? {},
    item_specs: classified.item_specs ?? {},
    status: classified.status ?? {},
  };
};

export const parseLocationParts = (location: string): { city: string; country: string } => {
  const parts = location.split(',').map((part) => part.trim()).filter(Boolean);

  if (parts.length === 0) {
    return { city: 'Remote', country: 'Global' };
  }

  if (parts.length === 1) {
    return { city: parts[0], country: 'Global' };
  }

  return {
    city: parts[0],
    country: parts[parts.length - 1],
  };
};
