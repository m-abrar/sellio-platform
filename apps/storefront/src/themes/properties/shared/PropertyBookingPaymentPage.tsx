'use client';

import React from 'react';
import { CheckoutPaymentSection } from '@/components/checkout/CheckoutPaymentSection';
import { usePropertyBookingPayment } from '@/lib/usePropertyBookingPayment';

export type PropertyBookingPrefix = 'pr' | 'pm';

interface PropertyBookingPaymentPageProps {
  bookingId: number;
  classPrefix: PropertyBookingPrefix;
  themeLink: (path?: string) => string;
}

function cls(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`;
}

export default function PropertyBookingPaymentPage({
  bookingId,
  classPrefix: prefix,
  themeLink,
}: PropertyBookingPaymentPageProps) {
  const payment = usePropertyBookingPayment(bookingId, themeLink);
  const primaryBtnClass = prefix === 'pm' ? 'urban-btn-primary' : 'pr-btn-primary';

  if (payment.authLoading || payment.loading) {
    return (
      <main className={cls(prefix, 'booking-page')}>
        <p>Preparing booking payment...</p>
      </main>
    );
  }

  if (!payment.user) {
    return (
      <main className={cls(prefix, 'booking-page')}>
        <header className={cls(prefix, 'booking-header')}>
          <h1>Sign in to complete your booking</h1>
        </header>
        <form className={cls(prefix, 'booking-form')} onSubmit={payment.handleAuthSubmit}>
          <div className={cls(prefix, 'booking-auth-toggle')}>
            <button type="button" className={primaryBtnClass} onClick={() => payment.setAuthMode('login')} disabled={payment.authMode === 'login'}>Login</button>
            <button type="button" className={primaryBtnClass} onClick={() => payment.setAuthMode('register')} disabled={payment.authMode === 'register'}>Register</button>
          </div>
          {payment.authMode === 'register' && (
            <label>Full name<input value={payment.authName} onChange={(e) => payment.setAuthName(e.target.value)} required /></label>
          )}
          <label>Email<input type="email" value={payment.authEmail} onChange={(e) => payment.setAuthEmail(e.target.value)} required /></label>
          <label>Password<input type="password" value={payment.authPassword} onChange={(e) => payment.setAuthPassword(e.target.value)} required /></label>
          {payment.error && <p role="alert" className={cls(prefix, 'booking-error')}>{payment.error}</p>}
          <button type="submit" className={primaryBtnClass} disabled={payment.authBusy}>
            {payment.authBusy ? 'Please wait...' : payment.authMode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </main>
    );
  }

  if (!payment.context) {
    return (
      <main className={cls(prefix, 'booking-page')}>
        <p>{payment.error ?? 'Booking payment could not be loaded.'}</p>
      </main>
    );
  }

  const booking = payment.context.booking;
  const stripeEnabled = Boolean(payment.context.stripe_publishable_key);

  return (
    <main className={cls(prefix, 'booking-page')}>
      <header className={cls(prefix, 'booking-header')}>
        <a href={themeLink(`/product/${booking.property?.slug ?? ''}`)} className={cls(prefix, 'detail-back')}>
          ← Back to property
        </a>
        <span className={prefix === 'pm' ? 'urban-detail-kicker' : 'pr-kicker'}>BOOKING_PAYMENT</span>
        <h1>Complete your reservation</h1>
        <p>{booking.property?.title}</p>
        <p>{booking.check_in_date} → {booking.check_out_date} · {booking.guests} guests</p>
      </header>

      <form className={cls(prefix, 'booking-layout')} onSubmit={payment.handlePaymentSubmit}>
        <CheckoutPaymentSection
          className={cls(prefix, 'booking-panel')}
          title="Payment"
          subtitle="Complete your reservation with a secure payment."
          gateways={payment.context.gateways}
          paymentMethod={payment.paymentMethod}
          onPaymentMethodChange={payment.setPaymentMethod}
          stripePublishableKey={payment.context.stripe_publishable_key}
          stripeEnabled={stripeEnabled}
          cardholderName={booking.full_name ?? ''}
          stripeRef={payment.stripeRef}
          onStripeError={payment.setStripeError}
        />

        <aside className={cls(prefix, 'booking-summary')}>
          <h2>Booking total</h2>
          <div className={cls(prefix, 'booking-summary-total')}>
            <span>Total due</span>
            <strong>${Number(booking.total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </div>
          {(payment.error || payment.stripeError) && (
            <p role="alert" className={cls(prefix, 'booking-error')}>{payment.error || payment.stripeError}</p>
          )}
          <button type="submit" className={primaryBtnClass} disabled={payment.submitting}>
            {payment.submitting ? 'Processing...' : 'Pay and confirm booking'}
          </button>
        </aside>
      </form>
    </main>
  );
}
