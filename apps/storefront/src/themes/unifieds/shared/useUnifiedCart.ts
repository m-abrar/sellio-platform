'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/storefront-api';
import { fetchStorefrontCart, mapApiCart } from '@/lib/storefront-cart';
import { getCartItemCount, readCart, writeCart, type UnifiedCartItem } from '@/lib/cart-storage';

export function useUnifiedCart() {
  const [items, setItems] = useState<UnifiedCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingApi, setUsingApi] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const cart = await api.getCart();
      setItems(mapApiCart(cart));
      setUsingApi(true);
    } catch {
      setItems(readCart());
      setUsingApi(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener('cartUpdated', refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener('authUpdated', refresh);

    return () => {
      window.removeEventListener('cartUpdated', refresh);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('authUpdated', refresh);
    };
  }, [refresh]);

  const saveLocalItems = useCallback((nextItems: UnifiedCartItem[]) => {
    writeCart(nextItems);
    setItems(nextItems);
    setUsingApi(false);
  }, []);

  const updateQuantity = useCallback(async (productId: number, delta: number) => {
    const currentItem = items.find((item) => item.product.id === productId);
    if (!currentItem) {
      return;
    }

    const nextQuantity = Math.max(1, currentItem.quantity + delta);
    const optimisticItems = items.map((item) => (
      item.product.id === productId
        ? { ...item, quantity: nextQuantity }
        : item
    ));

    setItems(optimisticItems);

    if (usingApi && currentItem.cartItemId) {
      try {
        await api.updateCartItem(currentItem.cartItemId, nextQuantity);
        await refresh();
        return;
      } catch {
        // Fall through to local cart.
      }
    }

    const nextItems = readCart().map((item) => (
      item.product.id === productId
        ? { ...item, quantity: nextQuantity }
        : item
    ));
    saveLocalItems(nextItems);
  }, [items, usingApi, refresh, saveLocalItems]);

  const removeItem = useCallback(async (productId: number) => {
    const currentItem = items.find((item) => item.product.id === productId);

    if (usingApi && currentItem?.cartItemId) {
      try {
        await api.removeCartItem(currentItem.cartItemId);
        await refresh();
        return;
      } catch {
        // Fall through to local cart.
      }
    }

    saveLocalItems(readCart().filter((item) => item.product.id !== productId));
  }, [items, usingApi, refresh, saveLocalItems]);

  const clearCart = useCallback(async () => {
    if (usingApi) {
      try {
        const cartItems = await fetchStorefrontCart();
        await Promise.all(
          cartItems
            .filter((item) => item.cartItemId)
            .map((item) => api.removeCartItem(item.cartItemId!)),
        );
        await refresh();
        return;
      } catch {
        // Fall through to local cart.
      }
    }

    saveLocalItems([]);
  }, [usingApi, refresh, saveLocalItems]);

  return {
    items,
    loading,
    usingApi,
    itemCount: getCartItemCount(items),
    updateQuantity,
    removeItem,
    clearCart,
    refresh,
  };
}
