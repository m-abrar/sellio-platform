'use client';

import React from 'react';
import { StripeCardForm } from '@/components/checkout/StripeCardForm';
import { useCheckoutFlow } from '@/lib/useCheckoutFlow';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import './subpages.css';

export type UnifiedCheckoutPageProps = {
  eyebrow?: string;
  title?: string;
  primaryButtonClass?: string;
};

export default function UnifiedCheckoutPage({
  eyebrow = 'SECURE_CHECKOUT',
  title = 'Checkout',
  primaryButtonClass = 'uni-btn-primary',
}: UnifiedCheckoutPageProps) {
  const themeLink = useUnifiedThemeLink();
  const checkout = useCheckoutFlow(themeLink);

  if (checkout.authLoading || checkout.loading) {
    return (
      <main className="uni-cart-page">
        <p style={{ color: '#64748b' }}>Preparing secure checkout...</p>
      </main>
    );
  }

  if (!checkout.user) {
    return (
      <main className="uni-cart-page">
        <div className="uni-cart-header">
          <div className="uni-mono" style={{ color: '#2563eb', marginBottom: '1rem' }}>AUTH_REQUIRED</div>
          <h1>Sign in to checkout</h1>
        </div>

        <form className="uni-checkout-form" onSubmit={checkout.handleAuthSubmit}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <button type="button" className={primaryButtonClass} onClick={() => checkout.setAuthMode('login')} disabled={checkout.authMode === 'login'}>
              Login
            </button>
            <button type="button" className={primaryButtonClass} onClick={() => checkout.setAuthMode('register')} disabled={checkout.authMode === 'register'}>
              Register
            </button>
          </div>

          {checkout.authMode === 'register' && (
            <label>
              Full name
              <input value={checkout.authName} onChange={(e) => checkout.setAuthName(e.target.value)} required />
            </label>
          )}

          <label>
            Email
            <input type="email" value={checkout.authEmail} onChange={(e) => checkout.setAuthEmail(e.target.value)} required />
          </label>

          <label>
            Password
            <input type="password" value={checkout.authPassword} onChange={(e) => checkout.setAuthPassword(e.target.value)} required />
          </label>

          {checkout.error && <p role="alert" style={{ color: '#dc2626' }}>{checkout.error}</p>}

          <button type="submit" className={primaryButtonClass} disabled={checkout.authBusy}>
            {checkout.authBusy ? 'PLEASE WAIT...' : checkout.authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>
      </main>
    );
  }

  if (!checkout.context || checkout.context.cart.items.length === 0) {
    return (
      <main className="uni-cart-page">
        <section className="uni-cart-state" role="status">
          <h1>Your cart is empty</h1>
          <p>Add products before proceeding to checkout.</p>
          <a href={themeLink('/explore')} className={primaryButtonClass}>Browse Directory</a>
        </section>
      </main>
    );
  }

  const total = checkout.context.order_preview.amount;
  const stripeEnabled = Boolean(checkout.context.stripe_publishable_key);

  return (
    <main className="uni-cart-page">
      <div className="uni-cart-header">
        <div className="uni-mono" style={{ color: '#2563eb', marginBottom: '1rem' }}>{eyebrow}</div>
        <h1>{title}</h1>
      </div>

      <form className="uni-checkout-form" onSubmit={checkout.handleCheckoutSubmit}>
        <section className="uni-checkout-section">
          <h2>Shipping details</h2>
          <label>Full name<input value={checkout.shippingName} onChange={(e) => checkout.setShippingName(e.target.value)} required /></label>
          <label>Address<input value={checkout.shippingAddress} onChange={(e) => checkout.setShippingAddress(e.target.value)} required /></label>
          <label>City<input value={checkout.shippingCity} onChange={(e) => checkout.setShippingCity(e.target.value)} required /></label>
          <label>State / Region<input value={checkout.shippingState} onChange={(e) => checkout.setShippingState(e.target.value)} /></label>
          <label>Postal code<input value={checkout.shippingZip} onChange={(e) => checkout.setShippingZip(e.target.value)} required /></label>
          <label>Country<input value={checkout.shippingCountry} onChange={(e) => checkout.setShippingCountry(e.target.value)} required /></label>
        </section>

        <section className="uni-checkout-section">
          <h2>Payment method</h2>
          <select value={checkout.paymentMethod} onChange={(e) => checkout.setPaymentMethod(e.target.value)}>
            {checkout.context.gateways.map((gateway) => (
              <option key={gateway.slug} value={gateway.slug}>{gateway.title}</option>
            ))}
            {!checkout.context.gateways.length && <option value="bank_transfer">Bank transfer</option>}
          </select>

          {checkout.paymentMethod === 'stripe' && stripeEnabled && (
            <StripeCardForm
              ref={checkout.stripeRef}
              publishableKey={checkout.context.stripe_publishable_key!}
              cardholderName={checkout.shippingName}
              onError={checkout.setStripeError}
            />
          )}

          {checkout.paymentMethod === 'stripe' && !stripeEnabled && (
            <p style={{ color: '#b45309' }}>Stripe is not configured. Choose another payment method or contact support.</p>
          )}
        </section>

        <aside className="uni-cart-summary">
          <h2>Order total</h2>
          <div className="uni-cart-summary-total">
            <span>Total</span>
            <strong>{checkout.context.cart.currency_symbol}{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </div>
          {(checkout.error || checkout.stripeError) && <p role="alert" style={{ color: '#dc2626' }}>{checkout.error || checkout.stripeError}</p>}
          <button type="submit" className={primaryButtonClass} disabled={checkout.submitting}>
            {checkout.submitting ? 'PROCESSING...' : 'PLACE ORDER'}
          </button>
        </aside>
      </form>
    </main>
  );
}
