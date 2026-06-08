'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { EventListing } from '@sellio/types';

interface ProductPageProps {
  slug: string;
}

function getThemeLink(path: string) {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/preview/')) {
    const themeKey = window.location.pathname.split('/')[2];
    return `/preview/${themeKey}${path}`;
  }
  return path || '/';
}

function formatEventDate(event: EventListing) {
  if (!event.schedule?.start_at) return 'Date TBA';
  return new Date(event.schedule.start_at).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getEventImage(event: EventListing) {
  return event.media?.poster || event.media?.preview || event.media?.gallery?.[0]?.url || '/themes/events/classic/1.webp';
}

function getEventPrice(event: EventListing) {
  return event.ticketing?.price_formatted || (event.ticketing?.is_free ? 'Free admission' : 'Tickets on request');
}

function getEventLocation(event: EventListing) {
  return event.location?.map_title || [event.location?.city, event.location?.state].filter(Boolean).join(', ') || 'Venue TBA';
}

export default function ProductPage({ slug }: ProductPageProps) {
  const [event, setEvent] = useState<EventListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', tickets: '1' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadEvent() {
      try {
        const response = await api.getEventDetails(slug);
        if (!isMounted) return;
        if (response?.data) {
          setEvent(response.data);
          setErrorMessage(null);
        } else {
          setErrorMessage('Event not found.');
        }
      } catch (error: unknown) {
        if (!isMounted) return;
        console.error('Failed to load events classic detail:', error);
        setErrorMessage(error instanceof Error ? error.message : 'The event could not be synchronized.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadEvent();
    return () => { isMounted = false; };
  }, [slug]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event || !form.name || !form.email) return;

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

  if (errorMessage || !event) {
    return (
      <main className="ecl-detail-page">
        <section className="ecl-detail-state" role="status">
          <div className="ecl-detail-kicker">Event Unavailable</div>
          <h1 className="ecl-serif">Performance could not be loaded.</h1>
          <p>{errorMessage || 'The requested event does not exist or has been removed.'}</p>
          <a href={getThemeLink('')} className="ecl-btn-primary">Return to Repertoire</a>
        </section>
      </main>
    );
  }

  return (
    <main className="ecl-detail-page">
      <a href={getThemeLink('')} className="ecl-detail-back">&larr; Back to Repertoire</a>

      <header className="ecl-detail-hero">
        <img src={getEventImage(event)} alt={event.title} />
        <div className="ecl-detail-hero-overlay">
          <div className="ecl-detail-kicker">{event.specs?.category || 'Grand Occasion'}</div>
          <h1 className="ecl-serif">{event.title}</h1>
          <div className="ecl-detail-meta">
            <span>{formatEventDate(event)}</span>
            <span>{getEventLocation(event)}</span>
            <span>{getEventPrice(event)}</span>
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
          <p className="ecl-detail-price">{getEventPrice(event)}</p>
          {isSubmitted ? (
            <div className="ecl-detail-success" role="status">Reservation saved locally.</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label>Full Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
              <label>Tickets<input type="number" min="1" max="10" value={form.tickets} onChange={(e) => setForm({ ...form, tickets: e.target.value })} /></label>
              <button className="ecl-btn-primary" type="submit">Confirm Reservation</button>
            </form>
          )}
        </aside>
      </section>
    </main>
  );
}
