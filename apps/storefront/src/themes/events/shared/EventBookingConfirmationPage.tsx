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

function isConfirmedStatus(status?: string): boolean {
  return status === 'confirmed' || status === 'paid';
}

function formatOccurrenceDate(iso?: string | null): string {
  if (!iso) {
    return 'Date TBA';
  }

  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function ConfirmationSkeleton({ prefix }: { prefix: string }) {
  return (
    <div className={cls(prefix, 'booking-confirm')}>
      <div className={`${cls(prefix, 'booking-confirm-hero')} ${cls(prefix, 'booking-confirm-hero--loading')}`}>
        <div className="ecc-shimmer" style={{ width: '4.5rem', height: '4.5rem', borderRadius: '999px', margin: '0 auto 1.25rem' }} />
        <div className="ecc-shimmer" style={{ width: '180px', height: '14px', margin: '0 auto' }} />
        <div className="ecc-shimmer" style={{ width: 'min(420px, 90%)', height: '42px', margin: '1rem auto 0.75rem' }} />
        <div className="ecc-shimmer" style={{ width: 'min(520px, 95%)', height: '18px', margin: '0 auto' }} />
      </div>
      <div className={cls(prefix, 'booking-confirm-layout')}>
        <div className={`${cls(prefix, 'booking-confirm-summary')} ${cls(prefix, 'booking-confirm-panel--loading')}`}>
          <div className="ecc-shimmer" style={{ width: '140px', height: '16px', marginBottom: '1.5rem' }} />
          <div className="ecc-shimmer" style={{ width: '100%', height: '88px', borderRadius: '12px', marginBottom: '1.25rem' }} />
          {[1, 2, 3, 4].map((row) => (
            <div key={row} className="ecc-shimmer" style={{ width: '100%', height: '20px', marginBottom: '0.85rem' }} />
          ))}
        </div>
        <div className={`${cls(prefix, 'booking-confirm-actions')} ${cls(prefix, 'booking-confirm-panel--loading')}`}>
          <div className="ecc-shimmer" style={{ width: '120px', height: '16px', marginBottom: '1rem' }} />
          <div className="ecc-shimmer" style={{ width: '100%', height: '48px', marginBottom: '0.75rem' }} />
          <div className="ecc-shimmer" style={{ width: '100%', height: '48px' }} />
        </div>
      </div>
    </div>
  );
}

export default function EventBookingConfirmationPage({
  bookingId,
  classPrefix: prefix,
  themeLink,
}: EventBookingConfirmationPageProps) {
  const { user, loading: authLoading } = useAuth();
  const [booking, setBooking] = useState<EventBookingRecord | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !bookingId) {
      setLoadingBooking(false);
      return;
    }

    setLoadingBooking(true);
    api
      .getEventBooking(bookingId)
      .then((record) => {
        setBooking(record);
        setError(null);
      })
      .catch(() => setError('Unable to load booking details.'))
      .finally(() => setLoadingBooking(false));
  }, [user, bookingId]);

  if (authLoading || (user && loadingBooking)) {
    return (
      <main className={cls(prefix, 'booking-page')}>
        <ConfirmationSkeleton prefix={prefix} />
      </main>
    );
  }

  if (!user) {
    return (
      <main className={cls(prefix, 'booking-page')}>
        <div className={cls(prefix, 'booking-confirm')}>
          <section className={cls(prefix, 'booking-state')} role="status">
            <div className={cls(prefix, 'booking-confirm-icon')}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 11V7a4 4 0 1 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="ecc-mono">SIGN_IN_REQUIRED</span>
            <h1>Sign in to view your tickets</h1>
            <p className={cls(prefix, 'booking-confirm-lead')}>
              Your booking confirmation is linked to your account. Sign in on the payment page to continue.
            </p>
            <a href={themeLink(`/booking/${bookingId}`)} className={`ec-btn-primary ${cls(prefix, 'booking-confirm-cta')}`}>
              Return to payment
            </a>
          </section>
        </div>
      </main>
    );
  }

  const confirmed = isConfirmedStatus(booking?.status);
  const eventSlug = booking?.event?.slug;
  const eventImage = booking?.event?.primary_image_url;

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

          <span className="ecc-mono">{confirmed ? 'TICKETS_CONFIRMED' : 'REGISTRATION_RECEIVED'}</span>
          <h1>{confirmed ? 'Your delegate pass is confirmed' : 'Registration saved'}</h1>
          <p className={cls(prefix, 'booking-confirm-lead')}>
            {confirmed
              ? 'You are registered for the convention. A confirmation email with your ticket details is on its way.'
              : 'Your registration is saved. Complete payment to secure your delegate pass.'}
          </p>

          <div className={cls(prefix, 'booking-confirm-ref')}>
            <span>Booking reference</span>
            <strong>#{booking?.id ?? bookingId}</strong>
          </div>
        </header>

        <div className={cls(prefix, 'booking-confirm-layout')}>
          <section className={cls(prefix, 'booking-confirm-summary')} aria-label="Ticket summary">
            <div className={cls(prefix, 'booking-confirm-summary-head')}>
              <h2>Ticket summary</h2>
              {booking?.status && (
                <span
                  className={`${cls(prefix, 'booking-confirm-status')}${confirmed ? ` ${cls(prefix, 'booking-confirm-status--confirmed')}` : ''}`}
                >
                  {booking.status}
                </span>
              )}
            </div>

            {eventImage && (
              <div className={cls(prefix, 'booking-confirm-event')}>
                <img src={eventImage} alt="" />
                {booking?.event?.title && (
                  <div>
                    <span className="ecc-mono">CONVENTION</span>
                    <strong>{booking.event.title}</strong>
                  </div>
                )}
              </div>
            )}

            {booking ? (
              <>
                {!eventImage && booking.event?.title && (
                  <div className={cls(prefix, 'booking-confirm-event-title')}>
                    <span className="ecc-mono">CONVENTION</span>
                    <strong>{booking.event.title}</strong>
                  </div>
                )}

                <dl className={cls(prefix, 'booking-confirm-receipt')}>
                  <div>
                    <dt>Ticket type</dt>
                    <dd>{booking.ticket_type?.name || 'Delegate pass'}</dd>
                  </div>
                  <div>
                    <dt>Quantity</dt>
                    <dd>
                      {booking.quantity} ticket{booking.quantity === 1 ? '' : 's'}
                    </dd>
                  </div>
                  <div>
                    <dt>Event date</dt>
                    <dd>{formatOccurrenceDate(booking.occurrence?.start_date_time)}</dd>
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
              <p className={cls(prefix, 'booking-confirm-loading')}>Loading ticket details…</p>
            )}

            {error && <p className={cls(prefix, 'booking-error')}>{error}</p>}
          </section>

          <aside className={cls(prefix, 'booking-confirm-actions')} aria-label="Next steps">
            <h2>What&apos;s next</h2>
            <p>
              {confirmed
                ? 'Save your reference number and bring a valid ID to check in at the venue.'
                : 'Return to payment to finalize your delegate registration.'}
            </p>

            {!confirmed && (
              <a href={themeLink(`/booking/${bookingId}`)} className={`ec-btn-primary ${cls(prefix, 'booking-confirm-cta')}`}>
                Complete payment
              </a>
            )}

            <a href={themeLink('/explore')} className={`ec-btn-primary ${cls(prefix, 'booking-confirm-cta')}`}>
              Browse more events
            </a>

            {eventSlug && (
              <a href={themeLink(`/product/${eventSlug}`)} className={`ec-btn-outline ${cls(prefix, 'booking-confirm-cta')}`}>
                View event details
              </a>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
