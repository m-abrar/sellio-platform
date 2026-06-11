'use client';

import React, { useEffect, useState } from 'react';
import type { Order } from '@sellio/types';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/storefront-api';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import './subpages.css';

interface UnifiedCheckoutConfirmationPageProps {
  orderNumber: string;
  primaryButtonClass?: string;
}

export default function UnifiedCheckoutConfirmationPage({
  orderNumber,
  primaryButtonClass = 'uni-btn-primary',
}: UnifiedCheckoutConfirmationPageProps) {
  const themeLink = useUnifiedThemeLink();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !orderNumber) {
      return;
    }

    api.getOrder(orderNumber)
      .then(setOrder)
      .catch(() => setError('Unable to load order details.'));
  }, [user, orderNumber]);

  if (authLoading) {
    return <main className="uni-cart-page"><p>Loading confirmation...</p></main>;
  }

  if (!user) {
    return (
      <main className="uni-cart-page">
        <p>Please sign in to view your order confirmation.</p>
        <a href={themeLink('/checkout')} className={primaryButtonClass}>Return to checkout</a>
      </main>
    );
  }

  return (
    <main className="uni-cart-page">
      <section className="uni-cart-state" role="status">
        <div className="uni-mono" style={{ color: '#16a34a', marginBottom: '1rem' }}>ORDER_CONFIRMED</div>
        <h1>Thank you for your order</h1>
        <p>Your payment has been received and your order is being processed.</p>
        <p><strong>Order number:</strong> {order?.order_number ?? orderNumber}</p>
        {order && (
          <p>
            <strong>Total:</strong> {order.pricing.currency_symbol}
            {order.pricing.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        )}
        {error && <p style={{ color: '#b45309' }}>{error}</p>}
        <a href={themeLink('/')} className={primaryButtonClass}>Continue browsing</a>
      </section>
    </main>
  );
}
