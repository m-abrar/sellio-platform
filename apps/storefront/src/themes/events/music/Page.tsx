'use client';

import React, { useEffect, useState } from 'react';
import type { EventListing } from '@sellio/types';
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
  const heroEyebrow = useThemeContent('hero.eyebrow', 'PULSE // LIVE TRANSMISSION');
  const heroTitle = useThemeContent('hero.title', 'FEEL THE\nMUSIC LIVE.');
  const heroDescription = useThemeContent(
    'hero.description',
    'Discover elite concerts and underground music festivals across the global sonic network. High-fidelity experiences for the modern listener.',
  );
  const heroImage = useThemeMedia('hero.image', '/themes/events/music/10.webp');
  const primaryCtaLabel = useThemeContent('hero.primary_cta_label', 'Get Your Tickets');
  const secondaryCtaLabel = useThemeContent('hero.secondary_cta_label', 'Explore Lineup');
  const metricsLeftText = useThemeContent('metrics.left_text', 'SYSTEM: OPTIMIZED | AUDIO: 120DB LIMIT | SYNC: VERIFIED');
  const metricsRightText = useThemeContent('metrics.right_text', 'BPM TRACKER: 128 (HOUSE)');
  const lineupEyebrow = useThemeContent('lineup.eyebrow', 'Elite Headliners');
  const lineupTitle = useThemeContent('lineup.title', 'The Core Lineup.');
  const supportEyebrow = useThemeContent('support.eyebrow', 'Underground Nodes');
  const supportTitle = useThemeContent('support.title', 'Sonic Support.');
  const galleryTitle = useThemeContent('gallery.title', 'Sonic Recaps.');
  const ctaTitle = useThemeContent('cta.title', 'Join the\nPulse.');
  const ctaDescription = useThemeContent(
    'cta.description',
    "Initialize your access for the world's most immersive music distribution network. High-fidelity experiences, verified by the PULSE sonic registry.",
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
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}></div>
          <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: 'var(--neon-blue)', letterSpacing: '12px', marginBottom: '2.5rem', fontWeight: 900 }}>{heroEyebrow}</div>
              <h1 id="sonic-hero-title">
                {heroTitle.split('\n').map((line, index) => (
                  <React.Fragment key={`${line}-${index}`}>
                    {index > 0 && <br/>}
                    <span style={index > 0 ? { color: 'var(--neon-pink)' } : undefined}>{line}</span>
                  </React.Fragment>
                ))}
              </h1>
              <p style={{ maxWidth: '700px', margin: '4rem auto 0', fontSize: '1.25rem', color: '#ccc', lineHeight: 1.8, fontWeight: 400 }}>
                  {heroDescription}
              </p>
              <div style={{ display: 'flex', gap: '3rem', marginTop: '6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href={themeLink('/explore')} className="sonic-btn-primary">{primaryCtaLabel}</a>
                  <a
                    href={themeLink('/explore')}
                    style={{ background: 'transparent', border: '2px solid var(--neon-blue)', color: 'white', padding: '1.5rem 5rem', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', borderRadius: '50px', boxShadow: '0 0 20px var(--neon-blue)', transition: 'all 0.3s ease', textDecoration: 'none', display: 'inline-block' }}
                  >
                    {secondaryCtaLabel}
                  </a>
              </div>
          </div>
      </section>

      {/* Live Metrics Bar */}
      <section style={{ padding: '3rem 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', borderTop: '1px solid var(--sonic-border)', borderBottom: '1px solid var(--sonic-border)', color: '#444', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '4px' }} aria-label="System Metrics">
          <style dangerouslySetInnerHTML={{ __html: `
            @media (max-width: 1024px) {
                .jt-metrics { display: none !important; }
            }
          ` }} />
          <div className="jt-metrics" style={{ display: 'flex', gap: '4rem' }}>
              {metricsLeftText.split('|').map((item) => <span key={item.trim()}>{item.trim()}</span>)}
          </div>
          <div style={{ color: 'var(--neon-lime)' }}>{metricsRightText}</div>
      </section>

      {/* Featured Lineup Section */}
      <section style={{ padding: '12rem 6% 4rem', textAlign: 'center' }} id="sonic-lineup-section" aria-labelledby="sonic-lineup-title">
          <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--neon-lime)', letterSpacing: '8px', textTransform: 'uppercase' }}>{lineupEyebrow}</span>
          <h2 id="sonic-lineup-title" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 900, marginTop: '2.5rem', textTransform: 'uppercase', letterSpacing: '4px' }}>{lineupTitle}</h2>
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
                  <div className="evm-listing-kicker">Empty Event Registry</div>
                  <h3>No live events are published yet.</h3>
                  <p>Add event records in the backend and this lineup grid will hydrate automatically.</p>
                </div>
              ) : (
                events.slice(0, 6).map((event, index) => {
                  const headliner = mapEventToHeadliner(event, index);
                  return (
                    <a className="evm-headliner-link" href={themeLink(`/product/${headliner.slug}`)} key={event.id}>
                      <div className="artist-card-premium">
                        <img src={headliner.image} alt={headliner.name} className="artist-img" />
                        <div className="artist-info">
                          <div style={{ fontSize: '0.7rem', color: 'var(--neon-blue)', fontWeight: 900, marginBottom: '0.5rem' }}>{headliner.event}</div>
                          <div className="artist-name">{headliner.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--neon-pink)', fontWeight: 800, marginTop: '1rem' }}>{headliner.date}</div>
                        </div>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)' }}></div>
                      </div>
                    </a>
                  );
                })
              )}
          </div>
      </section>

      {/* Modular Lineup Grid (Underground Artists) */}
      <section style={{ padding: '4rem 6% 8rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--neon-blue)', letterSpacing: '8px', textTransform: 'uppercase' }}>{supportEyebrow}</span>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 4rem)', fontWeight: 900, marginTop: '2rem', textTransform: 'uppercase', letterSpacing: '4px' }}>{supportTitle}</h3>
      </section>
      <LineupGrid />

      {/* Experience Section */}
      <PulseExperience />

      {/* Masonry Gallery */}
      <section style={{ padding: '12rem 6%' }} id="sonic-gallery-section" aria-labelledby="sonic-gallery-title">
          <h2 id="sonic-gallery-title" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 900, textAlign: 'center', marginBottom: '8rem', textTransform: 'uppercase', color: 'var(--neon-blue)', textShadow: '0 0 20px var(--neon-blue)' }}>{galleryTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {[16, 17, 18, 19, 20, 21].map((imgNum, idx) => (
                  <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--sonic-border)', transition: 'all 0.3s ease' }}>
                      <img src={`/themes/events/music/${imgNum}.webp`} alt={`Sonic Recap ${idx + 1}`} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
                  </div>
              ))}
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '15rem 6%', textAlign: 'center', position: 'relative', overflow: 'hidden' }} id="sonic-cta-section" aria-labelledby="sonic-cta-title">
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, var(--neon-pink) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(100px)' }}></div>
          <h2 id="sonic-cta-title" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 8vw, 8rem)', fontWeight: 900, marginBottom: '4rem', letterSpacing: '-2px', textTransform: 'uppercase', lineHeight: 0.9 }}>
            {ctaTitle.split('\n').map((line, index) => (
              <React.Fragment key={`${line}-${index}`}>
                {index > 0 && <br/>}
                {line}
              </React.Fragment>
            ))}
          </h2>
          <p style={{ maxWidth: '700px', margin: '0 auto 6rem', fontSize: '1.25rem', color: '#888', lineHeight: 1.8 }}>
              {ctaDescription}
          </p>
          <a href={themeLink('/explore')} className="sonic-btn-primary" style={{ padding: '2rem 10rem', fontSize: '1.5rem', display: 'inline-block', textDecoration: 'none' }}>{ctaButtonLabel}</a>
      </section>
    </div>
  );
}
