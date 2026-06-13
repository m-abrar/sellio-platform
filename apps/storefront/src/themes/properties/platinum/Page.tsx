'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { ShowcaseCard, StatisticsNode } from './components';
import { scrollToSection } from '@/themes/properties/shared/property-utils';
import { getAdminBaseUrl } from '@/lib/admin-urls';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

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
        <div className="pl-hero-kicker pl-mono">{useThemeContent('hero.kicker', 'Platinum Estates')}</div>
        <h1 className="pl-heading-xl">
          {useThemeContent('hero.title', 'Structural \nRefinement.').split('\n').map((line, i, arr) => (
            <React.Fragment key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </h1>
        <p className="pl-hero-description">
          {useThemeContent('hero.description', "A curated collection of the world's most significant private estates. Where raw materials meet refined billionaire-minimalist vision.")}
        </p>

        <button
          type="button"
          className="pl-scroll-indicator"
          onClick={() => scrollToSection('pl-showcase-section')}
          aria-label="Scroll to property showcase"
        >
          <span className="pl-mono">{useThemeContent('hero.scroll_label', 'DISCOVER')}</span>
          <div className="pl-scroll-line" />
        </button>
      </section>

      <section className="pl-section pl-protocol-section" id="pl-protocol-section">
        <div className="pl-protocol-grid">
          <div className="pl-protocol-copy">
            <h2>
              {useThemeContent('protocol.title', 'The Protocol \nof Acquisition.').split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
            <p>
              {useThemeContent('protocol.description', 'We do not merely list properties. We validate the architectural integrity, historical significance, and future appreciation of every property in our portfolio. Each acquisition is handled via our private concierge protocol.')}
            </p>
          </div>
          <div className="pl-protocol-stats">
            <StatisticsNode label={useThemeContent('protocol.stat_1_label', 'Off-Market')} value={useThemeContent('protocol.stat_1_value', '92%')} />
            <StatisticsNode label={useThemeContent('protocol.stat_2_label', 'Assets Under Management')} value={useThemeContent('protocol.stat_2_value', '$4.2B')} />
            <StatisticsNode label={useThemeContent('protocol.stat_3_label', 'Global Concierge')} value={useThemeContent('protocol.stat_3_value', '24/7')} />
          </div>
        </div>
      </section>

      <section className="pl-section pl-showcase-section" id="pl-showcase-section">
        <div className="pl-showcase-header">
          <div className="pl-mono">{useThemeContent('showcase.kicker', 'Property Showcase')}</div>
          <div className="pl-showcase-filter">
            {useThemeContent('showcase.filter_label', 'Platinum Collection')} · {loadingProperties ? '...' : properties.length} {useThemeContent('showcase.nodes_suffix', 'Properties')}
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
              <div className="prop-listing-kicker">{useThemeContent('offline.kicker', 'Connection Error')}</div>
              <h3>{useThemeContent('offline.title', 'Cinematic showcase could not be loaded.')}</h3>
              <p>Check your API connection and confirm properties are published in the admin panel.</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="prop-listing-state pl-listing-state">
              <div className="prop-listing-kicker">{useThemeContent('empty.kicker', 'No Properties Yet')}</div>
              <h3>{useThemeContent('empty.title', 'No live properties are published yet.')}</h3>
              <p>{useThemeContent('empty.description', 'Add property records in the admin panel and they will appear here.')}</p>
            </div>
          ) : (
            properties.slice(0, 6).map((property, index) => {
              const card = mapPropertyToShowcase(property, index);
              return (
                <a
                  className={`pl-showcase-link pl-${card.span}`}
                  href={themeLink(`/product/${card.slug}`)}
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
          <div className="pl-mono pl-cta-kicker">{useThemeContent('cta.kicker', 'Private Consultation')}</div>
          <h2>
            {useThemeContent('cta.title', 'Acquire Your \nLegacy.').split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <button
            type="button"
            className="pl-cta-btn"
            onClick={() => scrollToSection('pl-showcase-section')}
          >
            {useThemeContent('cta.button_label', 'Request an Invitation')}
          </button>
        </div>
      </section>
    </div>
  );
}
