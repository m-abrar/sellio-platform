'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { StructureGrid, SkylineSyncBar } from './components';
import { scrollToSection } from './utils';

const icons = ['🏙️', '🏢', '🏗️', '🏬', '🏛️', '🏘️'];
const fallbackImages = [
  '/themes/properties/modern/1.webp',
  '/themes/properties/modern/2.webp',
  '/themes/properties/modern/3.webp',
  '/themes/properties/modern/4.webp',
  '/themes/properties/modern/5.webp',
  '/themes/properties/modern/6.webp',
];

function getPropertyPrice(property: Property) {
  return property.pricing?.price_formatted || (
    property.base_price ? `$${Number(property.base_price).toLocaleString()}` : 'Price on request'
  );
}

function getPropertyLocation(property: Property) {
  return property.location?.title || [property.city, property.state].filter(Boolean).join(', ') || property.address || 'Location TBA';
}

function getPropertyImage(property: Property, index: number) {
  return property.featured_image || property.thumbnail_image || fallbackImages[index % fallbackImages.length];
}

function mapPropertyToStructure(property: Property, index: number) {
  const area = property.specs?.area_formatted
    || (property.area_sq_ft ? `${Number(property.area_sq_ft).toLocaleString()} sqft` : 'Area TBA');

  return {
    title: property.title,
    units: String(property.specs?.total_units || property.maximum_guests || property.number_of_bedrooms || 1),
    area,
    icon: icons[index % icons.length],
    slug: property.slug,
    image: getPropertyImage(property, index),
    price: getPropertyPrice(property),
    location: getPropertyLocation(property),
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

        console.error('Failed to load properties modern listings:', error);
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

  const structureItems = properties.slice(0, 6).map(mapPropertyToStructure);
  const heroImage = properties[0] ? getPropertyImage(properties[0], 0) : fallbackImages[0];

  return (
    <div>
      <section className="urban-hero" id="urban-hero-section">
          <div className="urban-hero-copy">
              <div className="urban-hero-kicker">ARCHITECTURAL_DISTRIBUTION_V8</div>
              <h1>The <span>Urban</span> <br/>Authority.</h1>
              <p className="urban-hero-description">
                  The world's most advanced high-fidelity urban distribution node. Precision architectural engineering for the modern global skyline.
              </p>
              <div className="urban-hero-actions">
                  <button
                    type="button"
                    className="urban-btn-primary"
                    onClick={() => scrollToSection('urban-structure-grid')}
                  >
                    EXPLORE_SKYLINE
                  </button>
                  <button
                    type="button"
                    className="urban-btn-secondary"
                    onClick={() => scrollToSection('urban-precision-section')}
                  >
                    STRUCTURAL_SPEC
                  </button>
              </div>
          </div>
          <div className="urban-hero-visual">
              <div className="urban-hero-image-frame">
                  <img src={heroImage} alt="High-rise building skyline" className="urban-hero-image" />
              </div>
              <div className="urban-hero-stat-card">
                  <div className="urban-hero-stat-value">{loadingProperties ? '...' : properties.length || 0}</div>
                  <div className="urban-hero-stat-label">DISTRICT_NODES</div>
              </div>
          </div>
      </section>

      <SkylineSyncBar nodeCount={properties.length} />

      <StructureGrid items={structureItems} loading={loadingProperties} error={propertyError} />

      <section className="urban-precision-section" id="urban-precision-section">
          <div className="urban-precision-visual">
              <div className="urban-precision-image-frame">
                  <img src={fallbackImages[1]} alt="Modern architecture detail" className="urban-precision-image" />
              </div>
              <div className="urban-precision-accent" aria-hidden="true" />
          </div>
          <div className="urban-precision-copy">
              <span className="urban-section-kicker">STRUCTURAL_PRECISION</span>
              <h2>Skyline <br/>Engineering.</h2>
              <p>
                  The Urban Node protocol is built on a foundation of structural integrity. By synchronizing high-fidelity urban assets through a unified architectural registry, we ensure that every unit in the global skyline is represented with absolute precision.
              </p>
              <div className="urban-precision-stats">
                  <div>
                      <div className="urban-stat-value">100%</div>
                      <div className="urban-stat-label">INTEGRITY_SYNC</div>
                  </div>
                  <div>
                      <div className="urban-stat-value">Global</div>
                      <div className="urban-stat-label">DISTRIBUTION_NODE</div>
                  </div>
              </div>
          </div>
      </section>

      <section className="urban-final-cta" id="urban-final-cta">
          <div className="urban-final-cta-inner">
              <h2>Authorize Your <br/>Skyline.</h2>
              <p>
                  Connect your architectural node to the Urban Registry and join the world's most advanced high-fidelity distribution network.
              </p>
              <button
                type="button"
                className="urban-btn-primary urban-final-cta-btn"
                onClick={() => scrollToSection('urban-structure-grid')}
              >
                CONNECT_URBAN_NODE
              </button>
          </div>
      </section>
    </div>
  );
}
