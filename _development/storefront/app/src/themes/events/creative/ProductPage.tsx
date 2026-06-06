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
  return new Date(event.schedule.start_at).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

function getEventImage(event: EventListing) {
  return event.media?.poster || event.media?.preview || '/themes/events/creative/1.webp';
}

function getEventPrice(event: EventListing) {
  return event.ticketing?.price_formatted || (event.ticketing?.is_free ? 'Free entry' : 'Access on request');
}

function getEventLocation(event: EventListing) {
  return event.location?.map_title || [event.location?.city, event.location?.state].filter(Boolean).join(', ') || 'Lab node TBA';
}

export default function ProductPage({ slug }: ProductPageProps) {
  const [event, setEvent] = useState<EventListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', note: '' });
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
        setErrorMessage(error instanceof Error ? error.message : 'The artisan event could not be synchronized.');
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
      const stored = JSON.parse(localStorage.getItem('sellio_events_creative_rsvps') || '[]');
      stored.push({ id: Date.now(), event_id: event.id, event_title: event.title, guest_name: form.name, guest_email: form.email, note: form.note, submitted_at: new Date().toISOString() });
      localStorage.setItem('sellio_events_creative_rsvps', JSON.stringify(stored));
      setIsSubmitted(true);
      setForm({ name: '', email: '', note: '' });
    } catch (error) { console.error('Failed to persist RSVP:', error); }
  };

  if (loading) {
    return (
      <main className="evc-detail-page" aria-busy="true">
        <div className="evc-detail-skeleton evc-detail-hero-skeleton" />
        <div className="evc-detail-line evc-detail-line-title" />
      </main>
    );
  }

  if (errorMessage || !event) {
    return (
      <main className="evc-detail-page">
        <section className="evc-detail-state" role="status">
          <div className="evc-detail-kicker">Node Offline</div>
          <h1>Registry entry could not be loaded.</h1>
          <p>{errorMessage}</p>
          <a href={getThemeLink('')} className="evc-btn-primary">Return to Registry</a>
        </section>
      </main>
    );
  }

  return (
    <main className="evc-detail-page">
      <a href={getThemeLink('')} className="evc-detail-back">&larr; Back to Registry</a>
      <header className="evc-detail-hero">
        <img src={getEventImage(event)} alt={event.title} />
        <div className="evc-detail-hero-overlay">
          <div className="evc-detail-kicker">{event.specs?.category || 'Artisan Event'}</div>
          <h1>{event.title}</h1>
          <div className="evc-detail-meta">
            <span>{formatEventDate(event)}</span>
            <span>{getEventLocation(event)}</span>
            <span>{getEventPrice(event)}</span>
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
          <p className="evc-detail-price">{getEventPrice(event)}</p>
          {isSubmitted ? (
            <div className="evc-detail-success" role="status">Access node synchronized.</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label>Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
              <label>Note<textarea rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>
              <button className="evc-btn-primary" type="submit">Initiate Registration</button>
            </form>
          )}
        </aside>
      </section>
    </main>
  );
}
