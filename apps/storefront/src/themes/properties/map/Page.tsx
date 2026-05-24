'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { MapListCard, MapPriceMarker, MapHUD } from './components';

const fallbackImages = [
  '/themes/properties/map/1.webp',
  '/themes/properties/map/2.webp',
  '/themes/properties/map/3.webp',
  '/themes/properties/map/4.webp',
  '/themes/properties/map/5.webp',
  '/themes/properties/map/6.webp',
];

function getPropertyPrice(property: Property) {
  return property.pricing?.price_formatted || (
    property.base_price ? `$${Number(property.base_price).toLocaleString()}` : 'Price on request'
  );
}

function mapPropertyToListing(property: Property, index: number) {
  const sqft = property.specs?.area_formatted?.replace(/[^\d,]/g, '')
    || String(property.area_sq_ft || property.specs?.area_sq_ft || '');

  return {
    price: getPropertyPrice(property),
    address: property.address || [property.city, property.state, property.country].filter(Boolean).join(', ') || 'Address TBA',
    beds: property.specs?.bedrooms ?? property.number_of_bedrooms ?? 1,
    baths: property.specs?.bathrooms ?? property.number_of_bathrooms ?? 1,
    sqft: sqft || 'N/A',
    image: property.featured_image || property.thumbnail_image || fallbackImages[index % fallbackImages.length],
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

        console.error('Failed to load properties map listings:', error);
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

  const listings = properties.slice(0, 6).map(mapPropertyToListing);

  return (
    <>
      <aside className="pm-sidebar">
        <div className="pm-sidebar-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Registry Nodes</h2>
                <span className="pm-marker" style={{ position: 'relative', top: 0, left: 0, padding: '0.25rem 0.75rem', fontSize: '0.65rem' }}>
                  {loadingProperties ? '...' : `${listings.length} UNITS`}
                </span>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                {['FILTER', 'PRICE', 'TYPE'].map(btn => (
                    <button key={btn} style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--pm-border)',
                        color: 'white',
                        padding: '0.5rem',
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        borderRadius: '4px',
                        letterSpacing: '1px'
                    }}>
                        {btn}
                    </button>
                ))}
            </div>
        </div>

        <div className="pm-results-list">
          {loadingProperties ? (
            [1, 2, 3, 4, 5, 6].map((item) => (
              <div className="pm-list-card prop-listing-skeleton" key={item}>
                <div className="prop-skeleton-line prop-skeleton-line-title" />
                <div className="prop-skeleton-line" />
                <div className="prop-skeleton-line prop-skeleton-line-short" />
              </div>
            ))
          ) : propertyError ? (
            <div className="prop-listing-state pm-listing-state">
              <div className="prop-listing-kicker">Property Sync Offline</div>
              <h3>Registry nodes could not be loaded.</h3>
              <p>{propertyError}</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="prop-listing-state pm-listing-state">
              <div className="prop-listing-kicker">Empty Property Registry</div>
              <h3>No live properties are published yet.</h3>
              <p>Add property records in the backend and this map registry will hydrate automatically.</p>
            </div>
          ) : (
            listings.map((item) => (
              <a className="pm-list-link" href={`/product/${item.slug}`} key={item.slug}>
                <MapListCard {...item} />
              </a>
            ))
          )}
          {!loadingProperties && !propertyError && listings.length > 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.2 }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⌬</div>
                <div className="pm-hud-label">END_OF_REGISTRY</div>
            </div>
          )}
        </div>
      </aside>

      <main className="pm-map-canvas">
        <div className="pm-map-mock"></div>

        {/* Simulated Interactive Map with Markers */}
        <MapPriceMarker price="$1.25M" top="20%" left="30%" />
        <MapPriceMarker price="$2.8M" top="45%" left="60%" />
        <MapPriceMarker price="$950K" top="70%" left="40%" />
        <MapPriceMarker price="$4.5M" top="30%" left="80%" />
        <MapPriceMarker price="$1.1M" top="65%" left="20%" />
        <MapPriceMarker price="$1.85M" top="15%" left="75%" />

        <MapHUD />

        {/* Map UI Overlays */}
        <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {['+', '−', '⌖'].map(icon => (
                <button key={icon} style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--pm-glass)',
                    border: '1px solid var(--pm-border)',
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '1.25rem',
                    cursor: 'pointer'
                }}>
                    {icon}
                </button>
            ))}
        </div>
      </main>
    </>
  );
}
