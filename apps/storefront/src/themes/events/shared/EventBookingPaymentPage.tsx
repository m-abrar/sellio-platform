'use client';

import React from 'react';
import { CheckoutPaymentSection } from '@/components/checkout/CheckoutPaymentSection';
import { useEventBookingPayment } from '@/lib/useEventBookingPayment';

export type EventBookingPrefix = 'ecc';

interface EventBookingPaymentPageProps {
  bookingId: number;
  classPrefix: EventBookingPrefix;
  themeLink: (path?: string) => string;
}

function cls(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`;
}

export default function EventBookingPaymentPage({
  bookingId,
  classPrefix: prefix,
  themeLink,
}: EventBookingPaymentPageProps) {
  const payment = useEventBookingPayment(bookingId, themeLink);

  if (payment.authLoading || payment.loading) {
    return (
      <main className={cls(prefix, 'booking-page')}>
        <p>Preparing ticket payment...</p>
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
            <button type="button" className="ec-btn-primary" onClick={() => payment.setAuthMode('login')} disabled={payment.authMode === 'login'}>Login</button>
            <button type="button" className="ec-btn-primary" onClick={() => payment.setAuthMode('register')} disabled={payment.authMode === 'register'}>Register</button>
          </div>
          {payment.authMode === 'register' && (
            <label>Full name<input value={payment.authName} onChange={(e) => payment.setAuthName(e.target.value)} required /></label>
          )}
          <label>Email<input type="email" value={payment.authEmail} onChange={(e) => payment.setAuthEmail(e.target.value)} required /></label>
          <label>Password<input type="password" value={payment.authPassword} onChange={(e) => payment.setAuthPassword(e.target.value)} required /></label>
          {payment.error && <p role="alert" className={cls(prefix, 'booking-error')}>{payment.error}</p>}
          <button type="submit" className="ec-btn-primary" disabled={payment.authBusy}>
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
  const paymentTotal = payment.context.payment_total;

  return (
    <main className={cls(prefix, 'booking-page')}>
      <header className={cls(prefix, 'booking-header')}>
        <a href={themeLink(`/product/${booking.event?.slug ?? ''}`)} className={cls(prefix, 'booking-back')}>
          ← Back to event
        </a>
        <span className="ecc-mono">TICKET_PAYMENT</span>
        <h1>Complete your registration</h1>
        <p>{booking.event?.title}</p>
        <p>{booking.ticket_type?.name} · {booking.quantity} ticket{booking.quantity === 1 ? '' : 's'}</p>
      </header>

      <form className={cls(prefix, 'booking-layout')} onSubmit={payment.handlePaymentSubmit}>
        <CheckoutPaymentSection
          className={cls(prefix, 'booking-panel')}
          title="Payment"
          subtitle="Secure ticket payment powered by your selected gateway."
          gateways={payment.context.gateways}
          paymentMethod={payment.paymentMethod}
          onPaymentMethodChange={payment.setPaymentMethod}
          stripePublishableKey={payment.context.stripe_publishable_key}
          stripeEnabled={stripeEnabled}
          cardholderName={booking.event?.title ?? ''}
          stripeRef={payment.stripeRef}
          onStripeError={payment.setStripeError}
        />

        <aside className={cls(prefix, 'booking-summary')}>
          <h2>Booking total</h2>
          <div className={cls(prefix, 'booking-summary-total')}>
            <span>Total due</span>
            <strong>${Number(paymentTotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </div>
          {(payment.error || payment.stripeError) && (
            <p role="alert" className={cls(prefix, 'booking-error')}>{payment.error || payment.stripeError}</p>
          )}
          <button type="submit" className="ec-btn-primary" disabled={payment.submitting}>
            {payment.submitting ? 'Processing...' : 'Pay and confirm tickets'}
          </button>
        </aside>
      </form>
    </main>
  );
}
