'use client';

import React, { useEffect, useState } from 'react';
import type { PropertyBookingRecord } from '@sellio/types';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/storefront-api';
import type { PropertyBookingPrefix } from '@/themes/properties/shared/PropertyBookingPaymentPage';

interface PropertyBookingConfirmationPageProps {
  bookingId: number;
  classPrefix: PropertyBookingPrefix;
  themeLink: (path?: string) => string;
}

function cls(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`;
}

export default function PropertyBookingConfirmationPage({
  bookingId,
  classPrefix: prefix,
  themeLink,
}: PropertyBookingConfirmationPageProps) {
  const { user, loading: authLoading } = useAuth();
  const [booking, setBooking] = useState<PropertyBookingRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const primaryBtnClass = prefix === 'pm' ? 'urban-btn-primary' : 'pr-btn-primary';

  useEffect(() => {
    if (!user || !bookingId) {
      return;
    }

    api.getPropertyBooking(bookingId)
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
        <a href={themeLink(`/booking/${bookingId}`)} className={primaryBtnClass}>Return to payment</a>
      </main>
    );
  }

  return (
    <main className={cls(prefix, 'booking-page')}>
      <section className={cls(prefix, 'booking-state')} role="status">
        <span className={prefix === 'pm' ? 'urban-detail-kicker' : 'pr-kicker'}>BOOKING_CONFIRMED</span>
        <h1>Your stay is confirmed</h1>
        <p>Booking reference #{booking?.id ?? bookingId}</p>
        {booking && (
          <>
            <p><strong>{booking.property?.title}</strong></p>
            <p>{booking.check_in_date} → {booking.check_out_date}</p>
            <p>Total paid: ${Number(booking.total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </>
        )}
        {error && <p className={cls(prefix, 'booking-warning')}>{error}</p>}
        <a href={themeLink('/explore')} className={primaryBtnClass}>Browse more properties</a>
      </section>
    </main>
  );
}
