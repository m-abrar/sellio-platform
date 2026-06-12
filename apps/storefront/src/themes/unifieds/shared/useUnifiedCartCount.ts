'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/storefront-api';
import { getCartItemCount, readCart } from '@/lib/cart-storage';
import { mapApiCart } from '@/lib/storefront-cart';

export function useUnifiedCartCount(): number {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const cart = await api.getCart();
      setCount(getCartItemCount(mapApiCart(cart)));
    } catch {
      setCount(getCartItemCount(readCart()));
    }
  }, []);

  useEffect(() => {
    void refresh();
    const onRefresh = () => {
      void refresh();
    };

    window.addEventListener('cartUpdated', onRefresh);
    window.addEventListener('storage', onRefresh);
    window.addEventListener('authUpdated', onRefresh);

    return () => {
      window.removeEventListener('cartUpdated', onRefresh);
      window.removeEventListener('storage', onRefresh);
      window.removeEventListener('authUpdated', onRefresh);
    };
  }, [refresh]);

  return count;
}
