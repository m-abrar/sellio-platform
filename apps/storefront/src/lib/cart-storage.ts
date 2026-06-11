import type { Product } from '@sellio/types';

export interface UnifiedCartItem {
  product: Product;
  quantity: number;
  cartItemId?: number;
  unitPrice?: number;
}

export const CART_STORAGE_KEY = 'sellio_cart';

export function readCart(): UnifiedCartItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const parsed = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]') as UnifiedCartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCart(items: UnifiedCartItem[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('cartUpdated'));
}

export function getCartItemCount(items: UnifiedCartItem[] = readCart()): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}
