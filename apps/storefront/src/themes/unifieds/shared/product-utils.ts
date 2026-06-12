import type { Category, Product } from '@sellio/types';

export const PRODUCT_CARD_PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='720' height='520' viewBox='0 0 720 520'><rect width='100%' height='100%' fill='%23f8fafc'/><g transform='translate(328,214)' stroke='%2394a3b8' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='60' height='60' rx='8'/><circle cx='20' cy='20' r='6'/><path d='M58 46L42 30 12 60'/></g><text x='50%' y='61%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='13' font-weight='700' letter-spacing='2' fill='%2364758b'>LISTING IMAGE</text></svg>";

export const PRODUCT_DETAIL_PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='860' height='640' viewBox='0 0 860 640'><rect width='100%' height='100%' fill='%23f8fafc'/><g transform='translate(400,270)' stroke='%2394a3b8' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='60' height='60' rx='8'/><circle cx='20' cy='20' r='6'/><path d='M58 46L42 30 12 60'/></g><text x='50%' y='61%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='13' font-weight='700' letter-spacing='2' fill='%2364758b'>CATALOG RECORD</text></svg>";

export const CART_THUMB_PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='75' viewBox='0 0 100 75'><rect width='100%' height='100%' fill='%23F9FAFB'/><g transform='translate(38,25)' stroke='%23D1D5DB' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='20' height='20' rx='2'/><circle cx='8' cy='8' r='2'/><path d='M20 16L14 10 4 20'/></g></svg>";

export function formatProductPrice(product: Product): string {
  if (product.pricing?.formatted) {
    return product.pricing.formatted;
  }

  if (product.price) {
    return `$${Number(product.price).toLocaleString()}`;
  }

  return 'Contact for pricing';
}

export function getProductImage(product: Product, fallback = PRODUCT_CARD_PLACEHOLDER): string {
  return product.media?.featured_image || product.image_url || fallback;
}

type ProductWithTaxonomy = Product & {
  taxonomy?: {
    category?: { id?: number; title?: string; slug?: string };
    brand?: { id?: number; title?: string };
  };
  inventory?: {
    in_stock?: boolean;
    stock_quantity?: number | string;
  };
};

export function getProductCategoryLabel(
  product: Product,
  categories: Category[] = [],
  fallback = 'General',
): string {
  const enriched = product as ProductWithTaxonomy;

  if (enriched.taxonomy?.category?.title) {
    return enriched.taxonomy.category.title;
  }

  const categoryId = enriched.taxonomy?.category?.id ?? product.category_id;
  const matched = categories.find((category) => category.id === categoryId);

  return matched?.title ?? fallback;
}

export function isProductInStock(product: Product): boolean {
  const inventory = (product as ProductWithTaxonomy).inventory;
  return inventory?.in_stock !== false;
}

export type ExploreSortOption = 'default' | 'price_asc' | 'price_desc';

export function isExploreSortOption(value: string): value is ExploreSortOption {
  return value === 'default' || value === 'price_asc' || value === 'price_desc';
}
