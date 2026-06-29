import type { Product } from '@/types';
import { addProductToStorefrontCart } from '@/lib/storefront-cart';
import {
  CART_STORAGE_KEY,
  getCartItemCount,
  readCart,
  writeCart,
  type UnifiedCartItem,
} from '@/lib/cart-storage';

export type { UnifiedCartItem };
export { CART_STORAGE_KEY, readCart, writeCart, getCartItemCount };

export function addProductToCart(product: Product): UnifiedCartItem[] {
  if (typeof window !== 'undefined') {
    void addProductToStorefrontCart(product);
  }

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

export function calculateCartTotals(items: UnifiedCartItem[]) {
  const subtotal = items.reduce((total, item) => {
    const unitPrice = item.unitPrice ?? Number(item.product.price);
    return total + (unitPrice * item.quantity);
  }, 0);
  const shipping = subtotal > 0 ? 15 : 0;
  const tax = subtotal * 0.085;
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
}
