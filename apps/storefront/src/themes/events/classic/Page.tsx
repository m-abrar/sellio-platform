'use client';

import React, { useEffect, useState } from 'react';
import type { EventListing } from '@sellio/types';
import { OccasionCard, BookingHUD } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/events/shared/CatalogSyncAlert';
import { fetchEventsHome, resolveEventsFailure } from '@/themes/events/shared/catalog';
import { mapEventToOccasion } from '@/themes/events/shared/event-utils';
import { useDemoFallbackAllowed } from '@/themes/events/shared/useDemoFallbackAllowed';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';

export default function Page() {
  const themeLink = useEventsThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const [events, setEvents] = useState<EventListing[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [patronSubmitted, setPatronSubmitted] = useState(false);
  const heroTitle = useThemeContent('hero.title', 'Cultural\nHeritage.');
  const heroDescription = useThemeContent(
    'hero.description',
    "A curated distribution of the world's most significant cultural repertoire. Authenticated experiences for the discerning patron."
  );
  const heroCta = useThemeContent('hero.primary_cta_label', 'Explore Repertoire');
  const trustItems = useThemeContent(
    'trust.items',
    'AUTHENTIC_INSTITUTIONAL_NODES|CURATED_ARTISTIC_PROTOCOL|GLOBAL_CULTURAL_EXCHANGE|PATRON_PRIVACY_SECURED'
  ).split('|').map((item) => item.trim()).filter(Boolean);
  const registryEyebrow = useThemeContent('collection.eyebrow', 'OFFICIAL_CULTURAL_REGISTRY');
  const registryTitle = useThemeContent('collection.title', 'The\nRepertoire.');
  const registryDescription = useThemeContent(
    'collection.description',
    "Our unified protocol synchronizes performance availability from the world's most significant institutional nodes."
  );
  const patronEyebrow = useThemeContent('patron.eyebrow', 'PATRON_CIRCLE_PROTOCOL');
  const patronTitle = useThemeContent('patron.title', "The Patron's\nCircle.");
  const patronDescription = useThemeContent(
    'patron.description',
    'Join an exclusive network of cultural institutions and patrons. Support the arts through the Sellio Legacy protocol and gain early access to premieres.'
  );
  const patronPerks = useThemeContent('patron.perks', 'Priority_Box|Private_Galas|Voting_Rights|Archive_Access').split('|').map((item) => item.trim()).filter(Boolean);
  const patronCardTitle = useThemeContent('patron.card_title', 'Become a Patron.');
  const patronCardDescription = useThemeContent(
    'patron.card_description',
    'Institutional inquiry nodes are currently active for the 2026/27 cycle. Submit your credentials for evaluation.'
  );
  const patronCardCta = useThemeContent('patron.card_cta_label', 'Request Institutional Access');

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      setLoadingEvents(true);
      const result = await fetchEventsHome(6);

      if (!isMounted) return;

      if (result.ok && result.response.data) {
        setEvents(Array.isArray(result.response.data) ? result.response.data : []);
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No events returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveEventsFailure(allowDemo, 'classic');

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

    return () => {
      isMounted = false;
    };
  }, [allowDemo]);

  return (
    <div className="events-classic-theme">
      <section className="ecl-hero" aria-labelledby="ecl-hero-title">
          <div style={{ width: '100px', height: '1px', background: 'var(--ecl-gold)', marginBottom: '4rem' }}></div>
          <h1 className="ecl-heading-xl" style={{ color: 'white' }} id="ecl-hero-title">
            {heroTitle.split('\n').map((line, index) => (
              <React.Fragment key={`${line}-${index}`}>
                {index > 0 && <br />}
                {index === heroTitle.split('\n').length - 1 ? <span className="ecl-italic">{line}</span> : line}
              </React.Fragment>
            ))}
          </h1>
          <p style={{ maxWidth: '750px', fontSize: '1.5rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginTop: '5rem', fontWeight: 300 }}>
              {heroDescription}
          </p>
          <div style={{ marginTop: '7rem' }}>
            <button className="ec-btn-primary" style={{ background: 'white', color: 'var(--ecl-burgundy)' }} id="ecl-btn-explore" onClick={() => document.getElementById('ecl-exchange-section')?.scrollIntoView({ behavior: 'smooth' })}>{heroCta}</button>
          </div>
      </section>

      <section className="ecl-trust-bar" aria-label="Artistic Integrity Status">
          {trustItems.map(logic => (
              <div key={logic} className="ecl-mono" style={{ fontSize: '0.65rem', opacity: 0.5 }}>{logic}</div>
          ))}
      </section>

      <section className="ecl-section ecl-hud-section" aria-label="Live Statistics Dashboard">
          <BookingHUD label="VERIFIED_VENUES" value="42" />
          <BookingHUD label="INSTITUTIONAL_NODES" value="156" />
          <BookingHUD label="PATRON_SYNC_SPEED" value="0.01s" />
          <BookingHUD label="ARCHIVE_STABILITY" value="100%" />
      </section>

      <section className="ecl-section" id="ecl-exchange-section" aria-labelledby="ecl-repertoire-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="ecl-mono" style={{ marginBottom: '1.5rem' }}>{registryEyebrow}</div>
                  <h2 className="ecl-heading-xl" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }} id="ecl-repertoire-title">
                    {registryTitle.split('\n').map((line, index) => (
                      <React.Fragment key={`${line}-${index}`}>
                        {index > 0 && ' '}
                        {index === registryTitle.split('\n').length - 1 ? <span className="ecl-italic">{line}</span> : line}
                      </React.Fragment>
                    ))}
                  </h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'rgba(26, 26, 26, 0.4)', lineHeight: 1.8 }}>
                  {registryDescription}
              </div>
          </div>

          {apiError && useFallback && (
            <div className="ecl-alert-slot">
              <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ecl" />
            </div>
          )}
          {apiError && !useFallback && (
            <div className="ecl-alert-slot">
              <CatalogSyncAlert variant="production" error={apiError} classPrefix="ecl" />
            </div>
          )}

          <div className="ec-repertoire-grid">
            {loadingEvents ? (
              [1, 2, 3, 4, 5, 6].map((item) => (
                <div className="ecl-occasion-card ecl-listing-skeleton" key={item}>
                  <div className="ecl-skeleton-line ecl-skeleton-line-title" />
                  <div className="ecl-skeleton-line" />
                  <div className="ecl-skeleton-line ecl-skeleton-line-short" />
                </div>
              ))
            ) : events.length === 0 ? (
              <div className="ecl-empty-state" role="status">
                <div className="ecl-listing-kicker">Empty Event Registry</div>
                <h3>No live events are published yet.</h3>
                <p>Add event records in the backend and this repertoire grid will hydrate automatically.</p>
              </div>
            ) : (
              events.slice(0, 6).map((event) => {
                const occasion = mapEventToOccasion(event);
                return (
                  <a className="ecl-occasion-link" href={themeLink(`/product/${occasion.slug}`)} key={event.id}>
                    <OccasionCard {...occasion} />
                  </a>
                );
              })
            )}
          </div>
      </section>

      <section className="ecl-section ecl-patron-section" id="ecl-patron-section" aria-labelledby="ecl-patron-title">
          <div style={{ padding: '8rem' }}>
              <div className="ecl-mono" style={{ marginBottom: '3rem' }}>{patronEyebrow}</div>
              <h2 className="ecl-heading-xl" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', marginBottom: '4rem' }} id="ecl-patron-title">
                {patronTitle.split('\n').map((line, index) => (
                  <React.Fragment key={`${line}-${index}`}>
                    {index > 0 && <br />}
                    {index === patronTitle.split('\n').length - 1 ? <span className="ecl-italic">{line}</span> : line}
                  </React.Fragment>
                ))}
              </h2>
              <p style={{ fontSize: '1.25rem', color: 'rgba(26, 26, 26, 0.4)', lineHeight: 2, marginBottom: '6rem', fontWeight: 300 }}>
                  {patronDescription}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }} className="ecl-patron-perks">
                  {patronPerks.map(item => (
                      <div key={item} style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--ecl-burgundy)', letterSpacing: '2px' }}>◆ {item.toUpperCase()}</div>
                  ))}
              </div>
          </div>
          <div style={{ padding: '8rem', background: '#fdfdfb', borderLeft: '1px solid var(--ecl-stone)', height: '100%' }}>
              <h3 style={{ fontFamily: 'var(--ecl-serif)', fontSize: '2.5rem', fontWeight: 900, marginBottom: '2.5rem', color: 'var(--ecl-burgundy)' }}>{patronCardTitle}</h3>
              <p style={{ color: 'rgba(26, 26, 26, 0.4)', lineHeight: 2, marginBottom: '4rem' }}>
                  {patronCardDescription}
              </p>
              {patronSubmitted ? (
                <div className="ecl-detail-success" role="status">Your patron inquiry has been recorded locally.</div>
              ) : (
                <button
                  type="button"
                  className="ecl-btn-primary"
                  style={{ width: '100%', padding: '2rem' }}
                  id="ecl-btn-patron-apply"
                  onClick={() => setPatronSubmitted(true)}
                >
                  {patronCardCta}
                </button>
              )}
          </div>
      </section>

      <div style={{ height: '10rem' }}></div>
    </div>
  );
}
