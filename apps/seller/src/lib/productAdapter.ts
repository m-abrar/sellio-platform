export interface NormalizedProduct {
  id: number;
  title: string;
  slug: string;
  sku?: string;
  description?: string;
  short_description?: string;
  featured_image?: string | null;
  featured_image_id?: number | null;
  gallery: Array<{ id: number; url: string; thumbnail?: string }>;
  video_url?: string | null;
  pricing: {
    base_price?: number;
    sale_price?: number | null;
    cost_price?: number | null;
    on_sale?: boolean;
    formatted?: string;
  };
  inventory: {
    stock_quantity?: number;
    low_stock_threshold?: number;
    in_stock?: boolean;
    manage_stock?: boolean;
    is_digital?: boolean;
  };
  category?: { id: number; title: string };
  brand?: { id: number; title: string };
  type?: { id: number; title: string };
  specs?: {
    weight?: string | null;
    weight_value?: number | null;
    length?: number | null;
    width?: number | null;
    height?: number | null;
    dimensions?: string | null;
    features?: unknown[];
  };
  status?: {
    is_published?: boolean;
    is_featured?: boolean;
    approved_at?: string | null;
  };
  is_featured?: boolean;
  meta?: {
    title?: string | null;
    description?: string | null;
  };
}

const toNumber = (value: unknown): number | undefined => {
  if (value === null || value === undefined || value === '') return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const normalizeProduct = (product: any): NormalizedProduct => {
  const gallery = product?.media?.gallery ?? product?.gallery ?? [];

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    short_description: product.short_description,
    featured_image: product.media?.featured_image ?? product.featured_image ?? null,
    featured_image_id: gallery.find((item: any) => item.isMain)?.id ?? gallery[0]?.id ?? null,
    gallery: Array.isArray(gallery)
      ? gallery.map((item: any) => ({
          id: item.id,
          url: item.url,
          thumbnail: item.thumbnail ?? item.url,
        }))
      : [],
    video_url: product.media?.video_url ?? product.video_url ?? null,
    pricing: product.pricing
      ? {
          ...product.pricing,
          cost_price: product.pricing.cost_price !== undefined ? toNumber(product.pricing.cost_price) : null,
        }
      : {},
    inventory: {
      stock_quantity: toNumber(product.inventory?.stock_quantity),
      low_stock_threshold: toNumber(product.inventory?.low_stock_threshold),
      in_stock: product.inventory?.in_stock,
      manage_stock: product.inventory?.manage_stock,
      is_digital: product.inventory?.is_digital,
    },
    category: product.taxonomy?.category ?? product.category,
    brand: product.taxonomy?.brand ?? product.brand,
    type: product.taxonomy?.type ?? product.type,
    specs: product.specs ?? {},
    status: product.status ?? {},
    is_featured: product.status?.is_featured ?? product.is_featured ?? false,
    meta: product.meta ?? {},
  };
};

export const mapRecentListing = (listing: any) => {
  const typeLabel = listing.type_label ?? listing.module_type ?? 'Listing';
  const moduleSlug = typeLabel === 'JobListing'
    ? 'joblistings'
    : `${String(typeLabel).toLowerCase()}s`.replace('classsifieds', 'classifieds');

  return {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    module_type: typeLabel,
    module_slug: moduleSlug,
    is_active: listing.is_published ?? listing.is_active ?? false,
    media: listing.media?.length
      ? listing.media
      : listing.featured_image
        ? [{ original_url: listing.featured_image }]
        : [],
  };
};
