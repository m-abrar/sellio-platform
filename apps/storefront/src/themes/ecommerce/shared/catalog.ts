import { api } from '@/lib/api-client';
import type { Category, Product } from '@/types';
import { FALLBACK_PRODUCTS, findFallbackProduct } from './fallback-data';

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Products are temporarily unavailable.';
}

export async function fetchProductsCatalog(): Promise<
  { ok: true; data: Product[] } | { ok: false; error: string }
> {
  try {
    const products = await api.getProducts();
    return { ok: true, data: Array.isArray(products) ? products : [] };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export async function fetchExploreCatalog(): Promise<
  | { ok: true; products: Product[]; categories: Category[] }
  | { ok: false; error: string }
> {
  try {
    const [products, categories] = await Promise.all([api.getProducts(), api.getCategories()]);
    return {
      ok: true,
      products: Array.isArray(products) ? products : [],
      categories: Array.isArray(categories) ? categories : [],
    };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export async function fetchProductDetail(
  slug: string,
): Promise<{ ok: true; data: Product } | { ok: false; error: string }> {
  try {
    const product = await api.getProductBySlug(slug);
    if (product) {
      return { ok: true, data: product };
    }
    return { ok: false, error: 'Product not found or API returned no data.' };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export function resolveProductsFailure(allowDemo: boolean) {
  if (allowDemo) {
    return { mode: 'demo' as const, products: FALLBACK_PRODUCTS };
  }
  return { mode: 'empty' as const };
}

export function resolveExploreFailure(allowDemo: boolean) {
  if (allowDemo) {
    return { mode: 'demo' as const, products: FALLBACK_PRODUCTS, categories: [] as Category[] };
  }
  return { mode: 'empty' as const };
}

export function resolveProductFailure(slug: string, allowDemo: boolean) {
  if (!allowDemo) {
    return { mode: 'empty' as const };
  }

  const product = findFallbackProduct(slug);
  if (product) {
    return { mode: 'demo' as const, product };
  }

  return { mode: 'empty' as const };
}
