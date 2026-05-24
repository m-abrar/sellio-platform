'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { EventListing } from '@sellio/types';
import { OccasionCard, BookingHUD } from './components';

const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

function formatEventDateUnderscore(dateStr?: string | null) {
  if (!dateStr) {
    return 'DATE_TBA';
  }

  const date = new Date(dateStr);
  return `${months[date.getMonth()]}_${String(date.getDate()).padStart(2, '0')}_${date.getFullYear()}`;
}

function mapEventToOccasion(event: EventListing) {
  const location = event.location?.map_title
    || [event.location?.city, event.location?.state].filter(Boolean).join(', ')
    || event.location?.address
    || 'Venue TBA';

  return {
    title: event.title,
    location,
    date: formatEventDateUnderscore(event.schedule?.start_at),
    category: event.specs?.category || event.specs?.type || 'Event',
    slug: event.slug,
  };
}

export default function Page() {
  const [events, setEvents] = useState<EventListing[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventError, setEventError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      try {
        const response = await api.getEvents({ per_page: 6 });
        if (!isMounted) {
          return;
        }

        setEvents(Array.isArray(response.data) ? response.data : []);
        setEventError(null);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load events classic listings:', error);
        setEventError(error instanceof Error ? error.message : 'Events are temporarily unavailable.');
      } finally {
        if (isMounted) {
          setLoadingEvents(false);
        }
      }
    }

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="events-classic-theme">
      {/* Cinematic Cultural Hero */}
      <section className="ecl-hero" aria-labelledby="ecl-hero-title">
          <div style={{ width: '100px', height: '1px', background: 'var(--ecl-gold)', marginBottom: '4rem' }}></div>
          <h1 className="ecl-heading-xl" style={{ color: 'white' }} id="ecl-hero-title">
            Cultural <br/>
            <span className="ecl-italic">Heritage.</span>
          </h1>
          <p style={{ maxWidth: '750px', fontSize: '1.5rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginTop: '5rem', fontWeight: 300 }}>
              A curated distribution of the world's most significant cultural repertoire. Authenticated experiences for the discerning patron.
          </p>
          <div style={{ marginTop: '7rem' }}>
            <button className="ec-btn-primary" style={{ background: 'white', color: 'var(--ecl-burgundy)' }} id="ecl-btn-explore" onClick={() => document.getElementById('ecl-exchange-section')?.scrollIntoView({ behavior: 'smooth' })}>Explore Repertoire</button>
          </div>
      </section>

      {/* Trust & Logistics Bar */}
      <section className="ecl-trust-bar" aria-label="Artistic Integrity Status">
          {['AUTHENTIC_INSTITUTIONAL_NODES', 'CURATED_ARTISTIC_PROTOCOL', 'GLOBAL_CULTURAL_EXCHANGE', 'PATRON_PRIVACY_SECURED'].map(logic => (
              <div key={logic} className="ecl-mono" style={{ fontSize: '0.65rem', opacity: 0.5 }}>{logic}</div>
          ))}
      </section>

      {/* Booking HUD Section */}
      <section className="ecl-section ecl-hud-section" aria-label="Live Statistics Dashboard">
          <BookingHUD label="VERIFIED_VENUES" value="42" />
          <BookingHUD label="INSTITUTIONAL_NODES" value="156" />
          <BookingHUD label="PATRON_SYNC_SPEED" value="0.01s" />
          <BookingHUD label="ARCHIVE_STABILITY" value="100%" />
      </section>

      {/* Repertoire Registry Section */}
      <section className="ecl-section" id="ecl-exchange-section" aria-labelledby="ecl-repertoire-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="ecl-mono" style={{ marginBottom: '1.5rem' }}>OFFICIAL_CULTURAL_REGISTRY</div>
                  <h2 className="ecl-heading-xl" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }} id="ecl-repertoire-title">The <span className="ecl-italic">Repertoire.</span></h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'rgba(26, 26, 26, 0.4)', lineHeight: 1.8 }}>
                  Our unified protocol synchronizes performance availability from the world's most significant institutional nodes.
              </div>
          </div>

          <div className="ec-repertoire-grid">
            {loadingEvents ? (
              [1, 2, 3, 4, 5, 6].map((item) => (
                <div className="ecl-occasion-card ecl-listing-skeleton" key={item}>
                  <div className="ecl-skeleton-line ecl-skeleton-line-title" />
                  <div className="ecl-skeleton-line" />
                  <div className="ecl-skeleton-line ecl-skeleton-line-short" />
                </div>
              ))
            ) : eventError ? (
              <div className="ecl-listing-state">
                <div className="ecl-listing-kicker">Cultural Sync Offline</div>
                <h3>The repertoire could not be loaded.</h3>
                <p>{eventError}</p>
              </div>
            ) : events.length === 0 ? (
              <div className="ecl-listing-state">
                <div className="ecl-listing-kicker">Empty Event Registry</div>
                <h3>No live events are published yet.</h3>
                <p>Add event records in the backend and this repertoire grid will hydrate automatically.</p>
              </div>
            ) : (
              events.slice(0, 6).map((event) => {
                const occasion = mapEventToOccasion(event);
                return (
                  <a className="ecl-occasion-link" href={`/product/${occasion.slug}`} key={event.id}>
                    <OccasionCard {...occasion} />
                  </a>
                );
              })
            )}
          </div>
      </section>

      {/* Institutional / Patron Section */}
      <section className="ecl-section ecl-patron-section" aria-labelledby="ecl-patron-title">
          <div style={{ padding: '8rem' }}>
              <div className="ecl-mono" style={{ marginBottom: '3rem' }}>PATRON_CIRCLE_PROTOCOL</div>
              <h2 className="ecl-heading-xl" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', marginBottom: '4rem' }} id="ecl-patron-title">The Patron's <br/><span className="ecl-italic">Circle.</span></h2>
              <p style={{ fontSize: '1.25rem', color: 'rgba(26, 26, 26, 0.4)', lineHeight: 2, marginBottom: '6rem', fontWeight: 300 }}>
                  Join an exclusive network of cultural institutions and patrons. Support the arts through the Sellio Legacy protocol and gain early access to premieres.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }} className="ecl-patron-perks">
                  {['Priority_Box', 'Private_Galas', 'Voting_Rights', 'Archive_Access'].map(item => (
                      <div key={item} style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--ecl-burgundy)', letterSpacing: '2px' }}>◆ {item.toUpperCase()}</div>
                  ))}
              </div>
          </div>
          <div style={{ padding: '8rem', background: '#fdfdfb', borderLeft: '1px solid var(--ecl-stone)', height: '100%' }}>
              <h3 style={{ fontFamily: 'var(--ecl-serif)', fontSize: '2.5rem', fontWeight: 900, marginBottom: '2.5rem', color: 'var(--ecl-burgundy)' }}>Become a Patron.</h3>
              <p style={{ color: 'rgba(26, 26, 26, 0.4)', lineHeight: 2, marginBottom: '4rem' }}>
                  Institutional inquiry nodes are currently active for the 2026/27 cycle. Submit your credentials for evaluation.
              </p>
              <button className="ecl-btn-primary" style={{ width: '100%', padding: '2rem' }} id="ecl-btn-patron-apply" onClick={() => alert('Patron circle application transmitted.')}>Request Institutional Access</button>
          </div>
      </section>

      <div style={{ height: '10rem' }}></div>
    </div>
  );
}
