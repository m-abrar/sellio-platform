export interface NormalizedService {
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
  operating_hours?: string;
  operating_days_label?: string;
  licenses_certs?: string;
  service_radius?: number | string | null;
  min_contract_months?: number | string | null;
  max_client_slots?: number | string | null;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  zip_code?: string;
  is_published?: boolean;
  is_featured?: boolean;
  is_subscription?: boolean;
  is_project_based?: boolean;
  expertise_level?: number;
  availability_schedule?: number;
  rate_type?: 'fixed' | 'hourly';
  category?: string;
  delivery_time?: string;
  pricing?: Record<string, unknown>;
  operations?: Record<string, unknown>;
  professional?: Record<string, unknown>;
  status?: Record<string, unknown>;
}

const buildLocationLabel = (service: any): string => {
  const location = service.location ?? {};
  const parts = [location.city, location.state, location.country].filter(Boolean);

  if (parts.length) {
    return parts.join(', ');
  }

  return location.meta || location.address || 'Remote';
};

export const normalizeService = (service: any): NormalizedService => {
  const gallery = Array.isArray(service.media?.gallery)
    ? service.media.gallery.map((item: any) => ({
        id: item.id,
        url: item.url,
        thumbnail: item.thumbnail ?? item.url,
      }))
    : [];

  const featuredImage = service.media?.main_photo ?? null;
  const media = [
    ...(featuredImage ? [{ original_url: featuredImage }] : []),
    ...gallery
      .filter((item) => item.url !== featuredImage)
      .map((item) => ({ original_url: item.url })),
  ];

  const isProjectBased = service.pricing?.billing_type?.is_project_based ?? false;

  return {
    id: service.id,
    title: service.title,
    slug: service.slug,
    description: service.description,
    price: service.pricing?.formatted ?? service.pricing?.formatted_short ?? undefined,
    sku: `SVC-${service.id}`,
    location: buildLocationLabel(service),
    is_active: service.status?.is_published ?? false,
    featured_image: featuredImage,
    main_photo_id: service.media?.main_photo_id ?? null,
    gallery,
    media: media.length ? media : [{ original_url: 'https://via.placeholder.com/400x300?text=Service' }],
    category_id: service.professional?.category?.id ?? service.category_id,
    type_id: service.professional?.type?.id ?? service.type_id,
    location_id: service.location_id,
    base_price: service.pricing?.base_price,
    sale_price: service.pricing?.sale_price,
    operating_hours: service.operations?.hours_label ?? undefined,
    operating_days_label: service.operations?.days_label ?? undefined,
    licenses_certs: service.professional?.certifications ?? undefined,
    service_radius: service.operations?.radius,
    min_contract_months: service.pricing?.min_contract_months,
    max_client_slots: service.operations?.client_slots?.max,
    city: service.location?.city,
    state: service.location?.state,
    country: service.location?.country,
    address: service.location?.address,
    zip_code: service.location?.zip_code,
    is_published: service.status?.is_published ?? service.is_published ?? false,
    is_featured: service.status?.is_featured ?? service.is_featured ?? false,
    is_subscription: service.pricing?.billing_type?.is_subscription ?? service.is_subscription ?? false,
    is_project_based: isProjectBased ?? service.is_project_based ?? false,
    expertise_level: service.professional?.expertise_id,
    availability_schedule: service.professional?.schedule_id,
    rate_type: isProjectBased ? 'fixed' : 'hourly',
    category: service.professional?.category?.title ?? service.professional?.category ?? undefined,
    delivery_time: service.operations?.hours_label ?? service.pricing?.min_contract ?? undefined,
    pricing: service.pricing ?? {},
    operations: service.operations ?? {},
    professional: service.professional ?? {},
    status: service.status ?? {},
  };
};
