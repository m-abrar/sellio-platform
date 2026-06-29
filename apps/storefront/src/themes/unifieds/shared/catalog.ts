import { api } from '@/lib/storefront-api';
import type { Category, Product } from '@/types';

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) {
      return response.data.message;
    }
  }

  return 'Listings are temporarily unavailable.';
}

export async function fetchProductsHome(params: Record<string, unknown> = {}) {
  try {
    const response = await api.getProductsCatalog({
      per_page: 6,
      ...params,
    });
    return { ok: true as const, response };
  } catch (error) {
    return { ok: false as const, error: toErrorMessage(error) };
  }
}

export async function fetchProductsExplore(params: Record<string, unknown> = {}) {
  try {
    const response = await api.getProductsCatalog({
      per_page: 12,
      ...params,
    });
    return { ok: true as const, response };
  } catch (error) {
    return { ok: false as const, error: toErrorMessage(error) };
  }
}

export async function fetchProductDetail(slug: string) {
  try {
    const product = await api.getProductBySlug(slug);
    if (product) {
      return { ok: true as const, product };
    }
    return { ok: false as const, error: 'Listing not found or API returned no data.' };
  } catch (error) {
    const status =
      typeof error === 'object' && error !== null && 'response' in error
        ? (error as { response?: { status?: number } }).response?.status
        : undefined;

    if (status === 404) {
      return {
        ok: false as const,
        notFound: true as const,
        error: 'Listing not found.',
      };
    }

    return { ok: false as const, error: toErrorMessage(error) };
  }
}

export function getRelatedProducts(
  product: Product,
  catalog: Product[],
  limit = 4,
): Product[] {
  const categoryId = getProductCategoryId(product);

  return catalog
    .filter((item) => item.id !== product.id && getProductCategoryId(item) === categoryId)
    .slice(0, limit);
}

export function getProductCategoryId(product: Product): number | null {
  const taxonomyCategory = (product as Product & {
    taxonomy?: { category?: { id?: number } };
  }).taxonomy?.category;

  if (taxonomyCategory?.id) {
    return taxonomyCategory.id;
  }

  return product.category_id || null;
}

export type ProductDetailPageResult = {
  mode: 'live' | 'not-found' | 'error';
  product: Product | null;
  related: Product[];
  categories: Category[];
  alertError: string | null;
};

export async function loadProductDetailPage(slug: string): Promise<ProductDetailPageResult> {
  const result = await fetchProductDetail(slug);

  if (result.ok) {
    let related: Product[] = [];
    let categories: Category[] = [];

    const catalogResult = await fetchProductsHome({ per_page: 24 });
    if (catalogResult.ok) {
      related = getRelatedProducts(result.product, catalogResult.response.data);
      categories = catalogResult.response.sidebar?.categories ?? [];
    }

    if (!categories.length) {
      try {
        categories = await api.getCategories();
      } catch {
        categories = [];
      }
    }

    return {
      mode: 'live',
      product: result.product,
      related,
      categories,
      alertError: null,
    };
  }

  if ('notFound' in result && result.notFound) {
    return {
      mode: 'not-found',
      product: null,
      related: [],
      categories: [],
      alertError: `No published listing matched "${slug}". Browse the catalog from Explore or the homepage feed.`,
    };
  }

  return {
    mode: 'error',
    product: null,
    related: [],
    categories: [],
    alertError: result.error ?? 'Listings are temporarily unavailable.',
  };
}

export function countInStockProducts(products: Product[]): number {
  return products.filter((product) => {
    const inventory = (product as Product & { inventory?: { in_stock?: boolean } }).inventory;
    return inventory?.in_stock !== false;
  }).length;
}
