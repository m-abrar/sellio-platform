'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { CinematicPropertyCard, CuratorStats } from './components';
import { getAdminBaseUrl } from '@/lib/admin-urls';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

const fallbackImages = [
  '/themes/properties/showcase/9.webp',
  '/themes/properties/showcase/10.webp',
  '/themes/properties/showcase/11.webp',
  '/themes/properties/showcase/12.webp',
];

function getPropertyPrice(property: Property) {
  return property.pricing?.price_formatted || (
    property.base_price ? `$${Number(property.base_price).toLocaleString()}` : 'Price on request'
  );
}

function getPropertyLocation(property: Property) {
  return property.location?.title || [property.city, property.state, property.country].filter(Boolean).join(', ') || 'Exclusive Location';
}

function mapPropertyToShowcase(property: Property, index: number) {
  return {
    title: property.title,
    price: getPropertyPrice(property),
    location: getPropertyLocation(property),
    description: property.short_description || property.description || 'A curated architectural node synchronized from the Sellio property registry.',
    image: property.featured_image || property.thumbnail_image || fallbackImages[index % fallbackImages.length],
    slug: property.slug,
  };
}

export default function Page() {
  const router = useRouter();
  const themeLink = usePropertyThemeLink();
  const adminCreatePropertyUrl = `${getAdminBaseUrl()}/admin/properties/create`;
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [propertyError, setPropertyError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProperties() {
      try {
        const response = await api.getProperties({ per_page: 6 });
        if (!isMounted) {
          return;
        }

        setProperties(Array.isArray(response.data) ? response.data : []);
        setPropertyError(null);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load properties showcase listings:', error);
        setPropertyError(error instanceof Error ? error.message : 'Properties are temporarily unavailable.');
      } finally {
        if (isMounted) {
          setLoadingProperties(false);
        }
      }
    }

    loadProperties();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="ps-section">
      {/* Cinematic Hero */}
      <section className="ps-hero" aria-labelledby="ps-hero-title">
        <div className="ps-hero-line"></div>
        <div className="ps-mono" style={{ marginBottom: '4rem' }}>{useThemeContent('hero.kicker', 'CURATED_ATELIER_COLLECTION_V8')}</div>
        <h1 className="ps-heading-xl" id="ps-hero-title">
          {useThemeContent('hero.title', 'Living \nAs Art.').split('\n').map((line, i, arr) => (
            <React.Fragment key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </h1>
        <p style={{ maxWidth: '750px', fontSize: '1.75rem', fontWeight: 300, color: 'var(--ps-text-dim)', lineHeight: 1.6, marginTop: '6rem' }}>
            {useThemeContent('hero.description', "A curated distribution of the world's most significant architectural achievements. Synchronizing institutional curation with museum-grade provenance.")}
        </p>
        <div style={{ marginTop: '8rem', display: 'flex', gap: '4rem', flexWrap: 'wrap' }} className="ps-hero-buttons">
            <button className="ps-btn-primary" id="ps-btn-explore" onClick={() => document.getElementById('ps-story-grid')?.scrollIntoView({ behavior: 'smooth' })}>
              {useThemeContent('hero.primary_cta_label', 'Explore Curation')}
            </button>
            <button style={{ background: 'transparent', border: 'none', borderBottom: '2px solid var(--ps-canvas)', color: 'white', padding: '1rem 0', fontWeight: 900, fontSize: '1rem', letterSpacing: '4px', cursor: 'pointer' }} id="ps-btn-manifesto" onClick={() => router.push(themeLink('/'))}>
              {useThemeContent('hero.secondary_cta_label', 'READ_MANIFESTO')}
            </button>
        </div>
      </section>

      {/* Curation Intelligence HUD Section */}
      <section style={{ padding: '10rem 0' }} className="ps-curator-section" aria-labelledby="ps-hud-title">
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8rem', alignItems: 'center' }} className="ps-story-card">
            <div>
                <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 900, letterSpacing: '-3px', textTransform: 'uppercase', marginBottom: '4rem', lineHeight: 1 }} id="ps-hud-title">
                  {useThemeContent('curator.title', 'The Architecture \nof Provenance.').split('\n').map((line, i, arr) => {
                    const highlight = useThemeContent('curator.highlight', 'Provenance.');
                    const hasHighlight = line.includes(highlight);
                    return (
                      <React.Fragment key={i}>
                        {hasHighlight ? (
                          <>
                            {line.split(highlight).map((part, pIdx, pArr) => (
                              <React.Fragment key={pIdx}>
                                {part}
                                {pIdx < pArr.length - 1 && <span className="ps-italic" style={{ color: 'var(--ps-gold)' }}>{highlight}</span>}
                              </React.Fragment>
                            ))}
                          </>
                        ) : (
                          line
                        )}
                        {i < arr.length - 1 && <br />}
                      </React.Fragment>
                    );
                  })}
                </h2>
                <p style={{ fontSize: '1.35rem', color: 'var(--ps-text-dim)', lineHeight: 1.9 }}>
                    {useThemeContent('curator.description', 'Every property in the Atelier registry is hand-selected by our board of curators. We validate not just the integrity, but the historical and cultural significance of each node.')}
                </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }} className="ps-curator-stats-list">
                <CuratorStats value={useThemeContent('curator.stat_1_value', 'INSTITUTIONAL')} label={useThemeContent('curator.stat_1_label', 'CURATION_TIER')} />
                <CuratorStats value={useThemeContent('curator.stat_2_value', 'MUSEUM')} label={useThemeContent('curator.stat_2_label', 'GRADE_PROVENANCE')} />
                <CuratorStats value={useThemeContent('curator.stat_3_value', 'GLOBAL')} label={useThemeContent('curator.stat_3_label', 'DISTRIBUTION_SYNC')} />
            </div>
        </div>
      </section>

      {/* Property Showcase Grid */}
      <section id="ps-story-grid" aria-label="Curated Properties Showcase">
          {loadingProperties ? (
            [1, 2, 3, 4].map((item) => (
              <div className="ps-showcase-skeleton prop-listing-skeleton" key={item}>
                <div className="prop-skeleton-line prop-skeleton-line-title" />
                <div className="prop-skeleton-line" />
                <div className="prop-skeleton-line prop-skeleton-line-short" />
              </div>
            ))
          ) : propertyError ? (
            <div className="prop-listing-state ps-listing-state">
              <div className="prop-listing-kicker">{useThemeContent('offline.kicker', 'Property Sync Offline')}</div>
              <h3>{useThemeContent('offline.title', 'Curated showcase could not be loaded.')}</h3>
              <p>{propertyError}</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="prop-listing-state ps-listing-state">
              <div className="prop-listing-kicker">{useThemeContent('empty.kicker', 'Empty Property Registry')}</div>
              <h3>{useThemeContent('empty.title', 'No live properties are published yet.')}</h3>
              <p>{useThemeContent('empty.description', 'Add property records in the backend and this showcase will hydrate automatically.')}</p>
            </div>
          ) : (
            properties.slice(0, 6).map((property, index) => {
              const card = mapPropertyToShowcase(property, index);
              return (
                <a className="ps-showcase-link" href={themeLink(`/product/${card.slug}`)} key={property.id}>
                  <CinematicPropertyCard {...card} />
                </a>
              );
            })
          )}
      </section>

      {/* Philosophy Bar */}
      <div style={{ padding: '4rem 2rem', border: '1px solid var(--ps-shadow)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10rem 0', flexWrap: 'wrap', gap: '2rem' }} className="ps-philosophy-bar">
          {useThemeContent('philosophy.items', 'INSTITUTIONAL_CURATION|ARCHITECTURAL_INTEGRITY|HISTORIC_PRESERVATION|EDITORIAL_SYNC').split('|').map(trust => (
              <div key={trust} className="ps-mono" style={{ fontSize: '0.65rem', opacity: 0.4 }}>{trust}</div>
          ))}
      </div>

      {/* Final CTA */}
      <section style={{ marginTop: '10rem', padding: '12rem 4rem', background: 'radial-gradient(circle at center, #111 0%, #090909 100%)', border: '1px solid var(--ps-shadow)', textAlign: 'center' }} className="ps-cta-box" aria-labelledby="ps-cta-title">
          <div className="ps-mono" style={{ marginBottom: '4rem' }}>{useThemeContent('cta.kicker', 'BEGIN_YOUR_CURATION')}</div>
          <h2 style={{ fontFamily: 'var(--ps-font-serif)', fontSize: 'clamp(3rem, 8vw, 7rem)', fontWeight: 900, letterSpacing: '-4px', marginBottom: '6rem', lineHeight: 1 }} id="ps-cta-title">
            {useThemeContent('cta.title', 'Authorize Your \nCollection.').split('\n').map((line, i, arr) => {
              const highlight = useThemeContent('cta.highlight', 'Collection.');
              const hasHighlight = line.includes(highlight);
              return (
                <React.Fragment key={i}>
                  {hasHighlight ? (
                    <>
                      {line.split(highlight).map((part, pIdx, pArr) => (
                        <React.Fragment key={pIdx}>
                          {part}
                          {pIdx < pArr.length - 1 && <span className="ps-italic" style={{ color: 'var(--ps-gold)' }}>{highlight}</span>}
                        </React.Fragment>
                      ))}
                    </>
                  ) : (
                    line
                  )}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              );
            })}
          </h2>
          <p style={{ maxWidth: '800px', margin: '0 auto 6rem', color: 'var(--ps-text-dim)', fontSize: '1.35rem', lineHeight: 1.8 }}>
              {useThemeContent('cta.description', 'Our institutional nodes are currently accepting select inquiries for the 2026/27 global collection. Submit your provenance for review.')}
          </p>
          <button className="ps-btn-primary" id="ps-btn-cta-auth" onClick={() => router.push(themeLink('/'))}>
              {useThemeContent('cta.button_label', 'Request Private Access')}
          </button>
      </section>
    </div>
  );
}
