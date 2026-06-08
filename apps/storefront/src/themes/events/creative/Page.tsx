'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { EventListing } from '@sellio/types';
import { ArtisanEventCard, PulseHUD } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

function formatEventDateUnderscore(dateStr?: string | null) {
  if (!dateStr) {
    return 'DATE_TBA';
  }

  const date = new Date(dateStr);
  return `${months[date.getMonth()]}_${String(date.getDate()).padStart(2, '0')}_${date.getFullYear()}`;
}

function mapEventToArtisan(event: EventListing) {
  const location = event.location?.map_title
    || [event.location?.city, event.location?.state].filter(Boolean).join(' // ')
    || event.location?.address
    || 'NODE_TBA';

  return {
    title: event.title,
    location,
    date: formatEventDateUnderscore(event.schedule?.start_at),
    status: event.specs?.event_genre || event.specs?.category || 'active',
    slug: event.slug,
  };
}

export default function Page() {
  const [events, setEvents] = useState<EventListing[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventError, setEventError] = useState<string | null>(null);
  const heroEyebrow = useThemeContent('hero.eyebrow', 'SYNTHETIC_CULTURE_EXCHANGE // 2026');
  const heroTitle = useThemeContent('hero.title', 'Creative\nPulses.');
  const heroDescription = useThemeContent('hero.description', 'A curated decentralized architecture for experimental audio-visual modules and algorithmic community assemblies.');
  const heroCta = useThemeContent('hero.primary_cta_label', 'Launch Labs');
  const registryEyebrow = useThemeContent('collection.eyebrow', 'EXPERIMENTAL_EVENT_REGISTRY');
  const registryTitle = useThemeContent('collection.title', 'Registry.');
  const registryDescription = useThemeContent('collection.description', "Our unified decentralized distribution node synchronizes experimental availability from the world's most vibrant hubs.");
  const labEyebrow = useThemeContent('lab.eyebrow', 'LABORATORY_MANIFESTO');
  const labTitle = useThemeContent('lab.title', 'Synthetic\nArtistry.');
  const labDescription = useThemeContent('lab.description', 'We operate on the boundary of bio-digital synthesis. Elevating community interactions through raw algorithmic installations and real-time auditory sync.');
  const labCapabilities = useThemeContent('lab.capabilities', 'Synthetizers|Generators|Decentralizers|Transmitters').split('|').map((item) => item.trim()).filter(Boolean);
  const syncTitle = useThemeContent('sync.title', 'Node Sync Request');
  const syncDescription = useThemeContent('sync.description', 'Transmission pathways are currently active for the autumn cluster. Submit your digital signature for synchronized resonance.');
  const syncCta = useThemeContent('sync.cta_label', 'Initiate Synchronous Wave');

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

        console.error('Failed to load events creative listings:', error);
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
    <div className="events-creative-theme">
      {/* Cinematic Creative Hero */}
      <section className="evc-hero" aria-labelledby="evc-hero-title">
          <div className="evc-hero-glow"></div>
          <div className="evc-label" style={{ marginBottom: '3rem' }}>{heroEyebrow}</div>
          <h1 className="evc-heading-xl" id="evc-hero-title">
            {heroTitle.split('\n').map((line, index) => (
              <React.Fragment key={`${line}-${index}`}>
                {index > 0 && <br />}
                {index === heroTitle.split('\n').length - 1 ? <span style={{ color: 'var(--evc-lime)' }}>{line}</span> : line}
              </React.Fragment>
            ))}
          </h1>
          <p style={{ maxWidth: '750px', fontSize: '1.4rem', color: 'var(--evc-grey)', lineHeight: 1.8, marginTop: '4rem', fontWeight: 300 }}>
              {heroDescription}
          </p>
          <div style={{ marginTop: '6rem' }}>
            <button className="evc-btn-primary" id="evc-btn-explore" onClick={() => document.getElementById('evc-protocols-section')?.scrollIntoView({ behavior: 'smooth' })}>{heroCta}</button>
          </div>
      </section>

      {/* Pulse HUD Grid */}
      <section className="evc-section evc-hud-section" aria-label="Pulse Monitoring Dashboard">
          <PulseHUD label="ACTIVE_RESONANCE_NODES" value="84" />
          <PulseHUD label="TOTAL_MUTED_SATELLITES" value="1,240" />
          <PulseHUD label="FABRICATION_STABILITY" value="99.98%" />
      </section>

      {/* Artisan Registry Section */}
      <section className="evc-section" id="evc-protocols-section" aria-labelledby="evc-protocols-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="evc-label" style={{ marginBottom: '1.5rem' }}>{registryEyebrow}</div>
                  <h2 className="evc-heading-xl" style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)' }} id="evc-protocols-title">{registryTitle}</h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'var(--evc-grey)', lineHeight: 1.8 }}>
                  {registryDescription}
              </div>
          </div>

          <div className="evc-artisan-grid">
            {loadingEvents ? (
              [1, 2, 3, 4, 5, 6].map((item) => (
                <div className="evc-artisan-card evc-listing-skeleton" key={item}>
                  <div className="evc-skeleton-line evc-skeleton-line-title" />
                  <div className="evc-skeleton-line" />
                  <div className="evc-skeleton-line evc-skeleton-line-short" />
                </div>
              ))
            ) : eventError ? (
              <div className="evc-listing-state">
                <div className="evc-listing-kicker">Registry Sync Offline</div>
                <h3>Experimental events could not be loaded.</h3>
                <p>{eventError}</p>
              </div>
            ) : events.length === 0 ? (
              <div className="evc-listing-state">
                <div className="evc-listing-kicker">Empty Event Registry</div>
                <h3>No live events are published yet.</h3>
                <p>Add event records in the backend and this registry grid will hydrate automatically.</p>
              </div>
            ) : (
              events.slice(0, 6).map((event) => {
                const artisan = mapEventToArtisan(event);
                return (
                  <a className="evc-artisan-link" href={`/product/${artisan.slug}`} key={event.id}>
                    <ArtisanEventCard {...artisan} />
                  </a>
                );
              })
            )}
          </div>
      </section>

      {/* Lab manifesto section */}
      <section className="evc-section" id="evc-lab-section" aria-labelledby="evc-lab-title" style={{ borderTop: '1px solid var(--evc-zinc)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem', alignItems: 'center' }} className="evc-lab-content">
              <div>
                  <div className="evc-label" style={{ marginBottom: '3rem' }}>{labEyebrow}</div>
                  <h2 className="evc-heading-xl" style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', marginBottom: '4rem' }} id="evc-lab-title">
                    {labTitle.split('\n').map((line, index) => (
                      <React.Fragment key={`${line}-${index}`}>
                        {index > 0 && <br />}
                        {index === labTitle.split('\n').length - 1 ? <span style={{ color: 'var(--evc-lime)' }}>{line}</span> : line}
                      </React.Fragment>
                    ))}
                  </h2>
                  <p style={{ fontSize: '1.2rem', color: 'var(--evc-grey)', lineHeight: 1.8, marginBottom: '6rem', fontWeight: 300 }}>
                      {labDescription}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }} className="evc-lab-capabilities">
                      {labCapabilities.map(cap => (
                          <div key={cap} style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--evc-lime)', letterSpacing: '2px', fontFamily: 'var(--evc-mono)' }}>◆ {cap.toUpperCase()}</div>
                      ))}
                  </div>
              </div>
              <div style={{ background: '#111', border: '1px solid var(--evc-zinc)', padding: '6rem', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2.5rem', color: 'white', letterSpacing: '-1.5px' }}>{syncTitle}</h3>
                  <p style={{ color: 'var(--evc-grey)', lineHeight: 1.8, marginBottom: '4rem' }}>
                      {syncDescription}
                  </p>
                  <button className="evc-btn-primary" style={{ width: '100%', padding: '2rem' }} id="evc-btn-sync" onClick={() => alert('Resonance wave broadcasted successfully.')}>{syncCta}</button>
              </div>
          </div>
      </section>

      <div style={{ height: '10rem' }}></div>
    </div>
  );
}
