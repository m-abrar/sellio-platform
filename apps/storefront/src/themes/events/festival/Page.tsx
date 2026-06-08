'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { EventListing } from '@sellio/types';
import { StageLineupCard, AtmosphereHUD } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const fallbackImages = [
  '/themes/events/festival/11.webp',
  '/themes/events/festival/12.webp',
  '/themes/events/festival/13.webp',
  '/themes/events/festival/14.webp',
  '/themes/events/festival/15.webp',
  '/themes/events/festival/16.webp',
];

function formatEventDateShort(dateStr?: string | null) {
  if (!dateStr) {
    return 'TBA';
  }

  const date = new Date(dateStr);
  return `${months[date.getMonth()]}_${String(date.getDate()).padStart(2, '0')}_${date.getFullYear()}`;
}

function mapEventToStage(event: EventListing, index: number) {
  const location = event.location?.city
    || event.location?.map_title
    || [event.location?.state, event.location?.country].filter(Boolean).join(' ')
    || 'Global Node';

  return {
    title: event.title,
    location,
    date: formatEventDateShort(event.schedule?.start_at),
    image: event.media?.poster || event.media?.preview || fallbackImages[index % fallbackImages.length],
    slug: event.slug,
  };
}

export default function Page() {
  const [events, setEvents] = useState<EventListing[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventError, setEventError] = useState<string | null>(null);
  const heroImage = useThemeMedia('hero.image', '/themes/events/festival/10.webp');
  const heroEyebrow = useThemeContent('hero.eyebrow', 'THE_GLOBAL_COLLECTIVE_V8');
  const heroTitle = useThemeContent('hero.title', 'Neon\nPulse.');
  const heroDescription = useThemeContent('hero.description', 'The most immersive festival experiences on the planet. Curated, authenticated, and distributed via the Sellio Neon network.');
  const heroPrimaryCta = useThemeContent('hero.primary_cta_label', 'Explore Lineup');
  const heroSecondaryCta = useThemeContent('hero.secondary_cta_label', 'Join_The_Pulse');
  const registryEyebrow = useThemeContent('collection.eyebrow', 'OFFICIAL_FESTIVAL_REGISTRY');
  const registryTitle = useThemeContent('collection.title', 'Neon\nStages.');
  const registryDescription = useThemeContent('collection.description', "Our unified protocol synchronizes high-vibe environments across the world's most significant neon nodes.");
  const ctaEyebrow = useThemeContent('cta.eyebrow', 'READY_TO_LOSE_CONTROL');
  const ctaTitle = useThemeContent('cta.title', 'The Season is Live.');
  const ctaHighlight = useThemeContent('cta.highlight', 'Season');
  const ctaDescription = useThemeContent('cta.description', "The 2026/27 season is officially live. Secure your access to the world's most exclusive high-vibe environments before the node capacity is reached.");
  const ctaButton = useThemeContent('cta.button_label', 'Secure Tickets Now');

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

        console.error('Failed to load events festival listings:', error);
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
    <div className="events-festival-theme">
      {/* High-Intensity Pulse Hero */}
      <section className="ef-hero" style={{ backgroundImage: `url('${heroImage}')` }} aria-labelledby="eff-hero-title">
          <div className="ef-hero-overlay"></div>
          <div style={{ position: 'relative', zIndex: 2 }}>
              <div className="eff-mono" style={{ marginBottom: '3rem', color: 'white' }}>{heroEyebrow}</div>
              <h1 className="eff-heading-xl" id="eff-hero-title">
                {heroTitle.split('\n').map((line, index) => (
                  <React.Fragment key={`${line}-${index}`}>
                    {index > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </h1>
              <p style={{ marginTop: '5rem', fontSize: '1.5rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, maxWidth: '700px', margin: '5rem auto 0', fontWeight: 300 }}>
                  {heroDescription}
              </p>
              <div style={{ marginTop: '7rem', display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap' }} className="eff-hero-buttons">
                <button className="eff-btn-primary" id="eff-btn-explore" onClick={() => document.getElementById('eff-stages-section')?.scrollIntoView({ behavior: 'smooth' })}>{heroPrimaryCta}</button>
                <button style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    padding: '1.5rem 4.5rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    fontFamily: 'var(--eff-alt)',
                    fontSize: '0.8rem',
                    letterSpacing: '3px'
                }} id="eff-btn-pulse" onClick={() => alert('Vibe sync requested.')}>
                    {heroSecondaryCta}
                </button>
              </div>
          </div>
      </section>

      {/* Atmosphere HUD Section */}
      <section className="eff-section eff-hud-section" aria-label="Atmosphere Monitoring Dashboard">
          <AtmosphereHUD label="GLOBAL_ATTENDEES" value="500K+" color="var(--eff-magenta)" />
          <AtmosphereHUD label="FESTIVAL_NODES" value="142" color="var(--eff-purple)" />
          <AtmosphereHUD label="VIBE_RATING" value="99%" color="var(--eff-blue)" />
      </section>

      {/* Stage Registry Section */}
      <section className="eff-section" id="eff-stages-section" aria-labelledby="eff-stages-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }} className="eff-section-header">
              <div>
                  <div className="eff-mono" style={{ marginBottom: '1.5rem' }}>{registryEyebrow}</div>
                  <h2 className="eff-heading-xl" style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }} id="eff-stages-title">
                    {registryTitle.split('\n').map((line, index) => (
                      <React.Fragment key={`${line}-${index}`}>
                        {index > 0 && <br />}
                        {index === registryTitle.split('\n').length - 1 ? <span style={{ color: 'var(--eff-magenta)' }}>{line}</span> : line}
                      </React.Fragment>
                    ))}
                  </h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1.1rem', color: 'var(--eff-grey)', lineHeight: 1.8, fontWeight: 300 }}>
                  {registryDescription}
              </div>
          </div>

          <div className="ef-festival-grid">
            {loadingEvents ? (
              [1, 2, 3, 4, 5, 6].map((item) => (
                <div className="eff-stage-card evf-listing-skeleton" key={item}>
                  <div className="evf-skeleton-image" />
                  <div className="evf-skeleton-line evf-skeleton-line-title" />
                  <div className="evf-skeleton-line evf-skeleton-line-short" />
                </div>
              ))
            ) : eventError ? (
              <div className="evf-listing-state">
                <div className="evf-listing-kicker">Festival Sync Offline</div>
                <h3>Neon stages could not be loaded.</h3>
                <p>{eventError}</p>
              </div>
            ) : events.length === 0 ? (
              <div className="evf-listing-state">
                <div className="evf-listing-kicker">Empty Event Registry</div>
                <h3>No live events are published yet.</h3>
                <p>Add event records in the backend and this festival grid will hydrate automatically.</p>
              </div>
            ) : (
              events.slice(0, 6).map((event, index) => {
                const stage = mapEventToStage(event, index);
                return (
                  <a className="evf-stage-link" href={`/product/${stage.slug}`} key={event.id}>
                    <StageLineupCard {...stage} />
                  </a>
                );
              })
            )}
          </div>
      </section>

      {/* Collective CTA Section */}
      <section style={{ marginTop: '20rem', padding: '15rem 8%', background: '#050505', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', position: 'relative', overflow: 'hidden' }} aria-labelledby="eff-cta-title">
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(217, 70, 239, 0.1) 0%, transparent 80%)' }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="eff-mono" style={{ marginBottom: '4rem' }}>{ctaEyebrow}</div>
              <h2 className="eff-heading-xl" style={{ fontSize: 'clamp(3.5rem, 8vw, 7.5rem)', marginBottom: '4rem' }} id="eff-cta-title">
                {ctaTitle.split(ctaHighlight).map((part, index, parts) => (
                  <React.Fragment key={`${part}-${index}`}>
                    {part}
                    {index < parts.length - 1 && <span style={{ color: 'var(--eff-magenta)' }}>{ctaHighlight}</span>}
                  </React.Fragment>
                ))}
              </h2>
              <p style={{ maxWidth: '800px', margin: '0 auto 8rem', fontSize: '1.5rem', color: 'var(--eff-grey)', lineHeight: 1.8, fontWeight: 300 }}>
                  {ctaDescription}
              </p>
              <button className="eff-btn-primary" style={{ padding: '2rem 8rem' }} id="eff-btn-cta-pass" onClick={() => alert('Pass registration active.')}>
                  {ctaButton}
              </button>
          </div>
      </section>

      <div style={{ height: '15rem' }}></div>
    </div>
  );
}
