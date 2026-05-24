'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { ShowcaseCard, StatisticsNode } from './components';

const spans = ['span-8', 'span-4', 'span-4', 'span-8', 'span-12', 'span-8'];
const fallbackImages = [
  '/themes/properties/platinum/1.webp',
  '/themes/properties/platinum/2.webp',
  '/themes/properties/platinum/3.webp',
  '/themes/properties/platinum/4.webp',
  '/themes/properties/platinum/5.webp',
];

function getPropertyPrice(property: Property) {
  return property.pricing?.price_formatted || (
    property.base_price ? `$${Number(property.base_price).toLocaleString()}` : 'Price on request'
  );
}

function mapPropertyToShowcase(property: Property, index: number) {
  return {
    title: property.title,
    price: getPropertyPrice(property),
    image: property.featured_image || property.thumbnail_image || fallbackImages[index % fallbackImages.length],
    span: spans[index % spans.length],
    slug: property.slug,
  };
}

export default function Page() {
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

        console.error('Failed to load properties platinum listings:', error);
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
    <div className="pl-section">
      {/* Platinum Hero */}
      <section className="pl-hero">
        <div className="pl-mono" style={{ color: 'var(--pl-gold)', marginBottom: '3rem' }}>ARCHITECTURAL_SUBLIMITY_V8</div>
        <h1 className="pl-heading-xl">
            Structural <br/>
            Refinement.
        </h1>
        <p style={{ marginTop: '5rem', maxWidth: '700px', fontSize: '1.5rem', color: 'var(--pl-text-dim)', lineHeight: 1.6 }}>
            A curated collection of the world's most significant private estates. Where raw materials meet refined billionaire-minimalist vision.
        </p>

        <div className="pl-scroll-indicator">
            <span className="pl-mono">DISCOVER</span>
            <div className="pl-scroll-line"></div>
        </div>
      </section>

      {/* Intelligence Section */}
      <section style={{ padding: '15rem 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10rem', alignItems: 'center' }}>
              <div>
                  <h2 style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '-3px', marginBottom: '4rem', textTransform: 'uppercase' }}>
                      The Protocol <br/>of Acquisition.
                  </h2>
                  <p style={{ fontSize: '1.25rem', color: 'var(--pl-text-dim)', lineHeight: 2 }}>
                      We do not merely list properties. We validate the architectural integrity, historical significance, and future appreciation of every node in our network. Each acquisition is handled via our private concierge protocol.
                  </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                  <StatisticsNode label="OFF_MARKET_NODES" value="92%" />
                  <StatisticsNode label="ASSETS_UNDER_SYNC" value="$4.2B" />
                  <StatisticsNode label="GLOBAL_CONCIERGE" value="24/7" />
              </div>
          </div>
      </section>

      {/* Bento Showcase Grid */}
      <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem' }}>
              <div className="pl-mono">CINEMATIC_SHOWCASE</div>
              <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--pl-text-dim)', letterSpacing: '2px' }}>
                  FILTER: LUXURY_TIER == "PLATINUM"
              </div>
          </div>

          <div className="pl-bento-grid">
            {loadingProperties ? (
              [1, 2, 3, 4, 5].map((item) => (
                <div className={`pl-showcase-skeleton ${spans[item % spans.length]}`} key={item}>
                  <div className="prop-skeleton-line prop-skeleton-line-title" />
                  <div className="prop-skeleton-line prop-skeleton-line-short" />
                </div>
              ))
            ) : propertyError ? (
              <div className="prop-listing-state pl-listing-state">
                <div className="prop-listing-kicker">Property Sync Offline</div>
                <h3>Cinematic showcase could not be loaded.</h3>
                <p>{propertyError}</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="prop-listing-state pl-listing-state">
                <div className="prop-listing-kicker">Empty Property Registry</div>
                <h3>No live properties are published yet.</h3>
                <p>Add property records in the backend and this platinum grid will hydrate automatically.</p>
              </div>
            ) : (
              properties.slice(0, 6).map((property, index) => {
                const card = mapPropertyToShowcase(property, index);
                return (
                  <a className="pl-showcase-link" href={`/product/${card.slug}`} key={property.id}>
                    <ShowcaseCard title={card.title} price={card.price} image={card.image} span={card.span} />
                  </a>
                );
              })
            )}
          </div>
      </section>

      {/* Private Inquiry CTA */}
      <section style={{ marginTop: '15rem', padding: '15rem 0', border: '1px solid var(--pl-border)', textAlign: 'center', position: 'relative', background: 'radial-gradient(circle at center, #111 0%, #000 100%)' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
              <div className="pl-mono" style={{ color: 'var(--pl-gold)', marginBottom: '3rem' }}>PRIVATE_CONSULTATION</div>
              <h2 style={{ fontSize: '6rem', fontWeight: 900, letterSpacing: '-4px', marginBottom: '5rem', textTransform: 'uppercase' }}>
                  Acquire Your <br/>Legacy.
              </h2>
              <button style={{
                  background: 'var(--pl-gold)',
                  color: 'black',
                  border: 'none',
                  padding: '2.5rem 8rem',
                  fontSize: '1rem',
                  fontWeight: 900,
                  letterSpacing: '4px',
                  cursor: 'pointer',
                  transition: 'var(--pl-transition)'
              }}>
                  REQUEST_INVITATION
              </button>
          </div>
      </section>
    </div>
  );
}
