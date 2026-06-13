'use client';

import React, { useEffect, useState } from 'react';
import type { EventListing } from '@sellio/types';
import { ArtisanEventCard, PulseHUD } from './components';
import { CatalogSyncAlert } from '@/themes/events/shared/CatalogSyncAlert';
import { fetchEventsHome, resolveEventsFailure } from '@/themes/events/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/events/shared/useDemoFallbackAllowed';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';
import { formatEventDateUnderscore, getEventLocationLabel } from '@/themes/events/shared/event-utils';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

function mapEventToArtisan(event: EventListing) {
  return {
    title: event.title,
    location: getEventLocationLabel(event),
    date: formatEventDateUnderscore(event.schedule?.start_at),
    status: event.specs?.event_genre || event.specs?.category || 'active',
    slug: event.slug,
  };
}

export default function Page() {
  const themeLink = useEventsThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const [events, setEvents] = useState<EventListing[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const heroEyebrow = useThemeContent('hero.eyebrow', 'Creative Events 2026');
  const heroTitle = useThemeContent('hero.title', 'Creative\nPulses.');
  const heroDescription = useThemeContent('hero.description', 'A curated platform for experimental audio-visual events and creative community gatherings.');
  const heroCta = useThemeContent('hero.primary_cta_label', 'Explore Events');
  const registryEyebrow = useThemeContent('collection.eyebrow', 'Event Registry');
  const registryTitle = useThemeContent('collection.title', 'Registry.');
  const registryDescription = useThemeContent('collection.description', "Discover experimental events from the world's most vibrant creative hubs.");
  const labEyebrow = useThemeContent('lab.eyebrow', 'Our Manifesto');
  const labTitle = useThemeContent('lab.title', 'Creative\nArtistry.');
  const labDescription = useThemeContent('lab.description', 'We exist at the intersection of art and technology. Elevating community interactions through raw creative installations and immersive experiences.');
  const labCapabilities = useThemeContent('lab.capabilities', 'Performances|Installations|Exhibitions|Workshops').split('|').map((item) => item.trim()).filter(Boolean);
  const syncTitle = useThemeContent('sync.title', 'Get in Touch');
  const syncDescription = useThemeContent('sync.description', 'Our autumn season is live. Submit your details to access exclusive events and early-bird offers.');
  const syncCta = useThemeContent('sync.cta_label', 'Explore Events');

  useEffect(() => {
    async function loadEvents() {
      setLoadingEvents(true);
      const result = await fetchEventsHome(6);

      if (result.ok && result.response.data?.length) {
        setEvents(result.response.data);
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No events returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveEventsFailure(allowDemo, 'creative');

        if (resolution.mode === 'demo') {
          setEvents(resolution.events);
          setUseFallback(true);
        } else {
          setEvents([]);
          setUseFallback(false);
        }
      }

      setLoadingEvents(false);
    }

    loadEvents();
  }, [allowDemo]);

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
            <a href={themeLink('/explore')} className="evc-btn-primary" id="evc-btn-explore">{heroCta}</a>
          </div>
      </section>

      {/* Pulse HUD Grid */}
      <section className="evc-section evc-hud-section" aria-label="Pulse Monitoring Dashboard">
          <PulseHUD label="Active Events" value="84" />
          <PulseHUD label="Community Members" value="1,240" />
          <PulseHUD label="Satisfaction Rate" value="99.98%" />
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
            {useFallback && apiError && (
              <div className="evc-alert-slot" style={{ gridColumn: '1 / -1' }}>
                <CatalogSyncAlert variant="demo" error={apiError} classPrefix="evc" />
              </div>
            )}
            {apiError && !useFallback && (
              <div className="evc-alert-slot" style={{ gridColumn: '1 / -1' }}>
                <CatalogSyncAlert variant="production" error={apiError} classPrefix="evc" />
              </div>
            )}
            {loadingEvents ? (
              [1, 2, 3, 4, 5, 6].map((item) => (
                <div className="evc-artisan-card evc-listing-skeleton" key={item}>
                  <div className="evc-skeleton-line evc-skeleton-line-title" />
                  <div className="evc-skeleton-line" />
                  <div className="evc-skeleton-line evc-skeleton-line-short" />
                </div>
              ))
            ) : events.length === 0 ? (
              <div className="evc-listing-state">
                <div className="evc-listing-kicker">No Events Yet</div>
                <h3>No live events are published yet.</h3>
                <p>Add event records in the admin panel to populate this registry grid.</p>
              </div>
            ) : (
              events.slice(0, 6).map((event) => {
                const artisan = mapEventToArtisan(event);
                return (
                  <a className="evc-artisan-link" href={themeLink(`/product/${artisan.slug}`)} key={event.id}>
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
                  <a href={themeLink('/explore')} className="evc-btn-primary" style={{ width: '100%', padding: '2rem', display: 'block', textAlign: 'center', textDecoration: 'none' }} id="evc-btn-sync">{syncCta}</a>
              </div>
          </div>
      </section>

      <div style={{ height: '10rem' }}></div>
    </div>
  );
}
