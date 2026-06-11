'use client';

import { useEffect, useRef, useState } from 'react';
import type { EventBookingPaymentContext } from '@sellio/types';
import { useAuth } from '@/components/auth/AuthProvider';
import type { StripeCardFormHandle } from '@/components/checkout/StripeCardForm';
import { api } from '@/lib/storefront-api';

export function useEventBookingPayment(
  bookingId: number,
  themeLink: (path?: string) => string,
) {
  const { user, loading: authLoading, login, register } = useAuth();
  const stripeRef = useRef<StripeCardFormHandle>(null);

  const [context, setContext] = useState<EventBookingPaymentContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  useEffect(() => {
    if (!user || !bookingId) {
      setLoading(false);
      return;
    }

    async function loadContext() {
      setLoading(true);
      setError(null);

      try {
        const paymentContext = await api.getEventBookingPaymentContext(bookingId);
        setContext(paymentContext);
        setPaymentMethod(paymentContext.gateways[0]?.slug ?? 'stripe');
      } catch (loadError: unknown) {
        const axiosError = loadError as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message ?? 'Unable to load booking payment.');
      } finally {
        setLoading(false);
      }
    }

    loadContext();
  }, [user, bookingId]);

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

  const handlePaymentSubmit = async (event: React.FormEvent) => {
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

      const result = await api.payEventBooking(bookingId, paymentMethod, {
        payment_method: paymentMethod,
        payment_token: paymentToken,
        return_url: `${window.location.origin}${themeLink('/booking/confirm')}`,
      });

      if (result.status === 'pending_auth' && result.redirect_url) {
        window.location.assign(result.redirect_url);
        return;
      }

      if (result.booking?.id) {
        window.location.assign(themeLink(`/booking/confirmation/${result.booking.id}`));
        return;
      }

      setError(result.message ?? 'Payment could not be completed.');
    } catch (paymentError: unknown) {
      const axiosError = paymentError as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message ?? 'Payment failed.');
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
    paymentMethod,
    setPaymentMethod,
    handleAuthSubmit,
    handlePaymentSubmit,
  };
}
