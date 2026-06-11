'use client';

import React, { useEffect, useState } from 'react';
import type { EventBookingRecord } from '@sellio/types';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/storefront-api';
import type { EventBookingPrefix } from '@/themes/events/shared/EventBookingPaymentPage';

interface EventBookingConfirmationPageProps {
  bookingId: number;
  classPrefix: EventBookingPrefix;
  themeLink: (path?: string) => string;
}

function cls(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`;
}

export default function EventBookingConfirmationPage({
  bookingId,
  classPrefix: prefix,
  themeLink,
}: EventBookingConfirmationPageProps) {
  const { user, loading: authLoading } = useAuth();
  const [booking, setBooking] = useState<EventBookingRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !bookingId) {
      return;
    }

    api.getEventBooking(bookingId)
      .then(setBooking)
      .catch(() => setError('Unable to load booking details.'));
  }, [user, bookingId]);

  if (authLoading) {
    return <main className={cls(prefix, 'booking-page')}><p>Loading confirmation...</p></main>;
  }

  if (!user) {
    return (
      <main className={cls(prefix, 'booking-page')}>
        <p>Please sign in to view your booking confirmation.</p>
        <a href={themeLink(`/booking/${bookingId}`)} className="ec-btn-primary">Return to payment</a>
      </main>
    );
  }

  return (
    <main className={cls(prefix, 'booking-page')}>
      <section className={cls(prefix, 'booking-state')} role="status">
        <span className="ecc-mono">TICKETS_CONFIRMED</span>
        <h1>Your tickets are confirmed</h1>
        <p>Booking reference #{booking?.id ?? bookingId}</p>
        {booking && (
          <>
            <p><strong>{booking.event?.title}</strong></p>
            <p>{booking.ticket_type?.name} · {booking.quantity} ticket{booking.quantity === 1 ? '' : 's'}</p>
            <p>Total paid: ${Number(booking.total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </>
        )}
        {error && <p className={cls(prefix, 'booking-error')}>{error}</p>}
        <a href={themeLink('/explore')} className="ec-btn-primary">Browse more events</a>
      </section>
    </main>
  );
}
