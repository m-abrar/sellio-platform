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
  pricing: {
    base_price?: number;
    sale_price?: number | null;
    formatted?: string;
  };
  inventory: {
    stock_quantity?: number;
    in_stock?: boolean;
    manage_stock?: boolean;
  };
  category?: { id: number; title: string };
  brand?: { id: number; title: string };
  specs?: {
    weight?: string | null;
    dimensions?: string | null;
    features?: unknown[];
  };
  status?: {
    is_published?: boolean;
    is_featured?: boolean;
    approved_at?: string | null;
  };
  is_featured?: boolean;
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
    pricing: product.pricing ?? {},
    inventory: {
      stock_quantity: toNumber(product.inventory?.stock_quantity),
      in_stock: product.inventory?.in_stock,
      manage_stock: product.inventory?.manage_stock,
    },
    category: product.taxonomy?.category ?? product.category,
    brand: product.taxonomy?.brand ?? product.brand,
    specs: product.specs ?? {},
    status: product.status ?? {},
    is_featured: product.status?.is_featured ?? product.is_featured ?? false,
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
