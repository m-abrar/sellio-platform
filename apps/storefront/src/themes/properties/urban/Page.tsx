'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { BrutalistUnitCard, StructuralStat } from './components';
import { getAdminBaseUrl } from '@/lib/admin-urls';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

const fallbackImages = [
  '/themes/properties/urban/9.webp',
  '/themes/properties/urban/10.webp',
  '/themes/properties/urban/11.webp',
  '/themes/properties/urban/12.webp',
  '/themes/properties/urban/13.webp',
  '/themes/properties/urban/14.webp',
];

function getPropertyPrice(property: Property) {
  return property.pricing?.price_formatted || (
    property.base_price ? `$${Number(property.base_price).toLocaleString()}` : 'Price on request'
  );
}

function getPropertyLocation(property: Property) {
  return property.location?.title || [property.city, property.state].filter(Boolean).join(', ') || property.address || 'Urban Node';
}

function mapPropertyToUnit(property: Property, index: number) {
  const sqft = property.specs?.area_formatted?.replace(/[^\d]/g, '')
    || String(property.area_sq_ft || property.specs?.area_sq_ft || '');

  return {
    title: property.title,
    price: getPropertyPrice(property),
    location: getPropertyLocation(property),
    beds: String(property.specs?.bedrooms ?? property.number_of_bedrooms ?? 1),
    sqft: sqft || 'N/A',
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

        console.error('Failed to load properties urban listings:', error);
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
    <div className="pu-section">
      {/* Brutalist Hero */}
      <section className="pu-hero" aria-labelledby="pu-hero-title">
        <div>
          <div className="pu-mono" style={{ color: 'var(--pu-cobalt)', marginBottom: '3rem' }}>{useThemeContent('hero.kicker', 'URBAN_LIVING_V8_DISTRIBUTION')}</div>
          <h1 className="pu-heading-xl" id="pu-hero-title">
            {useThemeContent('hero.title', 'Skyline \nRegistry.').split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p style={{ marginTop: '3rem', fontSize: '1.25rem', color: 'var(--pu-text-muted)', lineHeight: 2, maxWidth: '500px' }}>
            {useThemeContent('hero.description', 'Modern sanctuaries in the heart of the high-fidelity city. Discover curated lofts, penthouses, and studios engineered for the vertical lifestyle.')}
          </p>
          <div style={{ marginTop: '4rem', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <button className="pu-btn-primary" id="pu-btn-explore" onClick={() => document.getElementById('pu-registry-grid')?.scrollIntoView({ behavior: 'smooth' })}>
              {useThemeContent('hero.primary_cta_label', 'Explore Inventory')}
            </button>
            <button style={{
                background: 'transparent',
                border: '2px solid var(--pu-steel)',
                color: 'var(--pu-steel)',
                padding: '1.5rem 4rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            }} id="pu-btn-list" onClick={() => window.open(adminCreatePropertyUrl, '_blank', 'noopener,noreferrer')}>
              {useThemeContent('hero.secondary_cta_label', 'List Unit')}
            </button>
          </div>
        </div>
        <div className="pu-hero-image-wrapper">
          <img src={useThemeMedia('hero.image', '/themes/properties/urban/1.webp')} alt="High-Rise Urban Skyline Architectural Framework" className="pu-hero-image" />
        </div>
      </section>

      {/* Intelligence Section */}
      <section style={{ padding: '8rem 0' }} className="pu-intelligence-section" aria-labelledby="pu-intel-title">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '6rem', alignItems: 'center' }} className="pu-hero">
              <div>
                  <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, lineHeight: 1.1, textTransform: 'uppercase', marginBottom: '3rem', color: 'var(--pu-steel)' }} id="pu-intel-title">
                    {useThemeContent('intel.title', 'Connected \nIntelligence.').split('\n').map((line, i, arr) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </h2>
                  <p style={{ color: 'var(--pu-text-muted)', lineHeight: 1.8, fontSize: '1.1rem' }}>
                      {useThemeContent('intel.description', 'Our urban nodes are equipped with high-fidelity smart-grid technologies, ensuring absolute connectivity and architectural precision for the modern dweller.')}
                  </p>
              </div>
              <div className="pu-stats-grid">
                  <StructuralStat value={useThemeContent('intel.stat_1_value', '10Gb')} label={useThemeContent('intel.stat_1_label', 'STANDARD_FIBER')} />
                  <StructuralStat value={useThemeContent('intel.stat_2_value', 'A+')} label={useThemeContent('intel.stat_2_label', 'ENERGY_RATING')} />
                  <StructuralStat value={useThemeContent('intel.stat_3_value', '24h')} label={useThemeContent('intel.stat_3_label', 'CONCIERGE_NODE')} />
                  <StructuralStat value={useThemeContent('intel.stat_4_value', 'EV')} label={useThemeContent('intel.stat_4_label', 'CHARGING_SYNC')} />
              </div>
          </div>
      </section>

      {/* Unit Grid */}
      <section id="pu-registry-grid" aria-labelledby="pu-grid-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem', flexWrap: 'wrap', gap: '2rem' }}>
              <div>
                <div className="pu-mono" style={{ marginBottom: '1rem' }}>{useThemeContent('grid.kicker', 'REGISTRY_COLLECTION // 2026')}</div>
                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, textTransform: 'uppercase', margin: 0 }} id="pu-grid-title">{useThemeContent('grid.title', 'Registry Node Units')}</h2>
              </div>
              <div style={{ maxWidth: '400px', fontSize: '0.95rem', color: 'var(--pu-text-muted)', lineHeight: 1.8 }}>
                  {useThemeContent('grid.description', 'Every architectural unit is synchronized with our global registry node, ensuring 100% data integrity and availability status.')}
              </div>
          </div>

          <div className="pu-unit-grid">
            {loadingProperties ? (
              [1, 2, 3, 4, 5, 6].map((item) => (
                <div className="pu-unit-card prop-listing-skeleton" key={item}>
                  <div className="prop-skeleton-line prop-skeleton-line-title" />
                  <div className="prop-skeleton-line" />
                  <div className="prop-skeleton-line prop-skeleton-line-short" />
                </div>
              ))
            ) : propertyError ? (
              <div className="prop-listing-state">
                <div className="prop-listing-kicker">{useThemeContent('offline.kicker', 'Property Sync Offline')}</div>
                <h3>{useThemeContent('offline.title', 'Registry units could not be loaded.')}</h3>
                <p>{propertyError}</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="prop-listing-state">
                <div className="prop-listing-kicker">{useThemeContent('empty.kicker', 'Empty Property Registry')}</div>
                <h3>{useThemeContent('empty.title', 'No live properties are published yet.')}</h3>
                <p>{useThemeContent('empty.description', 'Add property records in the backend and this urban grid will hydrate automatically.')}</p>
              </div>
            ) : (
              properties.slice(0, 6).map((property, index) => {
                const unit = mapPropertyToUnit(property, index);
                return (
                  <a className="pu-unit-link" href={themeLink(`/product/${unit.slug}`)} key={property.id}>
                    <BrutalistUnitCard {...unit} />
                  </a>
                );
              })
            )}
          </div>
      </section>

      {/* Neighborhood CTA */}
      <section style={{ marginTop: '10rem', padding: '10rem 10%', background: 'var(--pu-steel)', color: 'white', textAlign: 'center' }} className="pu-cta-box" aria-labelledby="pu-cta-title">
          <div className="pu-mono" style={{ color: 'var(--pu-cobalt)', marginBottom: '3rem' }}>{useThemeContent('cta.kicker', 'CITY_PULSE_PROTOCOL')}</div>
          <h2 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 700, letterSpacing: '-3px', textTransform: 'uppercase', marginBottom: '4rem', lineHeight: 1 }} id="pu-cta-title">
            {useThemeContent('cta.title', 'Live in the \nPulse of the City.').split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <p style={{ maxWidth: '700px', margin: '0 auto 6rem', opacity: 0.6, fontSize: '1.25rem', lineHeight: 1.8 }}>
              {useThemeContent('cta.description', 'From the industrial lofts of the Arts District to the high-energy penthouses of the Financial Center, find the urban node that matches your frequency.')}
          </p>
          <button className="pu-btn-primary" style={{ padding: '2.5rem 8rem', fontSize: '1.2rem' }} id="pu-btn-cta-auth" onClick={() => router.push(themeLink('/'))}>
              {useThemeContent('cta.button_label', 'Authorize District Sync')}
          </button>
      </section>
    </div>
  );
}
