'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/storefront-api';
import type { EventBookingPrefix } from '@/themes/events/shared/EventBookingPaymentPage';

interface EventBookingReservePageProps {
  classPrefix: EventBookingPrefix;
  themeLink: (path?: string) => string;
}

function cls(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`;
}

export default function EventBookingReservePage({
  classPrefix: prefix,
  themeLink,
}: EventBookingReservePageProps) {
  const searchParams = useSearchParams();
  const { user, loading: authLoading, login, register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState(searchParams.get('email') ?? '');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState(searchParams.get('full_name') ?? '');

  const eventId = Number(searchParams.get('event_id'));
  const occurrenceId = Number(searchParams.get('event_occurrence_id'));
  const ticketTypeId = Number(searchParams.get('event_ticket_type_id'));
  const quantity = Number(searchParams.get('quantity') ?? '1');
  const fullName = searchParams.get('full_name') ?? '';
  const email = searchParams.get('email') ?? '';
  const phone = searchParams.get('phone') ?? '';

  useEffect(() => {
    if (!user || !eventId || !occurrenceId || !ticketTypeId || !fullName || !email) {
      return;
    }

    let cancelled = false;

    async function createBooking() {
      setBusy(true);
      setError(null);

      try {
        const booking = await api.createEventBooking(eventId, {
          event_occurrence_id: occurrenceId,
          event_ticket_type_id: ticketTypeId,
          quantity,
          name: fullName,
          email,
          phone: phone || undefined,
        });

        if (!cancelled) {
          if (booking.status === 'confirmed') {
            window.location.assign(themeLink(`/booking/confirmation/${booking.id}`));
            return;
          }

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
  }, [user, eventId, occurrenceId, ticketTypeId, quantity, fullName, email, phone, themeLink]);

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
        <p>Preparing your ticket reservation...</p>
      </main>
    );
  }

  if (!eventId || !occurrenceId || !ticketTypeId || !fullName || !email) {
    return (
      <main className={cls(prefix, 'booking-page')}>
        <p>Missing booking details. Return to the event page and try again.</p>
        <a href={themeLink('/explore')} className="ec-btn-primary">Browse events</a>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={cls(prefix, 'booking-page')}>
        <header className={cls(prefix, 'booking-header')}>
          <h1>Sign in to reserve tickets</h1>
          <p>{quantity} ticket{quantity === 1 ? '' : 's'}</p>
        </header>
        <form className={cls(prefix, 'booking-form')} onSubmit={handleAuthSubmit}>
          <div className={cls(prefix, 'booking-auth-toggle')}>
            <button type="button" className="ec-btn-primary" onClick={() => setAuthMode('login')} disabled={authMode === 'login'}>Login</button>
            <button type="button" className="ec-btn-primary" onClick={() => setAuthMode('register')} disabled={authMode === 'register'}>Register</button>
          </div>
          {authMode === 'register' && (
            <label>Full name<input value={authName} onChange={(e) => setAuthName(e.target.value)} required /></label>
          )}
          <label>Email<input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required /></label>
          <label>Password<input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required /></label>
          {error && <p role="alert" className={cls(prefix, 'booking-error')}>{error}</p>}
          <button type="submit" className="ec-btn-primary" disabled={busy}>
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
