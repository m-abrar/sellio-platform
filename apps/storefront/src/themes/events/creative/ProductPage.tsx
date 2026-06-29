'use client';

import React, { useEffect, useState } from 'react';
import type { EventListing } from '@/types';
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
  getCreativeEventImage,
  getEventLocationLabel,
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
  const [form, setForm] = useState({ name: '', email: '', note: '' });
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
        const resolution = resolveEventFailure(slug, allowDemo, 'creative');

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
        fullName: form.name,
        email: form.email,
      });
      return;
    }

    try {
      const stored = JSON.parse(localStorage.getItem('sellio_events_creative_rsvps') || '[]');
      stored.push({
        id: Date.now(),
        event_id: event.id,
        event_title: event.title,
        guest_name: form.name,
        guest_email: form.email,
        note: form.note,
        submitted_at: new Date().toISOString(),
      });
      localStorage.setItem('sellio_events_creative_rsvps', JSON.stringify(stored));
      setIsSubmitted(true);
      setForm({ name: '', email: '', note: '' });
    } catch (error) {
      console.error('Failed to persist RSVP:', error);
    }
  };

  if (loading) {
    return (
      <main className="evc-detail-page" aria-busy="true">
        <div className="evc-detail-skeleton evc-detail-hero-skeleton" />
        <div className="evc-detail-line evc-detail-line-title" />
      </main>
    );
  }

  if (notFound || (!event && !useFallback)) {
    return (
      <main className="evc-detail-page">
        <section className="evc-detail-state" role="status">
          <div className="evc-detail-kicker">Node Offline</div>
          <h1>Registry entry could not be loaded.</h1>
          <p>{apiError || 'Event not found.'}</p>
          <a href={themeLink('/')} className="evc-btn-primary">Return to Registry</a>
        </section>
      </main>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <main className="evc-detail-page">
      <a href={themeLink('/')} className="evc-detail-back">&larr; Back to Registry</a>

      {useFallback && apiError && (
        <div className="evc-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="evc" />
        </div>
      )}
      {apiError && !useFallback && (
        <div className="evc-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="evc" />
        </div>
      )}

      <header className="evc-detail-hero">
        <img src={getCreativeEventImage(event)} alt={event.title} />
        <div className="evc-detail-hero-overlay">
          <div className="evc-detail-kicker">{event.specs?.category || 'Artisan Event'}</div>
          <h1>{event.title}</h1>
          <div className="evc-detail-meta">
            <span>{formatEventDateShort(event)}</span>
            <span>{getEventLocationLabel(event)}</span>
            <span>{formatEventPrice(event)}</span>
          </div>
        </div>
      </header>
      <section className="evc-detail-grid">
        <article className="evc-detail-main">
          <h2>Event Protocol</h2>
          <p>{event.description || 'This live artisan event is synchronized from the Sellio events catalog.'}</p>
          {event.specs?.tags && (
            <div className="evc-detail-tags">{event.specs.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
          )}
        </article>
        <aside className="evc-detail-sidebar">
          <h3>Register Access</h3>
          <p className="evc-detail-price">{formatEventPrice(event)}</p>
          {isSubmitted ? (
            <div className="evc-detail-success" role="status">Access node synchronized.</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label>Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
              <label>Note<textarea rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>
              <button className="evc-btn-primary" type="submit">Initiate Registration</button>
              {formError && <p style={{ color: '#fca5a5', fontSize: '0.85rem', marginTop: '0.75rem' }}>{formError}</p>}
            </form>
          )}
        </aside>
      </section>
    </main>
  );
}
