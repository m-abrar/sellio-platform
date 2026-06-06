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
  return new Date(event.schedule.start_at).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

function getEventImage(event: EventListing) {
  return event.media?.poster || event.media?.preview || '/themes/events/festival/1.webp';
}

function getEventPrice(event: EventListing) {
  return event.ticketing?.price_formatted || (event.ticketing?.is_free ? 'Free pass' : 'Festival pass TBA');
}

function getEventLocation(event: EventListing) {
  return event.location?.map_title || event.location?.city || 'Stage TBA';
}

export default function ProductPage({ slug }: ProductPageProps) {
  const [event, setEvent] = useState<EventListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', passType: 'GA' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadEvent() {
      try {
        const response = await api.getEventDetails(slug);
        if (!isMounted) return;
        if (response?.data) { setEvent(response.data); setErrorMessage(null); }
        else setErrorMessage('Stage not found.');
      } catch (error: unknown) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : 'The stage lineup could not be synchronized.');
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
      const stored = JSON.parse(localStorage.getItem('sellio_events_festival_rsvps') || '[]');
      stored.push({ id: Date.now(), event_id: event.id, event_title: event.title, guest_name: form.name, guest_email: form.email, pass_type: form.passType, submitted_at: new Date().toISOString() });
      localStorage.setItem('sellio_events_festival_rsvps', JSON.stringify(stored));
      setIsSubmitted(true);
      setForm({ name: '', email: '', passType: 'GA' });
    } catch (error) { console.error('Failed to persist pass:', error); }
  };

  if (loading) {
    return (
      <main className="eff-detail-page" aria-busy="true">
        <div className="eff-detail-skeleton eff-detail-hero-skeleton" />
        <div className="eff-detail-line eff-detail-line-title" />
      </main>
    );
  }

  if (errorMessage || !event) {
    return (
      <main className="eff-detail-page">
        <section className="eff-detail-state" role="status">
          <div className="eff-detail-kicker">Stage Offline</div>
          <h1>Lineup node could not be loaded.</h1>
          <p>{errorMessage}</p>
          <a href={getThemeLink('')} className="eff-btn-primary">Return to Stages</a>
        </section>
      </main>
    );
  }

  return (
    <main className="eff-detail-page">
      <a href={getThemeLink('')} className="eff-detail-back">&larr; Back to Neon Stages</a>
      <header className="eff-detail-hero">
        <img src={getEventImage(event)} alt={event.title} />
        <div className="eff-detail-hero-overlay">
          <div className="eff-detail-kicker">{event.specs?.category || 'Festival Stage'}</div>
          <h1>{event.title}</h1>
          <div className="eff-detail-meta">
            <span>{formatEventDate(event)}</span>
            <span>{getEventLocation(event)}</span>
            <span>{getEventPrice(event)}</span>
          </div>
        </div>
      </header>
      <section className="eff-detail-grid">
        <article className="eff-detail-main">
          <h2>Stage Brief</h2>
          <p>{event.description || 'This live festival stage is synchronized from the Sellio events catalog.'}</p>
          {event.specs?.tags && (
            <div className="eff-detail-tags">{event.specs.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          )}
        </article>
        <aside className="eff-detail-sidebar">
          <h3>Get Festival Pass</h3>
          <p className="eff-detail-price">{getEventPrice(event)}</p>
          {isSubmitted ? (
            <div className="eff-detail-success" role="status">Pass registration saved.</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label>Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
              <label>Pass Type
                <select value={form.passType} onChange={(e) => setForm({ ...form, passType: e.target.value })}>
                  <option value="GA">General Admission</option>
                  <option value="VIP">VIP</option>
                </select>
              </label>
              <button className="eff-btn-primary" type="submit">Register Pass</button>
            </form>
          )}
        </aside>
      </section>
    </main>
  );
}
