'use client';

import { useEffect, useState } from 'react';
import { getCartItemCount, readCart } from '@/themes/unifieds/shared/cart';

export function useUnifiedCartCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function refresh() {
      setCount(getCartItemCount(readCart()));
    }

    refresh();
    window.addEventListener('cartUpdated', refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener('cartUpdated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return count;
}
