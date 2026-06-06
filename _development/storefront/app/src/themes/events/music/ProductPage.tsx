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
  return new Date(event.schedule.start_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function getEventImage(event: EventListing) {
  return event.media?.poster || event.media?.preview || '/themes/events/music/1.webp';
}

function getEventPrice(event: EventListing) {
  return event.ticketing?.price_formatted || (event.ticketing?.is_free ? 'Free entry' : 'Ticket price TBA');
}

function getEventLocation(event: EventListing) {
  return event.location?.map_title || event.location?.city || 'Venue TBA';
}

export default function ProductPage({ slug }: ProductPageProps) {
  const [event, setEvent] = useState<EventListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', tickets: '2' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadEvent() {
      try {
        const response = await api.getEventDetails(slug);
        if (!isMounted) return;
        if (response?.data) { setEvent(response.data); setErrorMessage(null); }
        else setErrorMessage('Event not found.');
      } catch (error: unknown) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : 'The headliner could not be synchronized.');
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
      const stored = JSON.parse(localStorage.getItem('sellio_events_music_rsvps') || '[]');
      stored.push({ id: Date.now(), event_id: event.id, event_title: event.title, guest_name: form.name, guest_email: form.email, tickets: form.tickets, submitted_at: new Date().toISOString() });
      localStorage.setItem('sellio_events_music_rsvps', JSON.stringify(stored));
      setIsSubmitted(true);
      setForm({ name: '', email: '', tickets: '2' });
    } catch (error) { console.error('Failed to persist RSVP:', error); }
  };

  if (loading) {
    return (
      <main className="sonic-detail-page" aria-busy="true">
        <div className="sonic-detail-skeleton sonic-detail-hero-skeleton" />
        <div className="sonic-detail-line sonic-detail-line-title" />
      </main>
    );
  }

  if (errorMessage || !event) {
    return (
      <main className="sonic-detail-page">
        <section className="sonic-detail-state" role="status">
          <h2>Lineup Sync Error</h2>
          <p>{errorMessage}</p>
          <a href={getThemeLink('')} className="sonic-btn-primary">Return to Lineup</a>
        </section>
      </main>
    );
  }

  return (
    <main className="sonic-detail-page">
      <a href={getThemeLink('')} className="sonic-detail-back">&larr; Back to Core Lineup</a>
      <header className="sonic-detail-hero">
        <img src={getEventImage(event)} alt={event.title} />
        <div className="sonic-detail-hero-overlay">
          <div className="sonic-detail-kicker">{event.specs?.category || 'Headliner'}</div>
          <h1>{event.title}</h1>
          <div className="sonic-detail-meta">
            <span>{formatEventDate(event)}</span>
            <span>{getEventLocation(event)}</span>
            <span>{getEventPrice(event)}</span>
          </div>
        </div>
      </header>
      <section className="sonic-detail-grid">
        <article className="sonic-detail-main">
          <h2>Performance Details</h2>
          <p>{event.description || 'This live headliner is synchronized from the Sellio events catalog.'}</p>
          {event.specs?.tags && (
            <div className="sonic-detail-tags">{event.specs.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          )}
        </article>
        <aside className="sonic-detail-sidebar">
          <h3>Get Your Tickets</h3>
          <p className="sonic-detail-price">{getEventPrice(event)}</p>
          {isSubmitted ? (
            <div className="sonic-detail-success" role="status">Access reserved locally.</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label>Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
              <label>Tickets<input type="number" min="1" max="8" value={form.tickets} onChange={(e) => setForm({ ...form, tickets: e.target.value })} /></label>
              <button className="sonic-btn-primary" type="submit">Reserve Access</button>
            </form>
          )}
        </aside>
      </section>
    </main>
  );
}
