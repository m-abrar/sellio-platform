import type { Product } from '@sellio/types';

export interface UnifiedCartItem {
  product: Product;
  quantity: number;
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

export function addProductToCart(product: Product): UnifiedCartItem[] {
  const cart = readCart();
  const existing = cart.find((item) => item.product.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ product, quantity: 1 });
  }

  writeCart(cart);
  return cart;
}

export function getCartItemCount(items: UnifiedCartItem[] = readCart()): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function calculateCartTotals(items: UnifiedCartItem[]) {
  const subtotal = items.reduce(
    (total, item) => total + (Number(item.product.price) * item.quantity),
    0,
  );
  const shipping = subtotal > 0 ? 15 : 0;
  const tax = subtotal * 0.085;
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
}
