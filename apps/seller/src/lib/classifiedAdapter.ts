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
  main_photo_id?: number | null;
  gallery: Array<{ id: number; url: string; thumbnail?: string }>;
  media: Array<{ original_url: string }>;
  category_id?: number;
  type_id?: number;
  location_id?: number;
  base_price?: number | string | null;
  sale_price?: number | string | null;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  zip_code?: string;
  condition?: string;
  condition_rating?: number;
  item_year_age?: number | string | null;
  item_quantity?: number | string | null;
  item_dimensions?: number | string | null;
  warranty_months?: number | string | null;
  min_ad_duration?: number | string | null;
  is_published?: boolean;
  is_featured?: boolean;
  is_for_sale?: boolean;
  is_for_rent?: boolean;
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
    main_photo_id: classified.media?.main_photo_id ?? null,
    gallery,
    media: media.length ? media : [{ original_url: 'https://via.placeholder.com/400x300?text=Listing' }],
    category_id: classified.taxonomy?.category?.id ?? classified.category_id,
    type_id: classified.taxonomy?.type?.id ?? classified.type_id,
    location_id: classified.location_id,
    base_price: classified.pricing?.base_price,
    sale_price: classified.pricing?.sale_price,
    city: classified.location?.city,
    state: classified.location?.state,
    country: classified.location?.country,
    address: classified.location?.address,
    zip_code: classified.location?.zip_code,
    condition: mapRatingToCondition(conditionRating),
    condition_rating: conditionRating ?? undefined,
    item_year_age: classified.item_specs?.age_years,
    item_quantity: classified.item_specs?.quantity,
    item_dimensions: classified.item_specs?.dimensions,
    warranty_months: classified.item_specs?.warranty_months,
    min_ad_duration: classified.item_specs?.min_ad_duration,
    is_published: classified.status?.is_published ?? classified.is_published ?? false,
    is_featured: classified.status?.is_featured ?? classified.is_featured ?? false,
    is_for_sale: classified.pricing?.transaction_type?.for_sale ?? classified.is_for_sale ?? true,
    is_for_rent: classified.pricing?.transaction_type?.for_rent ?? classified.is_for_rent ?? false,
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
