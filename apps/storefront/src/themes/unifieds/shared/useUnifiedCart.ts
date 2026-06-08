'use client';

import { useCallback, useEffect, useState } from 'react';
import type { UnifiedCartItem } from '@/themes/unifieds/shared/cart';
import { getCartItemCount, readCart, writeCart } from '@/themes/unifieds/shared/cart';

export function useUnifiedCart() {
  const [items, setItems] = useState<UnifiedCartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setItems(readCart());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener('cartUpdated', refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener('cartUpdated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  const saveItems = useCallback((nextItems: UnifiedCartItem[]) => {
    writeCart(nextItems);
    setItems(nextItems);
  }, []);

  const updateQuantity = useCallback((productId: number, delta: number) => {
    const nextItems = readCart().map((item) => {
      if (item.product.id !== productId) {
        return item;
      }

      return { ...item, quantity: Math.max(1, item.quantity + delta) };
    });

    saveItems(nextItems);
  }, [saveItems]);

  const removeItem = useCallback((productId: number) => {
    saveItems(readCart().filter((item) => item.product.id !== productId));
  }, [saveItems]);

  const clearCart = useCallback(() => {
    saveItems([]);
  }, [saveItems]);

  return {
    items,
    loading,
    itemCount: getCartItemCount(items),
    updateQuantity,
    removeItem,
    clearCart,
  };
}
