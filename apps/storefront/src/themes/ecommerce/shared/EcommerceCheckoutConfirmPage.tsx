'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/storefront-api';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import type { EcommerceCheckoutPrefix } from '@/themes/ecommerce/shared/EcommerceCheckoutPage';

interface EcommerceCheckoutConfirmPageProps {
  classPrefix: EcommerceCheckoutPrefix;
  shell?: (content: React.ReactNode) => React.ReactNode;
}

function cls(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`;
}

export default function EcommerceCheckoutConfirmPage({
  classPrefix: prefix,
  shell,
}: EcommerceCheckoutConfirmPageProps) {
  const searchParams = useSearchParams();
  const themeLink = useEcommerceThemeLink();
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

  const content = (
    <main className={cls(prefix, 'checkout-page')}>
      <section className={cls(prefix, 'checkout-state')} role="status">
        <h1>Payment confirmation</h1>
        <p>{message}</p>
      </section>
    </main>
  );

  return shell ? shell(content) : content;
}
