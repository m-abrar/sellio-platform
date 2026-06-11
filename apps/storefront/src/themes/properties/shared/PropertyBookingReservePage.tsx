'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/storefront-api';
import type { PropertyBookingPrefix } from '@/themes/properties/shared/PropertyBookingPaymentPage';

interface PropertyBookingReservePageProps {
  classPrefix: PropertyBookingPrefix;
  themeLink: (path?: string) => string;
}

function cls(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`;
}

export default function PropertyBookingReservePage({
  classPrefix: prefix,
  themeLink,
}: PropertyBookingReservePageProps) {
  const searchParams = useSearchParams();
  const { user, loading: authLoading, login, register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState(searchParams.get('email') ?? '');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState(searchParams.get('full_name') ?? '');

  const propertyId = Number(searchParams.get('property_id'));
  const checkIn = searchParams.get('check_in') ?? '';
  const checkOut = searchParams.get('check_out') ?? '';
  const guests = Number(searchParams.get('guests') ?? '2');
  const fullName = searchParams.get('full_name') ?? '';
  const email = searchParams.get('email') ?? '';
  const phone = searchParams.get('phone') ?? '';

  const primaryBtnClass = prefix === 'pm' ? 'urban-btn-primary' : 'pr-btn-primary';

  useEffect(() => {
    if (!user || !propertyId || !checkIn || !checkOut || !fullName || !email) {
      return;
    }

    let cancelled = false;

    async function createBooking() {
      setBusy(true);
      setError(null);

      try {
        const booking = await api.createPropertyBooking(propertyId, {
          check_in: checkIn,
          check_out: checkOut,
          guests,
          full_name: fullName,
          email,
          phone,
        });

        if (!cancelled) {
          window.location.assign(themeLink(`/booking/${booking.id}`));
        }
      } catch (createError: unknown) {
        if (!cancelled) {
          const axiosError = createError as { response?: { data?: { message?: string } } };
          setError(axiosError.response?.data?.message ?? 'Unable to create booking.');
          setBusy(false);
        }
      }
    }

    createBooking();

    return () => {
      cancelled = true;
    };
  }, [user, propertyId, checkIn, checkOut, guests, fullName, email, phone, themeLink]);

  const handleAuthSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
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
      setBusy(false);
    }
  };

  if (authLoading || (user && busy)) {
    return (
      <main className={cls(prefix, 'booking-page')}>
        <p>Preparing your reservation...</p>
      </main>
    );
  }

  if (!propertyId || !checkIn || !checkOut || !fullName || !email) {
    return (
      <main className={cls(prefix, 'booking-page')}>
        <p>Missing reservation details. Return to the property page and try again.</p>
        <a href={themeLink('/explore')} className={primaryBtnClass}>Browse properties</a>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={cls(prefix, 'booking-page')}>
        <header className={cls(prefix, 'booking-header')}>
          <h1>Sign in to reserve</h1>
          <p>{checkIn} → {checkOut} · {guests} guests</p>
        </header>
        <form className={cls(prefix, 'booking-form')} onSubmit={handleAuthSubmit}>
          <div className={cls(prefix, 'booking-auth-toggle')}>
            <button type="button" className={primaryBtnClass} onClick={() => setAuthMode('login')} disabled={authMode === 'login'}>Login</button>
            <button type="button" className={primaryBtnClass} onClick={() => setAuthMode('register')} disabled={authMode === 'register'}>Register</button>
          </div>
          {authMode === 'register' && (
            <label>Full name<input value={authName} onChange={(e) => setAuthName(e.target.value)} required /></label>
          )}
          <label>Email<input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required /></label>
          <label>Password<input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required /></label>
          {error && <p role="alert" className={cls(prefix, 'booking-error')}>{error}</p>}
          <button type="submit" className={primaryBtnClass} disabled={busy}>
            {busy ? 'Please wait...' : 'Continue to payment'}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className={cls(prefix, 'booking-page')}>
      <p>{error ?? 'Creating your booking...'}</p>
    </main>
  );
}
