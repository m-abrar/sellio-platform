import type { Cart, CartItem, Product } from '@/types';
import { api } from '@/lib/storefront-api';
import { readCart, writeCart, type UnifiedCartItem } from '@/lib/cart-storage';

export function mapApiCartItem(item: CartItem): UnifiedCartItem {
  const product = item.product;

  return {
    cartItemId: item.id,
    unitPrice: item.unit_price,
    quantity: item.quantity,
    product: {
      id: product?.id ?? 0,
      title: product?.title ?? 'Product',
      slug: product?.slug ?? '',
      description: '',
      price: item.unit_price,
      category_id: 0,
      image_url: product?.image ?? undefined,
      media: product?.image ? { featured_image: product.image } : null,
    },
  };
}

export function mapApiCart(cart: Cart): UnifiedCartItem[] {
  return (cart.items ?? []).map(mapApiCartItem);
}

export async function fetchStorefrontCart(): Promise<UnifiedCartItem[]> {
  try {
    const cart = await api.getCart();
    return mapApiCart(cart);
  } catch {
    return readCart();
  }
}

export async function syncLocalCartToServer(): Promise<void> {
  const localItems = readCart();

  for (const item of localItems) {
    await api.addToCart(item.product.id, item.quantity);
  }

  if (localItems.length > 0) {
    writeCart([]);
  }
}

export async function addProductToStorefrontCart(product: Product, quantity = 1): Promise<void> {
  try {
    await api.addToCart(product.id, quantity);
    window.dispatchEvent(new Event('cartUpdated'));
    return;
  } catch {
    const cart = readCart();
    const existing = cart.find((item) => item.product.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }

    writeCart(cart);
  }
}
