'use client';

import React, { useEffect, useState } from 'react';
import type { PropertyBookingRecord } from '@sellio/types';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/storefront-api';
import {
  countBookingNights,
  formatBookingDateLong,
} from '@/themes/properties/shared/property-booking-utils';
import type { PropertyBookingPrefix } from '@/themes/properties/shared/PropertyBookingPaymentPage';

interface PropertyBookingConfirmationPageProps {
  bookingId: number;
  classPrefix: PropertyBookingPrefix;
  themeLink: (path?: string) => string;
}

function cls(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`;
}

function isConfirmedStatus(status?: string): boolean {
  return status === 'confirmed' || status === 'paid';
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
  const secondaryBtnClass = prefix === 'pm' ? 'urban-btn-secondary' : 'pr-btn-secondary';
  const kickerClass = prefix === 'pm' ? 'urban-detail-kicker' : 'pr-kicker';

  useEffect(() => {
    if (!user || !bookingId) {
      return;
    }

    api.getPropertyBooking(bookingId)
      .then(setBooking)
      .catch(() => setError('Unable to load booking details.'));
  }, [user, bookingId]);

  if (authLoading) {
    return (
      <main className={cls(prefix, 'booking-page')}>
        <div className={cls(prefix, 'booking-confirm')}>
          <p className={cls(prefix, 'booking-confirm-loading')}>Loading confirmation…</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={cls(prefix, 'booking-page')}>
        <div className={cls(prefix, 'booking-confirm')}>
          <section className={cls(prefix, 'booking-state')} role="status">
            <h1>Sign in required</h1>
            <p>Please sign in to view your booking confirmation.</p>
            <a href={themeLink(`/booking/${bookingId}`)} className={primaryBtnClass}>
              Return to payment
            </a>
          </section>
        </div>
      </main>
    );
  }

  const confirmed = isConfirmedStatus(booking?.status);
  const nights = booking
    ? (booking.duration_nights ?? countBookingNights(booking.check_in_date, booking.check_out_date))
    : 0;
  const propertySlug = booking?.property?.slug;
  const propertyImage = booking?.property?.primary_image_url;

  return (
    <main className={cls(prefix, 'booking-page')}>
      <div className={cls(prefix, 'booking-confirm')} role="status">
        <header className={cls(prefix, 'booking-confirm-hero')}>
          <div
            className={`${cls(prefix, 'booking-confirm-icon')}${confirmed ? ` ${cls(prefix, 'booking-confirm-icon--success')}` : ` ${cls(prefix, 'booking-confirm-icon--pending')}`}`}
            aria-hidden="true"
          >
            {confirmed ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </div>

          <span className={kickerClass}>
            {confirmed ? 'Reservation confirmed' : 'Reservation received'}
          </span>
          <h1>{confirmed ? 'Your stay is confirmed' : 'Almost there'}</h1>
          <p className={cls(prefix, 'booking-confirm-lead')}>
            {confirmed
              ? 'Pack your bags — your trip is on the calendar. A confirmation email is on its way.'
              : 'Your reservation is saved. Complete payment to secure these dates.'}
          </p>

          <div className={cls(prefix, 'booking-confirm-ref')}>
            <span>Booking reference</span>
            <strong>#{booking?.id ?? bookingId}</strong>
          </div>
        </header>

        <div className={cls(prefix, 'booking-confirm-layout')}>
          <section className={cls(prefix, 'booking-confirm-summary')} aria-label="Stay summary">
            <div className={cls(prefix, 'booking-confirm-summary-head')}>
              <h2>Stay summary</h2>
              {booking?.status && (
                <span className={`${cls(prefix, 'booking-confirm-status')}${confirmed ? ` ${cls(prefix, 'booking-confirm-status--confirmed')}` : ''}`}>
                  {booking.status}
                </span>
              )}
            </div>

            {propertyImage && (
              <div className={cls(prefix, 'booking-confirm-property')}>
                <img src={propertyImage} alt="" />
                {booking?.property?.title && (
                  <div>
                    <span className={kickerClass}>Property</span>
                    <strong>{booking.property.title}</strong>
                  </div>
                )}
              </div>
            )}

            {booking ? (
              <>
                {!propertyImage && booking.property?.title && (
                  <div className={cls(prefix, 'booking-confirm-property-title')}>
                    <span className={kickerClass}>Property</span>
                    <strong>{booking.property.title}</strong>
                  </div>
                )}

                <dl className={cls(prefix, 'booking-confirm-receipt')}>
                  <div>
                    <dt>Check-in</dt>
                    <dd>{formatBookingDateLong(booking.check_in_date)}</dd>
                  </div>
                  <div>
                    <dt>Check-out</dt>
                    <dd>{formatBookingDateLong(booking.check_out_date)}</dd>
                  </div>
                  <div>
                    <dt>Duration</dt>
                    <dd>{nights} night{nights === 1 ? '' : 's'}</dd>
                  </div>
                  <div>
                    <dt>Guests</dt>
                    <dd>{booking.guests}</dd>
                  </div>
                  <div className={cls(prefix, 'booking-confirm-receipt-total')}>
                    <dt>{confirmed ? 'Total paid' : 'Total due'}</dt>
                    <dd>
                      ${Number(booking.total_price).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </dd>
                  </div>
                </dl>
              </>
            ) : (
              <p className={cls(prefix, 'booking-confirm-loading')}>Loading stay details…</p>
            )}

            {error && <p className={cls(prefix, 'booking-error')}>{error}</p>}
          </section>

          <aside className={cls(prefix, 'booking-confirm-actions')} aria-label="Next steps">
            <h2>What&apos;s next</h2>
            <p>
              {confirmed
                ? 'Your host has been notified. Save your reference number for check-in.'
                : 'Return to payment to finalize your reservation.'}
            </p>

            {!confirmed && (
              <a href={themeLink(`/booking/${bookingId}`)} className={`${primaryBtnClass} ${cls(prefix, 'booking-confirm-cta')}`}>
                Complete payment
              </a>
            )}

            <a href={themeLink('/explore')} className={`${primaryBtnClass} ${cls(prefix, 'booking-confirm-cta')}`}>
              Browse more properties
            </a>

            {propertySlug && (
              <a href={themeLink(`/product/${propertySlug}`)} className={`${secondaryBtnClass} ${cls(prefix, 'booking-confirm-cta')}`}>
                View property
              </a>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
