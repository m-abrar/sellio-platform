'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/storefront-api';
import type { EventBookingPrefix } from '@/themes/events/shared/EventBookingPaymentPage';

interface EventBookingConfirmPageProps {
  classPrefix: EventBookingPrefix;
  themeLink: (path?: string) => string;
}

function cls(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`;
}

export default function EventBookingConfirmPage({
  classPrefix: prefix,
  themeLink,
}: EventBookingConfirmPageProps) {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [message, setMessage] = useState('Confirming your payment...');

  useEffect(() => {
    if (!user) {
      setMessage('Please sign in to confirm your payment.');
      return;
    }

    const paymentIntent = searchParams.get('payment_intent') ?? searchParams.get('token');
    const gateway = searchParams.get('gateway') ?? 'stripe';
    const bookingId = Number(searchParams.get('booking'));

    if (!paymentIntent || !bookingId) {
      setMessage('Missing payment confirmation details.');
      return;
    }

    api.confirmEventBookingPayment(bookingId, gateway, paymentIntent)
      .then((result) => {
        if (result.booking?.id) {
          window.location.assign(themeLink(`/booking/confirmation/${result.booking.id}`));
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
    <main className={cls(prefix, 'booking-page')}>
      <section className={cls(prefix, 'booking-state')} role="status">
        <h1>Payment confirmation</h1>
        <p>{message}</p>
      </section>
    </main>
  );
}
