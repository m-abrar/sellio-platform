'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { ShowcaseCard, StatisticsNode } from './components';
import { getThemeLink, scrollToSection } from './utils';

const spans = ['span-8', 'span-4', 'span-4', 'span-8', 'span-4', 'span-8'];
const fallbackImages = [
  '/themes/properties/platinum/1.webp',
  '/themes/properties/platinum/2.webp',
  '/themes/properties/platinum/3.webp',
  '/themes/properties/platinum/4.webp',
  '/themes/properties/platinum/5.webp',
  '/themes/properties/platinum/6.webp',
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
    <div className="pl-page">
      <section className="pl-hero" id="pl-hero-section">
        <div className="pl-hero-kicker pl-mono">ARCHITECTURAL_SUBLIMITY_V8</div>
        <h1 className="pl-heading-xl">
          Structural <br />
          Refinement.
        </h1>
        <p className="pl-hero-description">
          A curated collection of the world's most significant private estates. Where raw materials meet refined billionaire-minimalist vision.
        </p>

        <button
          type="button"
          className="pl-scroll-indicator"
          onClick={() => scrollToSection('pl-showcase-section')}
          aria-label="Scroll to property showcase"
        >
          <span className="pl-mono">DISCOVER</span>
          <div className="pl-scroll-line" />
        </button>
      </section>

      <section className="pl-section pl-protocol-section" id="pl-protocol-section">
        <div className="pl-protocol-grid">
          <div className="pl-protocol-copy">
            <h2>The Protocol <br />of Acquisition.</h2>
            <p>
              We do not merely list properties. We validate the architectural integrity, historical significance, and future appreciation of every node in our network. Each acquisition is handled via our private concierge protocol.
            </p>
          </div>
          <div className="pl-protocol-stats">
            <StatisticsNode label="OFF_MARKET_NODES" value="92%" />
            <StatisticsNode label="ASSETS_UNDER_SYNC" value="$4.2B" />
            <StatisticsNode label="GLOBAL_CONCIERGE" value="24/7" />
          </div>
        </div>
      </section>

      <section className="pl-section pl-showcase-section" id="pl-showcase-section">
        <div className="pl-showcase-header">
          <div className="pl-mono">CINEMATIC_SHOWCASE</div>
          <div className="pl-showcase-filter">
            FILTER: LUXURY_TIER == &quot;PLATINUM&quot; · {loadingProperties ? '...' : properties.length} NODES
          </div>
        </div>

        <div className="pl-bento-grid">
          {loadingProperties ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div className={`pl-showcase-skeleton pl-${spans[index % spans.length]}`} key={index}>
                <div className="prop-skeleton-line prop-skeleton-line-title" />
                <div className="prop-skeleton-line" />
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
                <a
                  className={`pl-showcase-link pl-${card.span}`}
                  href={getThemeLink(`/product/${card.slug}`)}
                  key={property.id}
                >
                  <ShowcaseCard title={card.title} price={card.price} image={card.image} />
                </a>
              );
            })
          )}
        </div>
      </section>

      <section className="pl-cta-section" id="pl-cta-section">
        <div className="pl-cta-inner">
          <div className="pl-mono pl-cta-kicker">PRIVATE_CONSULTATION</div>
          <h2>Acquire Your <br />Legacy.</h2>
          <button
            type="button"
            className="pl-cta-btn"
            onClick={() => scrollToSection('pl-showcase-section')}
          >
            REQUEST_INVITATION
          </button>
        </div>
      </section>
    </div>
  );
}
