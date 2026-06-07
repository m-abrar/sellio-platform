import { PLACEHOLDER_LISTING_PROPERTIES } from '../constants/placeholders';

export interface NormalizedProperty {
  id: number;
  title: string;
  slug: string;
  description?: string;
  price?: string;
  location?: string;
  is_active: boolean;
  is_approved: boolean;
  is_published: boolean;
  featured_image?: string | null;
  featured_image_id?: number | null;
  gallery: Array<{ id: number; url: string; thumbnail?: string }>;
  media: Array<{ original_url: string }>;
  category_id?: number;
  type_id?: number;
  location_id?: number;
  brand_id?: number | string | null;
  brand?: { id: number; title: string } | null;
  tags?: string[];
  features?: Array<{ id: number; title: string }>;
  neighborhoods?: Array<{ id?: number; title: string; description?: string | null; distance_miles: number }>;
  seasonal_prices?: Array<{ id?: number; season_name: string; start_date: string; end_date: string; price: number }>;
  addons?: Array<{ id?: number; title: string; description?: string | null; price: number }>;
  fees?: Array<{ id?: number; title: string; amount: number; type: 'fixed' | 'percentage'; rate: number | null; charge_type: string }>;
  scores?: Array<{ id?: number; title: string; score: number; units?: string | null; description?: string | null }>;
  address?: string;
  city?: string;
  state?: string | null;
  country?: string;
  zip_code?: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  base_price?: number | string | null;
  sale_price?: number | string | null;
  price_per_night?: number | string | null;
  hoa?: number | string | null;
  is_sale?: boolean;
  is_rental?: boolean;
  total_units?: number | string | null;
  number_of_bedrooms?: number | string | null;
  number_of_bathrooms?: number | string | null;
  maximum_guests?: number | string | null;
  minimum_rental_days?: number | string | null;
  maximum_rental_days?: number | string | null;
  number_of_parking_spots?: string | null;
  area_sq_ft?: number | string | null;
  year_built?: number | string | null;
  video?: string | null;
  virtual_tour?: string | null;
  rules?: string | null;
  policies?: string | null;
  amenities?: Array<{ id: number; title?: string }>;
  status?: {
    is_published?: boolean;
    is_featured?: boolean;
    is_rental?: boolean;
    is_sale?: boolean;
    label?: string;
  };
  specs?: Record<string, unknown>;
  pricing?: Record<string, unknown>;
}

const buildLocationLabel = (property: any): string => {
  const location = property.location ?? {};
  const parts = [location.city, location.state, location.country].filter(Boolean);

  if (parts.length) {
    return parts.join(', ');
  }

  return location.address || location.title || 'N/A';
};

export const normalizeProperty = (property: any): NormalizedProperty => {
  const gallery = Array.isArray(property.gallery)
    ? property.gallery.map((item: any) => ({
        id: item.id,
        url: item.url,
        thumbnail: item.thumbnail ?? item.url,
      }))
    : [];

  const featuredImage = property.featured_image ?? property.thumbnail_image ?? null;
  const media = [
    ...(featuredImage ? [{ original_url: featuredImage }] : []),
    ...gallery
      .filter((item) => item.url !== featuredImage)
      .map((item) => ({ original_url: item.url })),
  ];

  return {
    id: property.id,
    title: property.title,
    slug: property.slug,
    description: property.description,
    price: property.pricing?.price_formatted ?? property.pricing?.price_formatted_k ?? undefined,
    location: buildLocationLabel(property),
    is_active: (property.status?.is_published && property.status?.is_approved) ?? (property.is_published && property.approved_at) ?? false,
    is_approved: property.status?.is_approved ?? !!property.approved_at,
    is_published: property.status?.is_published ?? !!property.is_published,
    featured_image: featuredImage,
    featured_image_id: property.featured_image_id ?? null,
    gallery,
    media: media.length ? media : [{ original_url: PLACEHOLDER_LISTING_PROPERTIES }],
    category_id: property.category_id,
    type_id: property.type_id,
    location_id: property.location_id,
    brand_id: property.brand_id ?? property.brand?.id ?? null,
    brand: property.brand ?? null,
    tags: property.tags ?? [],
    features: property.features ?? [],
    neighborhoods: property.neighborhoods ?? [],
    seasonal_prices: property.seasonal_prices ?? [],
    addons: property.addons ?? [],
    fees: property.fees ?? [],
    scores: property.scores ?? [],
    address: property.location?.address,
    city: property.location?.city,
    state: property.location?.state,
    country: property.location?.country,
    zip_code: property.location?.zip_code,
    latitude: property.location?.latitude,
    longitude: property.location?.longitude,
    base_price: property.pricing?.base_price,
    sale_price: property.pricing?.sale_price,
    price_per_night: property.pricing?.price_per_night,
    hoa: property.pricing?.hoa,
    is_sale: property.status?.is_sale ?? true,
    is_rental: property.status?.is_rental ?? false,
    total_units: property.specs?.total_units,
    number_of_bedrooms: property.specs?.bedrooms,
    number_of_bathrooms: property.specs?.bathrooms,
    maximum_guests: property.specs?.max_guests,
    minimum_rental_days: property.specs?.minimum_rental_days,
    maximum_rental_days: property.specs?.maximum_rental_days,
    number_of_parking_spots: property.specs?.parking_spots,
    area_sq_ft: property.specs?.area_sq_ft,
    year_built: property.specs?.year_built,
    video: property.video,
    virtual_tour: property.virtual_tour,
    rules: property.rules,
    policies: property.policies,
    amenities: property.amenities ?? [],
    status: property.status ?? {},
    specs: property.specs ?? {},
    pricing: property.pricing ?? {},
  };
};
