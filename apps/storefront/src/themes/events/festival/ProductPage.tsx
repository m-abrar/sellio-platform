'use client';

import React, { useEffect, useState } from 'react';
import type { EventListing } from '@sellio/types';
import { CatalogSyncAlert } from '@/themes/events/shared/CatalogSyncAlert';
import { fetchEventDetail, resolveEventFailure } from '@/themes/events/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/events/shared/useDemoFallbackAllowed';
import { redirectToEventBookingReserve } from '@/themes/events/shared/event-booking-utils';
import {
  getFirstEventTicketOption,
  type EventTicketOption,
} from '@/themes/events/shared/event-tickets';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';
import {
  formatEventDateShort,
  formatEventPrice,
  getEventLocationLabel,
  getFestivalEventImage,
} from '@/themes/events/shared/event-utils';

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = useEventsThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const [event, setEvent] = useState<EventListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', passes: '2' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<EventTicketOption | null>(null);

  useEffect(() => {
    async function loadEvent() {
      if (!slug) return;

      setLoading(true);
      setNotFound(false);
      const result = await fetchEventDetail(slug);

      if (result.ok && result.response.data) {
        setEvent(result.response.data);
        setSelectedTicket(
          getFirstEventTicketOption(result.response.meta?.ticket_data),
        );
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'Event not found or API returned no data.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveEventFailure(slug, allowDemo, 'festival');

        if (resolution.mode === 'demo') {
          setEvent(resolution.event);
          setUseFallback(true);
        } else if (resolution.mode === 'notFound') {
          setEvent(null);
          setNotFound(true);
        } else {
          setEvent(null);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadEvent();
  }, [slug, allowDemo]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event || !form.name || !form.email) {
      setFormError('Please fill in your name and email.');
      return;
    }

    setFormError(null);

    if (!useFallback) {
      if (!selectedTicket) {
        setFormError('No tickets are currently available for this event.');
        return;
      }

      redirectToEventBookingReserve(themeLink, {
        eventId: event.id,
        occurrenceId: selectedTicket.occurrenceId,
        ticketTypeId: selectedTicket.ticketTypeId,
        quantity: Number(form.passes) || 1,
        fullName: form.name,
        email: form.email,
      });
      return;
    }

    try {
      const stored = JSON.parse(localStorage.getItem('sellio_events_festival_rsvps') || '[]');
      stored.push({
        id: Date.now(),
        event_id: event.id,
        event_title: event.title,
        guest_name: form.name,
        guest_email: form.email,
        passes: form.passes,
        submitted_at: new Date().toISOString(),
      });
      localStorage.setItem('sellio_events_festival_rsvps', JSON.stringify(stored));
      setIsSubmitted(true);
      setForm({ name: '', email: '', passes: '2' });
    } catch (error) {
      console.error('Failed to persist RSVP:', error);
    }
  };

  if (loading) {
    return (
      <main className="eff-detail-page" aria-busy="true">
        <div className="eff-detail-skeleton eff-detail-hero-skeleton" />
        <div className="eff-detail-line eff-detail-line-title" />
      </main>
    );
  }

  if (notFound || (!event && !useFallback)) {
    return (
      <main className="eff-detail-page">
        <section className="eff-detail-state" role="status">
          <h2>Stage Sync Error</h2>
          <p>{apiError || 'Event not found.'}</p>
          <a href={themeLink('/')} className="eff-btn-primary">Return to Stages</a>
        </section>
      </main>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <main className="eff-detail-page">
      <a href={themeLink('/')} className="eff-detail-back">&larr; Back to Neon Stages</a>

      {useFallback && apiError && (
        <div className="eff-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="eff" />
        </div>
      )}
      {apiError && !useFallback && (
        <div className="eff-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="eff" />
        </div>
      )}

      <header className="eff-detail-hero">
        <img src={getFestivalEventImage(event)} alt={event.title} />
        <div className="eff-detail-hero-overlay">
          <div className="eff-detail-kicker">{event.specs?.category || 'Festival Stage'}</div>
          <h1>{event.title}</h1>
          <div className="eff-detail-meta">
            <span>{formatEventDateShort(event)}</span>
            <span>{getEventLocationLabel(event)}</span>
            <span>{formatEventPrice(event)}</span>
          </div>
        </div>
      </header>
      <section className="eff-detail-grid">
        <article className="eff-detail-main">
          <h2>Stage Details</h2>
          <p>{event.description || 'This festival stage is synchronized from the Sellio events catalog.'}</p>
          {event.specs?.tags && (
            <div className="eff-detail-tags">{event.specs.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          )}
        </article>
        <aside className="eff-detail-sidebar">
          <h3>Secure Your Pass</h3>
          <p className="eff-detail-price">{formatEventPrice(event)}</p>
          {isSubmitted ? (
            <div className="eff-detail-success" role="status">Pass reserved locally.</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label>Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
              <label>Passes<input type="number" min="1" max="8" value={form.passes} onChange={(e) => setForm({ ...form, passes: e.target.value })} /></label>
              <button className="eff-btn-primary" type="submit">Secure Pass</button>
              {formError && <p style={{ color: '#fca5a5', fontSize: '0.85rem', marginTop: '0.75rem' }}>{formError}</p>}
            </form>
          )}
        </aside>
      </section>
    </main>
  );
}
