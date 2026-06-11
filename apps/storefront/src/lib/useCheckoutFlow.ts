'use client';

import { useEffect, useRef, useState } from 'react';
import type { CheckoutContext } from '@sellio/types';
import { useAuth } from '@/components/auth/AuthProvider';
import type { StripeCardFormHandle } from '@/components/checkout/StripeCardForm';
import { api } from '@/lib/storefront-api';
import { syncLocalCartToServer } from '@/lib/storefront-cart';

export function useCheckoutFlow(themeLink: (path?: string) => string) {
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

    async function loadContext() {
      setLoading(true);
      setError(null);

      try {
        await syncLocalCartToServer();
        const checkoutContext = await api.getCheckoutContext();
        setContext(checkoutContext);
        setPaymentMethod(checkoutContext.gateways[0]?.slug ?? 'stripe');
      } catch (loadError: unknown) {
        const axiosError = loadError as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message ?? 'Unable to load checkout.');
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

      const result = await api.processCheckout(paymentMethod, {
        shipping_name: shippingName,
        shipping_address: shippingAddress,
        shipping_city: shippingCity,
        shipping_state: shippingState || undefined,
        shipping_zip: shippingZip,
        shipping_country: shippingCountry,
        payment_method: paymentMethod,
        payment_token: paymentToken,
        return_url: `${window.location.origin}${themeLink('/checkout/confirm')}`,
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

  return {
    stripeRef,
    user,
    authLoading,
    context,
    loading,
    submitting,
    error,
    stripeError,
    setStripeError,
    authMode,
    setAuthMode,
    authEmail,
    setAuthEmail,
    authPassword,
    setAuthPassword,
    authName,
    setAuthName,
    authBusy,
    shippingName,
    setShippingName,
    shippingAddress,
    setShippingAddress,
    shippingCity,
    setShippingCity,
    shippingState,
    setShippingState,
    shippingZip,
    setShippingZip,
    shippingCountry,
    setShippingCountry,
    paymentMethod,
    setPaymentMethod,
    handleAuthSubmit,
    handleCheckoutSubmit,
  };
}
