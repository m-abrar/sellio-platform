'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { UnifiedPropCard, MarketMetricsHUD } from './components';
import { getAdminBaseUrl } from '@/lib/admin-urls';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

const fallbackImages = [
  '/themes/properties/unified/1.webp',
  '/themes/properties/unified/2.webp',
  '/themes/properties/unified/3.webp',
  '/themes/properties/unified/4.webp',
  '/themes/properties/unified/5.webp',
  '/themes/properties/unified/6.webp',
  '/themes/properties/unified/7.webp',
  '/themes/properties/unified/8.webp',
];

function getPropertyPrice(property: Property) {
  return property.pricing?.price_formatted || (
    property.base_price ? `$${Number(property.base_price).toLocaleString()}` : 'Price on request'
  );
}

function getPropertyLocation(property: Property) {
  return property.location?.title || [property.city, property.state].filter(Boolean).join(', ') || property.address || 'Global Node';
}

function mapPropertyToCard(property: Property, index: number) {
  const type = property.specs?.property_type || property.specs?.category || 'RESIDENTIAL';

  return {
    title: property.title,
    price: getPropertyPrice(property),
    location: getPropertyLocation(property),
    type: typeof type === 'string' ? type.toUpperCase() : 'RESIDENTIAL',
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
        const response = await api.getProperties({ per_page: 8 });
        if (!isMounted) {
          return;
        }

        setProperties(Array.isArray(response.data) ? response.data : []);
        setPropertyError(null);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load properties unified listings:', error);
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
    <div className="uh-section">
      {/* Universal Hero */}
      <section className="uh-hero" aria-labelledby="uh-hero-title">
        <div>
          <div className="uh-mono" style={{ marginBottom: '2.5rem' }}>{useThemeContent('hero.kicker', 'UNIVERSAL_PROPERTY_PROTOCOL_V8')}</div>
          <h1 className="uh-heading-xl" id="uh-hero-title">
            {useThemeContent('hero.title', 'The Authoritative \nDistribution \nNode.').split('\n').map((line, i, arr) => {
              const highlight = useThemeContent('hero.highlight', 'Node.');
              const hasHighlight = line.includes(highlight);
              return (
                <React.Fragment key={i}>
                  {hasHighlight ? (
                    <>
                      {line.split(highlight).map((part, pIdx, pArr) => (
                        <React.Fragment key={pIdx}>
                          {part}
                          {pIdx < pArr.length - 1 && <span style={{ color: 'var(--uh-blue)' }}>{highlight}</span>}
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
          </h1>
          <p style={{ marginTop: '3rem', fontSize: '1.25rem', color: 'var(--uh-slate)', lineHeight: 1.8, maxWidth: '600px' }}>
            {useThemeContent('hero.description', 'A unified platform for residential, commercial, and industrial property distribution. High-fidelity data, institutional-grade verification, and global accessibility.')}
          </p>
          <div style={{ marginTop: '4rem', display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }} className="uh-hero-buttons">
            <button className="uh-btn-primary" id="uh-btn-explore" onClick={() => document.getElementById('uh-registry-grid')?.scrollIntoView({ behavior: 'smooth' })}>
              {useThemeContent('hero.primary_cta_label', 'Search All Assets')}
            </button>
            <button style={{
                background: 'transparent',
                border: '2px solid var(--uh-indigo)',
                color: 'var(--uh-indigo)',
                padding: '1.25rem 3.5rem',
                borderRadius: '8px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            }} id="uh-btn-list" onClick={() => window.open(adminCreatePropertyUrl, '_blank', 'noopener,noreferrer')}>
                {useThemeContent('hero.secondary_cta_label', 'List Asset')}
            </button>
          </div>
        </div>
        <div className="uh-hero-img-wrapper">
          <img src={useThemeMedia('hero.image', '/themes/properties/unified/1.webp')} alt="Universal Corporate Hub Property Layout" className="uh-hero-img" />
        </div>
      </section>

      {/* Metrics Bar */}
      <section style={{ margin: '6rem 0' }} aria-label="Market Performance HUD">
        <MarketMetricsHUD />
      </section>

      {/* Property Grid Section */}
      <section id="uh-registry-grid" aria-labelledby="uh-grid-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem', flexWrap: 'wrap', gap: '3rem' }}>
              <div>
                  <div className="uh-mono" style={{ marginBottom: '1.5rem' }}>{useThemeContent('grid.kicker', 'MASTER_REGISTRY')}</div>
                  <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, color: 'var(--uh-indigo)' }} id="uh-grid-title">
                    {useThemeContent('grid.title', 'High-Fidelity \nInventory.').split('\n').map((line, i, arr) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </h2>
              </div>
              <div style={{ maxWidth: '400px', fontSize: '0.95rem', color: 'var(--uh-slate)', lineHeight: 1.8 }}>
                  {useThemeContent('grid.description', 'Our unified protocol synchronizes metadata from multiple property verticals into a single authoritative and searchable catalog registry node.')}
              </div>
          </div>

          <div className="uh-prop-grid">
            {loadingProperties ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div className="uh-prop-card prop-listing-skeleton" key={item}>
                  <div className="prop-skeleton-line prop-skeleton-line-title" />
                  <div className="prop-skeleton-line" />
                  <div className="prop-skeleton-line prop-skeleton-line-short" />
                </div>
              ))
            ) : propertyError ? (
              <div className="prop-listing-state">
                <div className="prop-listing-kicker">{useThemeContent('offline.kicker', 'Property Sync Offline')}</div>
                <h3>{useThemeContent('offline.title', 'High-fidelity inventory could not be loaded.')}</h3>
                <p>{propertyError}</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="prop-listing-state">
                <div className="prop-listing-kicker">{useThemeContent('empty.kicker', 'Empty Property Registry')}</div>
                <h3>{useThemeContent('empty.title', 'No live properties are published yet.')}</h3>
                <p>{useThemeContent('empty.description', 'Add property records in the backend and this unified grid will hydrate automatically.')}</p>
              </div>
            ) : (
              properties.slice(0, 8).map((property, index) => {
                const card = mapPropertyToCard(property, index);
                return (
                  <a className="uh-prop-link" href={themeLink(`/product/${card.slug}`)} key={property.id}>
                    <UnifiedPropCard {...card} />
                  </a>
                );
              })
            )}
          </div>
      </section>

      {/* Scale CTA */}
      <section style={{ marginTop: '12rem', padding: '8rem 4rem', background: 'var(--uh-indigo)', color: 'white', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative', overflow: 'hidden' }} className="uh-cta-box" aria-labelledby="uh-cta-title">
          <div style={{ maxWidth: '800px', zIndex: 2 }}>
              <div className="uh-mono" style={{ color: 'var(--uh-blue)', marginBottom: '2.5rem' }}>{useThemeContent('cta.kicker', 'INSTITUTIONAL_SCALE')}</div>
              <h2 style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 900, letterSpacing: '-3px', marginBottom: '3rem', lineHeight: 1 }} id="uh-cta-title">
                {useThemeContent('cta.title', 'Scale Your \nPortfolio Globally.').split('\n').map((line, i, arr) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h2>
              <p style={{ fontSize: '1.25rem', opacity: 0.7, lineHeight: 1.8 }}>
                  {useThemeContent('cta.description', 'Our unified protocol allows for cross-vertical property management and distribution. Deploy your assets across the entire Sellio ecosystem with 100% nodal integrity.')}
              </p>
          </div>

          <div style={{ zIndex: 2 }}>
            <button className="uh-btn-primary" style={{ padding: '2rem 7rem', fontSize: '1.15rem' }} id="uh-btn-cta-initialize" onClick={() => router.push(themeLink('/'))}>
                {useThemeContent('cta.button_label', 'Initialize Master Node')}
            </button>
          </div>

          <div style={{ position: 'absolute', right: '-10%', bottom: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'var(--uh-blue)', opacity: 0.15, filter: 'blur(80px)' }}></div>
      </section>
    </div>
  );
}
