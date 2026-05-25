export interface NormalizedProperty {
  id: number;
  title: string;
  slug: string;
  description?: string;
  price?: string;
  location?: string;
  is_active: boolean;
  featured_image?: string | null;
  gallery: Array<{ id: number; url: string; thumbnail?: string }>;
  media: Array<{ original_url: string }>;
  category_id?: number;
  type_id?: number;
  location_id?: number;
  address?: string;
  city?: string;
  country?: string;
  zip_code?: string;
  base_price?: number | string | null;
  sale_price?: number | string | null;
  price_per_night?: number | string | null;
  is_sale?: boolean;
  is_rental?: boolean;
  number_of_bedrooms?: number | string | null;
  number_of_bathrooms?: number | string | null;
  maximum_guests?: number | string | null;
  area_sq_ft?: number | string | null;
  year_built?: number | string | null;
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
    is_active: property.status?.is_published ?? property.is_published ?? false,
    featured_image: featuredImage,
    gallery,
    media: media.length ? media : [{ original_url: 'https://via.placeholder.com/400x300?text=Property' }],
    category_id: property.category_id,
    type_id: property.type_id,
    location_id: property.location_id,
    address: property.location?.address,
    city: property.location?.city,
    country: property.location?.country,
    zip_code: property.location?.zip_code,
    base_price: property.pricing?.base_price,
    sale_price: property.pricing?.sale_price,
    price_per_night: property.pricing?.price_per_night,
    is_sale: property.status?.is_sale ?? true,
    is_rental: property.status?.is_rental ?? false,
    number_of_bedrooms: property.specs?.bedrooms,
    number_of_bathrooms: property.specs?.bathrooms,
    maximum_guests: property.specs?.max_guests,
    area_sq_ft: property.specs?.area_sq_ft,
    year_built: property.specs?.year_built,
    amenities: property.amenities ?? [],
    status: property.status ?? {},
    specs: property.specs ?? {},
    pricing: property.pricing ?? {},
  };
};
