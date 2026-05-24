'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { NeighborPropertyCard, LocalInsightHUD } from './components';

const fallbackImages = [
  '/themes/properties/neighborhood/1.webp',
  '/themes/properties/neighborhood/2.webp',
  '/themes/properties/neighborhood/3.webp',
  '/themes/properties/neighborhood/4.webp',
  '/themes/properties/neighborhood/5.webp',
  '/themes/properties/neighborhood/6.webp',
];

const statusLabels = ['New', 'Active', 'Hot', 'Pending'];

function getPropertyPrice(property: Property) {
  return property.pricing?.price_formatted || (
    property.base_price ? `$${Number(property.base_price).toLocaleString()}` : 'Price on request'
  );
}

function getPropertyLocation(property: Property) {
  return property.location?.title || property.city || property.address || 'Neighborhood Node';
}

function mapPropertyToHome(property: Property, index: number) {
  return {
    title: property.title,
    price: getPropertyPrice(property),
    location: getPropertyLocation(property),
    status: property.is_featured ? 'Hot' : statusLabels[index % statusLabels.length],
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

        console.error('Failed to load properties neighborhood listings:', error);
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
    <div className="pn-section">
      {/* Community Hero */}
      <section className="pn-hero">
        <div>
          <div className="pn-mono" style={{ marginBottom: '2.5rem' }}>COMMUNITY_RESIDENTIAL_PROTOCOL_V8</div>
          <h1 className="pn-heading-xl">
            Find Your <br/>
            Place in the <br/>
            <span style={{ color: 'var(--pn-sage)' }}>Community.</span>
          </h1>
          <p style={{ marginTop: '4rem', fontSize: '1.25rem', color: 'var(--pn-text-muted)', lineHeight: 1.8, maxWidth: '550px' }}>
            A warm, neighborly approach to property distribution. Verified family homes in high-trust neighborhood nodes with integrated local insights.
          </p>
          <div style={{ marginTop: '6rem', display: 'flex', gap: '2.5rem' }}>
            <button className="pn-btn-primary">Search_Homes</button>
            <button style={{
                background: 'transparent',
                border: '2px solid var(--pn-forest)',
                color: 'var(--pn-forest)',
                padding: '1.25rem 3.5rem',
                borderRadius: '100px',
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'var(--pn-font-heading)'
            }}>
                Local_Guides
            </button>
          </div>
        </div>
        <div className="pn-hero-img-wrapper">
          <img src="/themes/properties/neighborhood/7.webp" alt="Neighborhood Living" className="pn-hero-img" />

          <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', background: 'white', padding: '2rem', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid var(--pn-border)' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }}></div>
                  <div className="pn-mono" style={{ fontSize: '0.65rem' }}>NEIGHBORHOOD_SAFETY_INDEX: 98%</div>
              </div>
          </div>
        </div>
      </section>

      {/* Local Insight HUD Bar */}
      <div style={{ padding: '4rem', background: 'white', borderRadius: '100px', border: '1px solid var(--pn-border)', display: 'flex', justifyContent: 'center', margin: '8rem 0' }}>
          <LocalInsightHUD label="SCHOOL_NODE_RATING" value="A+ SUPERIOR" />
          <LocalInsightHUD label="TOP_RATED_SCHOOLS" value="12" />
          <LocalInsightHUD label="AVG_COMMUTE" value="18 MIN" />
          <div style={{ padding: '0 3rem', textAlign: 'center' }}>
              <div className="pn-mono" style={{ marginBottom: '0.75rem', fontSize: '0.65rem' }}>COMMUNITY_EVENTS</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--pn-forest)' }}>42 ACTIVE</div>
          </div>
      </div>

      {/* Property Grid */}
      <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="pn-mono" style={{ marginBottom: '1.5rem' }}>RESIDENTIAL_INVENTORY</div>
                  <h2 style={{ fontFamily: 'var(--pn-font-heading)', fontSize: '4.5rem', fontWeight: 800, letterSpacing: '-2px' }}>Neighborly <br/>Homes.</h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'var(--pn-text-muted)', lineHeight: 1.8 }}>
                  Our neighborhood protocol ensures every family home is verified and synchronized with local lifestyle metadata.
              </div>
          </div>

          <div className="pn-home-grid">
            {loadingProperties ? (
              [1, 2, 3, 4, 5, 6].map((item) => (
                <div className="pn-home-card prop-listing-skeleton" key={item}>
                  <div className="prop-skeleton-line prop-skeleton-line-title" />
                  <div className="prop-skeleton-line" />
                  <div className="prop-skeleton-line prop-skeleton-line-short" />
                </div>
              ))
            ) : propertyError ? (
              <div className="prop-listing-state">
                <div className="prop-listing-kicker">Property Sync Offline</div>
                <h3>Neighborly homes could not be loaded.</h3>
                <p>{propertyError}</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="prop-listing-state">
                <div className="prop-listing-kicker">Empty Property Registry</div>
                <h3>No live properties are published yet.</h3>
                <p>Add property records in the backend and this neighborhood grid will hydrate automatically.</p>
              </div>
            ) : (
              properties.slice(0, 6).map((property, index) => {
                const home = mapPropertyToHome(property, index);
                return (
                  <a className="pn-home-link" href={`/product/${home.slug}`} key={property.id}>
                    <NeighborPropertyCard {...home} />
                  </a>
                );
              })
            )}
          </div>
      </section>

      {/* Community / Philosophy Section */}
      <section style={{ marginTop: '20rem', padding: '12rem 8%', background: 'white', borderRadius: 'var(--pn-radius)', border: '1px solid var(--pn-border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12rem', alignItems: 'center' }}>
          <div>
              <h2 style={{ fontFamily: 'var(--pn-font-heading)', fontSize: '5rem', fontWeight: 800, letterSpacing: '-3px', marginBottom: '4rem', lineHeight: 1 }}>Better <br/>Together.</h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--pn-text-muted)', lineHeight: 2, marginBottom: '6rem' }}>
                  Our neighborhood vertical is designed to help you find more than just a house. We help you find a community that synchronizes with your lifestyle.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem' }}>
                  <div>
                      <div style={{ fontSize: '3.5rem', fontFamily: 'var(--pn-font-heading)', fontWeight: 800, color: 'var(--pn-sage)' }}>100%</div>
                      <div className="pn-mono" style={{ fontSize: '0.6rem' }}>VERIFIED_LISTINGS</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '3.5rem', fontFamily: 'var(--pn-font-heading)', fontWeight: 800, color: 'var(--pn-sage)' }}>24/7</div>
                      <div className="pn-mono" style={{ fontSize: '0.6rem' }}>HOOD_SUPPORT</div>
                  </div>
              </div>
          </div>
          <div style={{ padding: '6rem', background: 'var(--pn-cream)', borderRadius: '48px', border: '1px solid var(--pn-border)' }}>
              <div className="pn-mono" style={{ marginBottom: '2.5rem' }}>JOIN_THE_NEIGHBORHOOD</div>
              <h3 style={{ fontFamily: 'var(--pn-font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: '2.5rem' }}>Synchronize with <br/>Your Community.</h3>
              <p style={{ color: 'var(--pn-text-muted)', lineHeight: 2, marginBottom: '5rem' }}>
                  Receive local alerts, school updates, and community event news directly through your Sellio Hood node.
              </p>
              <button className="pn-btn-primary" style={{ width: '100%', padding: '2rem', fontSize: '1.1rem', background: 'var(--pn-forest)' }}>
                  CREATE_COMMUNITY_PROFILE
              </button>
          </div>
      </section>

      {/* Final Space */}
      <div style={{ height: '10rem' }}></div>
    </div>
  );
}
