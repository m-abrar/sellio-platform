'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/storefront-api';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import './subpages.css';

export default function UnifiedCheckoutConfirmPage() {
  const searchParams = useSearchParams();
  const themeLink = useUnifiedThemeLink();
  const { user } = useAuth();
  const [message, setMessage] = useState('Confirming your payment...');

  useEffect(() => {
    if (!user) {
      setMessage('Please sign in to confirm your payment.');
      return;
    }

    const paymentIntent = searchParams.get('payment_intent') ?? searchParams.get('token');
    const gateway = searchParams.get('gateway') ?? 'stripe';
    const orderId = Number(searchParams.get('order'));

    if (!paymentIntent || !orderId) {
      setMessage('Missing payment confirmation details.');
      return;
    }

    api.confirmCheckoutPayment(gateway, orderId, paymentIntent)
      .then((result) => {
        if (result.order?.order_number) {
          window.location.assign(themeLink(`/checkout/confirmation/${result.order.order_number}`));
          return;
        }

        setMessage(result.message ?? 'Payment confirmation completed.');
      })
      .catch((error: unknown) => {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setMessage(axiosError.response?.data?.message ?? 'Payment confirmation failed.');
      });
  }, [user, searchParams, themeLink]);

  return (
    <main className="uni-cart-page">
      <section className="uni-cart-state" role="status">
        <h1>Payment confirmation</h1>
        <p>{message}</p>
      </section>
    </main>
  );
}
