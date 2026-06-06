'use client';

import React from 'react';
import type { Property } from '@sellio/types';
import { collectPropertyImages, getPropertyLocation, getPropertyPrice } from '../property-utils';
import { useModernThemeLink } from '../hooks/useModernThemeLink';

interface RelatedStructuresProps {
  properties: Property[];
}

export function RelatedStructures({ properties }: RelatedStructuresProps) {
  const themeLink = useModernThemeLink();

  if (!properties.length) return null;

  return (
    <section className="pm-related-section">
      <div className="pm-related-section__header">
        <span className="structure-grid-kicker">Similar listings</span>
        <h2>Related properties</h2>
      </div>
      <div className="pm-related-grid">
        {properties.map((property, index) => (
          <a
            key={property.id}
            className="prop-structure-link"
            href={themeLink(`/product/${property.slug}`)}
          >
            <article className="structure-card-premium pm-related-card">
              <div className="structure-card-image">
                <img
                  src={collectPropertyImages(property, index)[0]}
                  alt={property.title}
                  loading="lazy"
                />
              </div>
              <div className="structure-card-body">
                <h3>{property.title}</h3>
                <p className="structure-card-location">{getPropertyLocation(property)}</p>
                <div className="structure-card-price">{getPropertyPrice(property)}</div>
              </div>
            </article>
          </a>
        ))}
      </div>
    </section>
  );
}
