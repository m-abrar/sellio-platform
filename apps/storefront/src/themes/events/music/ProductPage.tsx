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
  getEventLocationLabel,
  getMusicEventImage,
} from '@/themes/events/shared/event-utils';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = useEventsThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const labelInfoHeading = useThemeContent('detail.info_heading', 'Performance Details');
  const labelTicketHeading = useThemeContent('detail.ticket_heading', 'Get Your Tickets');
  const labelSuccessMessage = useThemeContent('detail.success_message', 'Access reserved locally.');
  const labelFallbackDescription = useThemeContent('detail.fallback_description', 'This live headliner is synchronized from the Sellio events catalog.');
  const [event, setEvent] = useState<EventListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', tickets: '2' });
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
        const resolution = resolveEventFailure(slug, allowDemo, 'music');

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
        quantity: Number(form.tickets) || 1,
        fullName: form.name,
        email: form.email,
      });
      return;
    }

    try {
      const stored = JSON.parse(localStorage.getItem('sellio_events_music_rsvps') || '[]');
      stored.push({
        id: Date.now(),
        event_id: event.id,
        event_title: event.title,
        guest_name: form.name,
        guest_email: form.email,
        tickets: form.tickets,
        submitted_at: new Date().toISOString(),
      });
      localStorage.setItem('sellio_events_music_rsvps', JSON.stringify(stored));
      setIsSubmitted(true);
      setForm({ name: '', email: '', tickets: '2' });
    } catch (error) {
      console.error('Failed to persist RSVP:', error);
    }
  };

  if (loading) {
    return (
      <main className="sonic-detail-page" aria-busy="true">
        <div className="sonic-detail-skeleton sonic-detail-hero-skeleton" />
        <div className="sonic-detail-line sonic-detail-line-title" />
      </main>
    );
  }

  if (notFound || (!event && !useFallback)) {
    return (
      <main className="sonic-detail-page">
        <section className="sonic-detail-state" role="status">
          <h2>Lineup Sync Error</h2>
          <p>{apiError || 'Event not found.'}</p>
          <a href={themeLink('/')} className="sonic-btn-primary">Return to Lineup</a>
        </section>
      </main>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <main className="sonic-detail-page">
      <a href={themeLink('/')} className="sonic-detail-back">&larr; Back to Core Lineup</a>

      {useFallback && apiError && (
        <div className="evm-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="evm" />
        </div>
      )}
      {apiError && !useFallback && (
        <div className="evm-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="evm" />
        </div>
      )}

      <header className="sonic-detail-hero">
        <img src={getMusicEventImage(event)} alt={event.title} />
        <div className="sonic-detail-hero-overlay">
          <div className="sonic-detail-kicker">{event.specs?.category || 'Headliner'}</div>
          <h1>{event.title}</h1>
          <div className="sonic-detail-meta">
            <span>{formatEventDateShort(event)}</span>
            <span>{getEventLocationLabel(event)}</span>
            <span>{formatEventPrice(event)}</span>
          </div>
        </div>
      </header>
      <section className="sonic-detail-grid">
        <article className="sonic-detail-main">
          <h2>{labelInfoHeading}</h2>
          <p>{event.description || labelFallbackDescription}</p>
          {event.specs?.tags && (
            <div className="sonic-detail-tags">{event.specs.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          )}
        </article>
        <aside className="sonic-detail-sidebar">
          <h3>{labelTicketHeading}</h3>
          <p className="sonic-detail-price">{formatEventPrice(event)}</p>
          {isSubmitted ? (
            <div className="sonic-detail-success" role="status">{labelSuccessMessage}</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label htmlFor="ticket-name">Name</label>
              <input id="ticket-name" required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <label htmlFor="ticket-email">Email</label>
              <input id="ticket-email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <label htmlFor="ticket-qty">Tickets</label>
              <input id="ticket-qty" type="number" min="1" max="8" value={form.tickets} onChange={(e) => setForm({ ...form, tickets: e.target.value })} />
              <button className="sonic-btn-primary" type="submit">Reserve Access</button>
              {formError && <p className="sonic-form-error" role="alert">{formError}</p>}
            </form>
          )}
        </aside>
      </section>
    </main>
  );
}
