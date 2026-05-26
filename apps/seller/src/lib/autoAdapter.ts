export interface NormalizedAuto {
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
  brand_id?: number;
  type_id?: number;
  location_id?: number;
  base_price?: number | string | null;
  sale_price?: number | string | null;
  year?: number | string | null;
  make?: string;
  model?: string;
  vin_number?: string | null;
  engine_type?: string;
  transmission?: string;
  fuel_economy?: string;
  drivetrain?: string;
  exterior_color?: string;
  mileage_value?: number | string | null;
  mileage_units?: string;
  condition_rating?: number | string | null;
  warranty_months?: number | string | null;
  stock_quantity?: number | string | null;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  is_published?: boolean;
  is_featured?: boolean;
  is_lease?: boolean;
  is_selling?: boolean;
  features?: Array<{ title: string; icon?: string }>;
  specs?: Record<string, unknown>;
  pricing?: Record<string, unknown>;
  status?: Record<string, unknown>;
}

const buildLocationLabel = (auto: any): string => {
  const location = auto.location ?? {};
  const parts = [location.city, location.state, location.country].filter(Boolean);
  return parts.length ? parts.join(', ') : location.address || 'N/A';
};

export const normalizeAuto = (auto: any): NormalizedAuto => {
  const gallery = Array.isArray(auto.media?.gallery)
    ? auto.media.gallery.map((item: any) => ({
        id: item.id,
        url: item.url,
        thumbnail: item.thumbnail ?? item.url,
      }))
    : [];

  const featuredImage = auto.media?.main_photo ?? auto.featured_image ?? null;
  const media = [
    ...(featuredImage ? [{ original_url: featuredImage }] : []),
    ...gallery
      .filter((item) => item.url !== featuredImage)
      .map((item) => ({ original_url: item.url })),
  ];

  return {
    id: auto.id,
    title: auto.title,
    slug: auto.slug,
    description: auto.description,
    price: auto.pricing?.formatted ?? auto.pricing?.formatted_short ?? undefined,
    sku: auto.specs?.vin ? String(auto.specs.vin).slice(-8).toUpperCase() : `AUTO-${auto.id}`,
    location: buildLocationLabel(auto),
    is_active: auto.status?.is_published ?? false,
    featured_image: featuredImage,
    main_photo_id: auto.media?.main_photo_id ?? auto.main_photo_id ?? null,
    gallery,
    media: media.length ? media : [{ original_url: 'https://via.placeholder.com/400x300?text=Vehicle' }],
    category_id: auto.taxonomy?.category?.id ?? auto.category_id,
    brand_id: auto.taxonomy?.brand?.id ?? auto.brand_id,
    type_id: auto.taxonomy?.type?.id ?? auto.type_id,
    location_id: auto.location_id,
    base_price: auto.pricing?.base_price,
    sale_price: auto.pricing?.sale_price,
    year: auto.specs?.year,
    make: auto.specs?.make,
    model: auto.specs?.model,
    vin_number: auto.specs?.raw_vin ?? auto.specs?.vin,
    engine_type: auto.specs?.engine,
    transmission: auto.specs?.transmission,
    fuel_economy: auto.specs?.fuel_economy,
    drivetrain: auto.specs?.drivetrain,
    exterior_color: auto.specs?.exterior_color,
    mileage_value: auto.specs?.raw_mileage,
    mileage_units: auto.specs?.mileage_units ?? 'mi',
    condition_rating: typeof auto.specs?.condition === 'string' ? auto.specs.condition.replace('/10', '') : auto.specs?.condition,
    warranty_months: auto.specs?.warranty_months ?? (typeof auto.specs?.warranty === 'string' ? auto.specs.warranty.replace(' Months', '') : auto.specs?.warranty),
    stock_quantity: auto.specs?.stock_quantity ?? auto.stock_quantity ?? 1,
    address: auto.location?.address,
    city: auto.location?.city,
    state: auto.location?.state,
    country: auto.location?.country,
    zip_code: auto.location?.zip_code,
    is_published: auto.status?.is_published ?? auto.is_published ?? false,
    is_featured: auto.status?.is_featured ?? auto.is_featured ?? false,
    is_lease: auto.pricing?.is_lease ?? auto.is_lease ?? false,
    is_selling: auto.pricing?.is_selling ?? auto.is_selling ?? true,
    features: auto.taxonomy?.features ?? [],
    specs: auto.specs ?? {},
    pricing: auto.pricing ?? {},
    status: auto.status ?? {},
  };
};
