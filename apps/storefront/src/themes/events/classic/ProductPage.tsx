'use client';

import React, { useEffect, useState } from 'react';
import type { EventListing } from '@sellio/types';
import { CatalogSyncAlert } from '@/themes/events/shared/CatalogSyncAlert';
import { fetchEventDetail, resolveEventFailure } from '@/themes/events/shared/catalog';
import {
  formatEventDateLong,
  getClassicEventImage,
  getClassicEventPriceLabel,
  getEventLocationLabel,
} from '@/themes/events/shared/event-utils';
import { useDemoFallbackAllowed } from '@/themes/events/shared/useDemoFallbackAllowed';
import { redirectToEventBookingReserve } from '@/themes/events/shared/event-booking-utils';
import {
  getFirstEventTicketOption,
  type EventTicketOption,
} from '@/themes/events/shared/event-tickets';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';

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
  const [form, setForm] = useState({ name: '', email: '', tickets: '1' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<EventTicketOption | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadEvent() {
      setLoading(true);
      setNotFound(false);
      const result = await fetchEventDetail(slug);

      if (!isMounted) return;

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
        const resolution = resolveEventFailure(slug, allowDemo, 'classic');

        if (resolution.mode === 'demo') {
          setEvent(resolution.event);
          setUseFallback(true);
        } else if (resolution.mode === 'notFound') {
          setEvent(null);
          setNotFound(true);
          setUseFallback(false);
        } else {
          setEvent(null);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadEvent();
    return () => { isMounted = false; };
  }, [slug, allowDemo]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event || !form.name || !form.email) {
      setFormError('Please enter your name and email to reserve tickets.');
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
      const stored = JSON.parse(localStorage.getItem('sellio_events_classic_rsvps') || '[]');
      stored.push({
        id: Date.now(),
        event_id: event.id,
        event_title: event.title,
        guest_name: form.name,
        guest_email: form.email,
        tickets: form.tickets,
        submitted_at: new Date().toISOString(),
      });
      localStorage.setItem('sellio_events_classic_rsvps', JSON.stringify(stored));
      setIsSubmitted(true);
      setForm({ name: '', email: '', tickets: '1' });
    } catch (error) {
      console.error('Failed to persist RSVP:', error);
      setFormError('Could not save your reservation locally. Please try again.');
    }
  };

  if (loading) {
    return (
      <main className="ecl-detail-page" aria-busy="true">
        <div className="ecl-detail-skeleton ecl-detail-hero-skeleton" />
        <div className="ecl-detail-line ecl-detail-line-title" />
        <div className="ecl-detail-line" />
      </main>
    );
  }

  if (notFound || !event) {
    return (
      <main className="ecl-detail-page">
        <section className="ecl-detail-state" role="status">
          <div className="ecl-detail-kicker">Event Unavailable</div>
          <h1 className="ecl-serif">Performance could not be loaded.</h1>
          <p>{apiError || 'The requested event does not exist or has been removed.'}</p>
          <a href={themeLink('/')} className="ecl-btn-primary">Return to Repertoire</a>
        </section>
      </main>
    );
  }

  return (
    <main className="ecl-detail-page">
      <a href={themeLink('/')} className="ecl-detail-back">&larr; Back to Repertoire</a>

      {apiError && useFallback && (
        <div className="ecl-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ecl" />
        </div>
      )}

      <header className="ecl-detail-hero">
        <img src={getClassicEventImage(event)} alt={event.title} />
        <div className="ecl-detail-hero-overlay">
          <div className="ecl-detail-kicker">{event.specs?.category || 'Grand Occasion'}</div>
          <h1 className="ecl-serif">{event.title}</h1>
          <div className="ecl-detail-meta">
            <span>{formatEventDateLong(event)}</span>
            <span>{getEventLocationLabel(event)}</span>
            <span>{getClassicEventPriceLabel(event)}</span>
          </div>
        </div>
      </header>

      <section className="ecl-detail-grid">
        <article className="ecl-detail-main">
          <h2 className="ecl-serif">About This Occasion</h2>
          <p>{event.description || 'This live event is synchronized from the Sellio events catalog.'}</p>
          {event.specs?.tags && event.specs.tags.length > 0 && (
            <div className="ecl-detail-tags">
              {event.specs.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          )}
        </article>

        <aside className="ecl-detail-sidebar">
          <h3 className="ecl-serif">Reserve Tickets</h3>
          <p className="ecl-detail-price">{getClassicEventPriceLabel(event)}</p>
          {isSubmitted ? (
            <div className="ecl-detail-success" role="status">Reservation saved locally.</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label>Full Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
              <label>Tickets<input type="number" min="1" max="10" value={form.tickets} onChange={(e) => setForm({ ...form, tickets: e.target.value })} /></label>
              {formError && <p className="ecl-form-error" role="alert">{formError}</p>}
              <button className="ecl-btn-primary" type="submit">Confirm Reservation</button>
            </form>
          )}
        </aside>
      </section>
    </main>
  );
}
