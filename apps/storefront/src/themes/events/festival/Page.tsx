'use client';

import React, { useEffect, useState } from 'react';
import type { EventListing } from '@sellio/types';
import { StageLineupCard, AtmosphereHUD } from './components';
import { CatalogSyncAlert } from '@/themes/events/shared/CatalogSyncAlert';
import { fetchEventsHome, resolveEventsFailure } from '@/themes/events/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/events/shared/useDemoFallbackAllowed';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';
import { getFestivalEventImage } from '@/themes/events/shared/event-utils';
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
  return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')} ${date.getFullYear()}`;
}

function mapEventToStage(event: EventListing, index: number) {
  const location = event.location?.city
    || event.location?.map_title
    || [event.location?.state, event.location?.country].filter(Boolean).join(' ')
    || 'Global';

  return {
    title: event.title,
    location,
    date: formatEventDateShort(event.schedule?.start_at),
    image: getFestivalEventImage(event) || fallbackImages[index % fallbackImages.length],
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
  const heroImage = useThemeMedia('hero.image', '/themes/events/festival/10.webp');
  const heroEyebrow = useThemeContent('hero.eyebrow', 'Global Festival Lineup');
  const heroTitle = useThemeContent('hero.title', 'Neon\nPulse.');
  const heroDescription = useThemeContent('hero.description', 'The most immersive festival experiences on the planet. Curated and authenticated for the discerning attendee.');
  const heroPrimaryCta = useThemeContent('hero.primary_cta_label', 'Explore Lineup');
  const heroSecondaryCta = useThemeContent('hero.secondary_cta_label', 'Join the Pulse');
  const registryEyebrow = useThemeContent('collection.eyebrow', 'Festival Lineup');
  const registryTitle = useThemeContent('collection.title', 'Neon\nStages.');
  const registryDescription = useThemeContent('collection.description', "Curated events from the world's most vibrant festival destinations.");
  const ctaEyebrow = useThemeContent('cta.eyebrow', 'Ready to Attend');
  const ctaTitle = useThemeContent('cta.title', 'The Season is Live.');
  const ctaHighlight = useThemeContent('cta.highlight', 'Season');
  const ctaDescription = useThemeContent('cta.description', "The 2026/27 season is officially live. Secure your tickets to the world's most exclusive festivals before they sell out.");
  const ctaButton = useThemeContent('cta.button_label', 'Secure Tickets Now');

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
        const resolution = resolveEventsFailure(allowDemo, 'festival');

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
                <a href={themeLink('/explore')} className="eff-btn-primary" id="eff-btn-explore">{heroPrimaryCta}</a>
                <a href={themeLink('/explore')} style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    padding: '1.5rem 4.5rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    fontFamily: 'var(--eff-alt)',
                    fontSize: '0.8rem',
                    letterSpacing: '3px',
                    textDecoration: 'none',
                    display: 'inline-block',
                }} id="eff-btn-pulse">
                    {heroSecondaryCta}
                </a>
              </div>
          </div>
      </section>

      {/* Atmosphere HUD Section */}
      <section className="eff-section eff-hud-section" aria-label="Atmosphere Monitoring Dashboard">
          <AtmosphereHUD label="Global Attendees" value="500K+" color="var(--eff-magenta)" />
          <AtmosphereHUD label="Festival Stages" value="142" color="var(--eff-purple)" />
          <AtmosphereHUD label="Satisfaction Rate" value="99%" color="var(--eff-blue)" />
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
            {useFallback && apiError && (
              <div className="eff-alert-slot" style={{ gridColumn: '1 / -1' }}>
                <CatalogSyncAlert variant="demo" error={apiError} classPrefix="eff" />
              </div>
            )}
            {apiError && !useFallback && (
              <div className="eff-alert-slot" style={{ gridColumn: '1 / -1' }}>
                <CatalogSyncAlert variant="production" error={apiError} classPrefix="eff" />
              </div>
            )}
            {loadingEvents ? (
              [1, 2, 3, 4, 5, 6].map((item) => (
                <div className="eff-stage-card evf-listing-skeleton" key={item}>
                  <div className="evf-skeleton-image" />
                  <div className="evf-skeleton-line evf-skeleton-line-title" />
                  <div className="evf-skeleton-line evf-skeleton-line-short" />
                </div>
              ))
            ) : events.length === 0 ? (
              <div className="evf-listing-state">
                <div className="evf-listing-kicker">No Events Yet</div>
                <h3>No live events are published yet.</h3>
                <p>Add event records in the admin panel to populate this festival grid.</p>
              </div>
            ) : (
              events.slice(0, 6).map((event, index) => {
                const stage = mapEventToStage(event, index);
                return (
                  <a className="evf-stage-link" href={themeLink(`/product/${stage.slug}`)} key={event.id}>
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
              <a href={themeLink('/explore')} className="eff-btn-primary" style={{ padding: '2rem 8rem', display: 'inline-block', textDecoration: 'none' }} id="eff-btn-cta-pass">
                  {ctaButton}
              </a>
          </div>
      </section>

      <div style={{ height: '15rem' }}></div>
    </div>
  );
}
