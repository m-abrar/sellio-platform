'use client';

import React, { useEffect, useState } from 'react';
import type { EventListing } from '@/types';
import { PulseExperience, LineupGrid } from './components';
import { CatalogSyncAlert } from '@/themes/events/shared/CatalogSyncAlert';
import { fetchEventsHome, resolveEventsFailure } from '@/themes/events/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/events/shared/useDemoFallbackAllowed';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';
import { formatEventDateShort, getMusicEventImage } from '@/themes/events/shared/event-utils';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

const fallbackImages = [
  '/themes/events/music/11.webp',
  '/themes/events/music/12.webp',
  '/themes/events/music/13.webp',
  '/themes/events/music/14.webp',
];

function mapEventToHeadliner(event: EventListing, index: number) {
  return {
    name: event.specs?.brand || event.specs?.category || 'HEADLINER',
    event: event.title,
    date: formatEventDateShort(event),
    image: getMusicEventImage(event) || fallbackImages[index % fallbackImages.length],
    slug: event.slug,
  };
}

export default function Page() {
  const themeLink = useEventsThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const heroEyebrow = useThemeContent('hero.eyebrow', 'Featured Events');
  const heroTitle = useThemeContent('hero.title', 'FEEL THE\nMUSIC LIVE.');
  const heroDescription = useThemeContent(
    'hero.description',
    'Discover elite concerts and underground music festivals worldwide. Unforgettable experiences for the modern listener.',
  );
  const heroImage = useThemeMedia('hero.image', '/themes/events/music/10.webp');
  const primaryCtaLabel = useThemeContent('hero.primary_cta_label', 'Get Your Tickets');
  const secondaryCtaLabel = useThemeContent('hero.secondary_cta_label', 'Explore Lineup');
  const metricsLeftText = useThemeContent('metrics.left_text', 'Live Events | Premium Sound | Verified Lineup');
  const metricsRightText = useThemeContent('metrics.right_text', '128 BPM');
  const lineupEyebrow = useThemeContent('lineup.eyebrow', 'Elite Headliners');
  const lineupTitle = useThemeContent('lineup.title', 'The Core Lineup.');
  const supportEyebrow = useThemeContent('support.eyebrow', 'Supporting Acts');
  const supportTitle = useThemeContent('support.title', 'Sonic Support.');
  const galleryTitle = useThemeContent('gallery.title', 'Sonic Recaps.');
  const ctaTitle = useThemeContent('cta.title', 'Join the\nPulse.');
  const ctaDescription = useThemeContent(
    'cta.description',
    "Secure your spot at the world's most immersive music events. Premium experiences, curated by the PULSE community.",
  );
  const ctaButtonLabel = useThemeContent('cta.button_label', 'Reserve Access');
  const [events, setEvents] = useState<EventListing[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

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
        const resolution = resolveEventsFailure(allowDemo, 'music');

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
    <div className="sonic-pulse-wrapper">
      {/* Hero Section */}
      <section className="sonic-hero" style={{ background: `url("${heroImage}") center/cover no-repeat` }} aria-labelledby="sonic-hero-title">
          <div className="sonic-hero-overlay"></div>
          <div className="sonic-hero-inner">
              <div className="sonic-hero-eyebrow">{heroEyebrow}</div>
              <h1 id="sonic-hero-title">
                {heroTitle.split('\n').map((line, index) => (
                  <React.Fragment key={`${line}-${index}`}>
                    {index > 0 && <br/>}
                    <span style={index > 0 ? { color: 'var(--neon-pink)' } : undefined}>{line}</span>
                  </React.Fragment>
                ))}
              </h1>
              <p className="sonic-hero-description">{heroDescription}</p>
              <div className="sonic-hero-actions">
                  <a href={themeLink('/explore')} className="sonic-btn-primary">{primaryCtaLabel}</a>
                  <a href={themeLink('/explore')} className="sonic-btn-outline">{secondaryCtaLabel}</a>
              </div>
          </div>
      </section>

      {/* Live Metrics Bar */}
      <section className="sonic-metrics-bar" aria-label="System Metrics">
          <div className="jt-metrics sonic-metrics-left">
              {metricsLeftText.split('|').map((item) => <span key={item.trim()}>{item.trim()}</span>)}
          </div>
          <div className="sonic-metrics-bpm">{metricsRightText}</div>
      </section>

      {/* Featured Lineup Section */}
      <section className="sonic-lineup-header" id="sonic-lineup-section" aria-labelledby="sonic-lineup-title">
          <span className="sonic-section-eyebrow sonic-section-eyebrow--lime">{lineupEyebrow}</span>
          <h2 id="sonic-lineup-title" className="sonic-lineup-title">{lineupTitle}</h2>
      </section>

      <section style={{ padding: '0 6% 8rem' }}>
          {useFallback && apiError && (
            <div className="evm-alert-slot" style={{ marginBottom: '2rem' }}>
              <CatalogSyncAlert variant="demo" error={apiError} classPrefix="evm" />
            </div>
          )}
          {apiError && !useFallback && (
            <div className="evm-alert-slot" style={{ marginBottom: '2rem' }}>
              <CatalogSyncAlert variant="production" error={apiError} classPrefix="evm" />
            </div>
          )}
          <div className="lineup-grid" style={{ padding: 0 }}>
              {loadingEvents ? (
                [1, 2, 3, 4].map((item) => (
                  <div className="artist-card-premium evm-listing-skeleton" key={item}>
                    <div className="evm-skeleton-image" />
                    <div className="evm-skeleton-line evm-skeleton-line-title" />
                    <div className="evm-skeleton-line evm-skeleton-line-short" />
                  </div>
                ))
              ) : events.length === 0 ? (
                <div className="evm-listing-state">
                  <div className="evm-listing-kicker">No Events Yet</div>
                  <h3>No live events are published yet.</h3>
                  <p>Add event records in the admin panel to populate this lineup grid.</p>
                </div>
              ) : (
                events.slice(0, 6).map((event, index) => {
                  const headliner = mapEventToHeadliner(event, index);
                  return (
                    <a className="evm-headliner-link" href={themeLink(`/product/${headliner.slug}`)} key={event.id}>
                      <div className="artist-card-premium">
                        <img src={headliner.image} alt={headliner.name} className="artist-img" />
                        <div className="artist-info">
                          <div className="evm-card-event-title">{headliner.event}</div>
                          <div className="artist-name">{headliner.name}</div>
                          <div className="evm-card-date">{headliner.date}</div>
                        </div>
                        <div className="evm-card-gradient"></div>
                      </div>
                    </a>
                  );
                })
              )}
          </div>
      </section>

      {/* Modular Lineup Grid (Underground Artists) */}
      <section className="sonic-support-header">
          <span className="sonic-section-eyebrow sonic-section-eyebrow--blue">{supportEyebrow}</span>
          <h3 className="sonic-support-title">{supportTitle}</h3>
      </section>
      <LineupGrid />

      {/* Experience Section */}
      <PulseExperience />

      {/* Masonry Gallery */}
      <section className="sonic-gallery-section" id="sonic-gallery-section" aria-labelledby="sonic-gallery-title">
          <h2 id="sonic-gallery-title" className="sonic-gallery-title">{galleryTitle}</h2>
          <div className="sonic-gallery-grid">
              {[16, 17, 18, 19, 20, 21].map((imgNum, idx) => (
                  <div key={idx} className="sonic-gallery-item">
                      <img src={`/themes/events/music/${imgNum}.webp`} alt={`Sonic Recap ${idx + 1}`} />
                  </div>
              ))}
          </div>
      </section>

      {/* Final CTA */}
      <section className="sonic-cta-section" id="sonic-cta-section" aria-labelledby="sonic-cta-title">
          <div className="sonic-cta-glow" aria-hidden="true"></div>
          <h2 id="sonic-cta-title" className="sonic-cta-title">
            {ctaTitle.split('\n').map((line, index) => (
              <React.Fragment key={`${line}-${index}`}>
                {index > 0 && <br/>}
                {line}
              </React.Fragment>
            ))}
          </h2>
          <p className="sonic-cta-description">{ctaDescription}</p>
          <a href={themeLink('/explore')} className="sonic-btn-primary sonic-cta-btn">{ctaButtonLabel}</a>
      </section>
    </div>
  );
}
