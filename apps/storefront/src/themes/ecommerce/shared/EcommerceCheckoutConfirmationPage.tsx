'use client';

import React, { useEffect, useState } from 'react';
import type { Order } from '@/types';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/storefront-api';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import type { EcommerceCheckoutPrefix } from '@/themes/ecommerce/shared/EcommerceCheckoutPage';

interface EcommerceCheckoutConfirmationPageProps {
  orderNumber: string;
  classPrefix: EcommerceCheckoutPrefix;
  shell?: (content: React.ReactNode) => React.ReactNode;
}

function cls(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`;
}

export default function EcommerceCheckoutConfirmationPage({
  orderNumber,
  classPrefix: prefix,
  shell,
}: EcommerceCheckoutConfirmationPageProps) {
  const themeLink = useEcommerceThemeLink();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const primaryBtnClass = prefix === 'el'
    ? 'el-btn el-btn-primary'
    : prefix === 'ecl'
      ? 'ecl-btn-gold'
      : `${prefix}-btn-primary`;

  useEffect(() => {
    if (!user || !orderNumber) {
      return;
    }

    api.getOrder(orderNumber)
      .then(setOrder)
      .catch(() => setError('Unable to load order details.'));
  }, [user, orderNumber]);

  const content = (
    <main className={cls(prefix, 'checkout-page')}>
      <section className={cls(prefix, 'checkout-state')} role="status">
        <div className={`${prefix}-mono`}>ORDER_CONFIRMED</div>
        <h1>Thank you for your order</h1>
        <p>Your payment has been received and your order is being processed.</p>
        <p><strong>Order number:</strong> {order?.order_number ?? orderNumber}</p>
        {order && (
          <p>
            <strong>Total:</strong> {order.pricing.currency_symbol}
            {order.pricing.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        )}
        {error && <p className={cls(prefix, 'checkout-warning')}>{error}</p>}
        <a href={themeLink('/')} className={primaryBtnClass}>Continue shopping</a>
      </section>
    </main>
  );

  if (authLoading) {
    const loading = <main className={cls(prefix, 'checkout-page')}><p>Loading confirmation...</p></main>;
    return shell ? shell(loading) : loading;
  }

  if (!user) {
    const authRequired = (
      <main className={cls(prefix, 'checkout-page')}>
        <p>Please sign in to view your order confirmation.</p>
        <a href={themeLink('/checkout')} className={primaryBtnClass}>Return to checkout</a>
      </main>
    );
    return shell ? shell(authRequired) : authRequired;
  }

  return shell ? shell(content) : content;
}
