'use client';

import React from 'react';
import { StripeCardForm } from '@/components/checkout/StripeCardForm';
import { useCheckoutFlow } from '@/lib/useCheckoutFlow';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';

export type EcommerceCheckoutPrefix = 'ed' | 'ef' | 'el' | 'ecl';

interface EcommerceCheckoutPageProps {
  classPrefix: EcommerceCheckoutPrefix;
  shell?: (content: React.ReactNode) => React.ReactNode;
}

function cls(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`;
}

export default function EcommerceCheckoutPage({ classPrefix: prefix, shell }: EcommerceCheckoutPageProps) {
  const themeLink = useEcommerceThemeLink();
  const checkout = useCheckoutFlow(themeLink);

  const monoClass = prefix === 'el' ? 'el-tech-font' : `${prefix}-mono`;
  const primaryBtnClass = prefix === 'el'
    ? 'el-btn el-btn-primary'
    : prefix === 'ecl'
      ? 'ecl-btn-gold'
      : `${prefix}-btn-primary`;

  if (checkout.authLoading || checkout.loading) {
    const loading = (
      <main className={cls(prefix, 'checkout-page')}>
        <p className={cls(prefix, 'checkout-loading')}>Preparing secure checkout...</p>
      </main>
    );
    return shell ? shell(loading) : loading;
  }

  if (!checkout.user) {
    const authView = (
      <main className={cls(prefix, 'checkout-page')}>
        <header className={cls(prefix, 'checkout-header')}>
          <div className={monoClass}>AUTH_REQUIRED</div>
          <h1>Sign in to checkout</h1>
          <p>Complete your purchase with a secure account session.</p>
        </header>

        <form className={cls(prefix, 'checkout-form')} onSubmit={checkout.handleAuthSubmit}>
          <div className={cls(prefix, 'checkout-auth-toggle')}>
            <button type="button" className={primaryBtnClass} onClick={() => checkout.setAuthMode('login')} disabled={checkout.authMode === 'login'}>
              Login
            </button>
            <button type="button" className={primaryBtnClass} onClick={() => checkout.setAuthMode('register')} disabled={checkout.authMode === 'register'}>
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

          {checkout.error && <p role="alert" className={cls(prefix, 'checkout-error')}>{checkout.error}</p>}

          <button type="submit" className={primaryBtnClass} disabled={checkout.authBusy}>
            {checkout.authBusy ? 'Please wait...' : checkout.authMode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </main>
    );
    return shell ? shell(authView) : authView;
  }

  if (!checkout.context || checkout.context.cart.items.length === 0) {
    const emptyView = (
      <main className={cls(prefix, 'checkout-page')}>
        <section className={cls(prefix, 'checkout-state')} role="status">
          <h1>Your cart is empty</h1>
          <p>Add products before proceeding to checkout.</p>
          <a href={themeLink('/explore')} className={primaryBtnClass}>Browse collection</a>
        </section>
      </main>
    );
    return shell ? shell(emptyView) : emptyView;
  }

  const total = checkout.context.order_preview.amount;
  const stripeEnabled = Boolean(checkout.context.stripe_publishable_key);

  const content = (
    <main className={cls(prefix, 'checkout-page')}>
      <header className={cls(prefix, 'checkout-header')}>
        <a href={themeLink('/cart')} className={cls(prefix, 'detail-back')}>
          <span aria-hidden="true">←</span>
          Back to cart
        </a>
        <div className={monoClass}>SECURE_CHECKOUT</div>
        <h1>Checkout</h1>
        <p>Step 2 of 3 — shipping and payment</p>
      </header>

      <form className={cls(prefix, 'checkout-layout')} onSubmit={checkout.handleCheckoutSubmit}>
        <div className={cls(prefix, 'checkout-main')}>
          <section className={cls(prefix, 'checkout-panel')}>
            <h2>Shipping details</h2>
            <label>Full name<input value={checkout.shippingName} onChange={(e) => checkout.setShippingName(e.target.value)} required /></label>
            <label>Address<input value={checkout.shippingAddress} onChange={(e) => checkout.setShippingAddress(e.target.value)} required /></label>
            <div className={cls(prefix, 'checkout-grid')}>
              <label>City<input value={checkout.shippingCity} onChange={(e) => checkout.setShippingCity(e.target.value)} required /></label>
              <label>State<input value={checkout.shippingState} onChange={(e) => checkout.setShippingState(e.target.value)} /></label>
              <label>ZIP<input value={checkout.shippingZip} onChange={(e) => checkout.setShippingZip(e.target.value)} required /></label>
              <label>Country<input value={checkout.shippingCountry} onChange={(e) => checkout.setShippingCountry(e.target.value)} required /></label>
            </div>
          </section>

          <section className={cls(prefix, 'checkout-panel')}>
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
              <p className={cls(prefix, 'checkout-warning')}>Stripe is not configured. Choose another payment method.</p>
            )}
          </section>
        </div>

        <aside className={cls(prefix, 'checkout-summary')}>
          <h2>Order summary</h2>
          {checkout.context.cart.items.map((item) => (
            <div key={item.id} className={cls(prefix, 'checkout-summary-row')}>
              <span>{item.product?.title} (×{item.quantity})</span>
              <strong>
                {checkout.context!.cart.currency_symbol}
                {Number(item.total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </div>
          ))}
          <div className={cls(prefix, 'checkout-summary-total')}>
            <span>Total due</span>
            <strong>
              {checkout.context.cart.currency_symbol}
              {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>
          </div>
          {(checkout.error || checkout.stripeError) && (
            <p role="alert" className={cls(prefix, 'checkout-error')}>{checkout.error || checkout.stripeError}</p>
          )}
          <button type="submit" className={primaryBtnClass} disabled={checkout.submitting}>
            {checkout.submitting ? 'Processing...' : 'Complete payment'}
          </button>
        </aside>
      </form>
    </main>
  );

  return shell ? shell(content) : content;
}
