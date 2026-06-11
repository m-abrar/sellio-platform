'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { CheckoutContext } from '@sellio/types';
import { useAuth } from '@/components/auth/AuthProvider';
import { StripeCardForm, type StripeCardFormHandle } from '@/components/checkout/StripeCardForm';
import { api } from '@/lib/storefront-api';
import { readCart, writeCart } from '@/themes/unifieds/shared/cart';
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
  const { user, loading: authLoading, login, register } = useAuth();
  const stripeRef = useRef<StripeCardFormHandle>(null);

  const [context, setContext] = useState<CheckoutContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  const [shippingName, setShippingName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [shippingCountry, setShippingCountry] = useState('United States');
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  useEffect(() => {
    if (user?.name && !shippingName) {
      setShippingName(user.name);
    }
  }, [user, shippingName]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function syncLocalCartToServer() {
      const localItems = readCart();

      for (const item of localItems) {
        await api.addToCart(item.product.id, item.quantity);
      }

      if (localItems.length > 0) {
        writeCart([]);
      }
    }

    async function loadContext() {
      setLoading(true);
      setError(null);

      try {
        await syncLocalCartToServer();
        const checkoutContext = await api.getCheckoutContext();
        setContext(checkoutContext);
        const defaultGateway = checkoutContext.gateways[0]?.slug ?? 'stripe';
        setPaymentMethod(defaultGateway);
      } catch (loadError: unknown) {
        const message = loadError instanceof Error ? loadError.message : 'Unable to load checkout.';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadContext();
  }, [user]);

  const handleAuthSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthBusy(true);
    setError(null);

    try {
      if (authMode === 'login') {
        await login(authEmail, authPassword);
      } else {
        await register(authName, authEmail, authPassword);
      }
    } catch (authError: unknown) {
      const axiosError = authError as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message ?? 'Authentication failed.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleCheckoutSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!context) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let paymentToken: string | undefined;

      if (paymentMethod === 'stripe' && context.stripe_publishable_key) {
        paymentToken = await stripeRef.current?.createPaymentMethod();
      }

      const returnUrl = `${window.location.origin}${themeLink('/checkout/confirm')}`;

      const result = await api.processCheckout(paymentMethod, {
        shipping_name: shippingName,
        shipping_address: shippingAddress,
        shipping_city: shippingCity,
        shipping_state: shippingState || undefined,
        shipping_zip: shippingZip,
        shipping_country: shippingCountry,
        payment_method: paymentMethod,
        payment_token: paymentToken,
        return_url: returnUrl,
      });

      if (result.status === 'pending_auth' && result.redirect_url) {
        window.location.assign(result.redirect_url);
        return;
      }

      if (result.order?.order_number) {
        window.location.assign(themeLink(`/checkout/confirmation/${result.order.order_number}`));
        return;
      }

      setError(result.message ?? 'Checkout could not be completed.');
    } catch (checkoutError: unknown) {
      const axiosError = checkoutError as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message ?? 'Checkout failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="uni-cart-page">
        <p style={{ color: '#64748b' }}>Preparing secure checkout...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="uni-cart-page">
        <div className="uni-cart-header">
          <div className="uni-mono" style={{ color: '#2563eb', marginBottom: '1rem' }}>AUTH_REQUIRED</div>
          <h1>Sign in to checkout</h1>
        </div>

        <form className="uni-checkout-form" onSubmit={handleAuthSubmit}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <button type="button" className={primaryButtonClass} onClick={() => setAuthMode('login')} disabled={authMode === 'login'}>
              Login
            </button>
            <button type="button" className={primaryButtonClass} onClick={() => setAuthMode('register')} disabled={authMode === 'register'}>
              Register
            </button>
          </div>

          {authMode === 'register' && (
            <label>
              Full name
              <input value={authName} onChange={(e) => setAuthName(e.target.value)} required />
            </label>
          )}

          <label>
            Email
            <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required />
          </label>

          <label>
            Password
            <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required />
          </label>

          {error && <p role="alert" style={{ color: '#dc2626' }}>{error}</p>}

          <button type="submit" className={primaryButtonClass} disabled={authBusy}>
            {authBusy ? 'PLEASE WAIT...' : authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>
      </main>
    );
  }

  if (!context || context.cart.items.length === 0) {
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

  const total = context.order_preview.amount;
  const stripeEnabled = Boolean(context.stripe_publishable_key);

  return (
    <main className="uni-cart-page">
      <div className="uni-cart-header">
        <div className="uni-mono" style={{ color: '#2563eb', marginBottom: '1rem' }}>{eyebrow}</div>
        <h1>{title}</h1>
      </div>

      <form className="uni-checkout-form" onSubmit={handleCheckoutSubmit}>
        <section className="uni-checkout-section">
          <h2>Shipping details</h2>
          <label>Full name<input value={shippingName} onChange={(e) => setShippingName(e.target.value)} required /></label>
          <label>Address<input value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} required /></label>
          <label>City<input value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} required /></label>
          <label>State / Region<input value={shippingState} onChange={(e) => setShippingState(e.target.value)} /></label>
          <label>Postal code<input value={shippingZip} onChange={(e) => setShippingZip(e.target.value)} required /></label>
          <label>Country<input value={shippingCountry} onChange={(e) => setShippingCountry(e.target.value)} required /></label>
        </section>

        <section className="uni-checkout-section">
          <h2>Payment method</h2>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            {context.gateways.map((gateway) => (
              <option key={gateway.slug} value={gateway.slug}>{gateway.title}</option>
            ))}
            {!context.gateways.length && <option value="bank_transfer">Bank transfer</option>}
          </select>

          {paymentMethod === 'stripe' && stripeEnabled && (
            <StripeCardForm
              ref={stripeRef}
              publishableKey={context.stripe_publishable_key!}
              cardholderName={shippingName}
              onError={setStripeError}
            />
          )}

          {paymentMethod === 'stripe' && !stripeEnabled && (
            <p style={{ color: '#b45309' }}>Stripe is not configured. Choose another payment method or contact support.</p>
          )}
        </section>

        <aside className="uni-cart-summary">
          <h2>Order total</h2>
          <div className="uni-cart-summary-total">
            <span>Total</span>
            <strong>{context.cart.currency_symbol}{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </div>
          {(error || stripeError) && <p role="alert" style={{ color: '#dc2626' }}>{error || stripeError}</p>}
          <button type="submit" className={primaryButtonClass} disabled={submitting}>
            {submitting ? 'PROCESSING...' : 'PLACE ORDER'}
          </button>
        </aside>
      </form>
    </main>
  );
}
