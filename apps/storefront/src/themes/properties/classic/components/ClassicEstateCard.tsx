'use client';

import React from 'react';
import type { Property } from '@sellio/types';
import { useClassicListingLink } from '../hooks/useClassicThemeLink';

interface Props {
  title?: string;
  price?: string;
  location?: string;
  year?: string | number;
  image?: string;
  isFeatured?: boolean;
  property?: Property;
}

export const EstateCard = ({ title, price, location, year, image, isFeatured, property }: Props) => {
  const listingLink = useClassicListingLink();
  const displayTitle = property?.title || title || 'Heritage Residence';
  const displayPrice = property?.pricing?.price_formatted || price || '$1,000,000';

  const displayLocation = property?.location?.title
    ? `${property.location.title}, ${property.location.country || ''}`
    : (property?.city && property?.country ? `${property.city}, ${property.country}` : (location || 'Global Registry'));

  const displayYear = property?.specs?.year_built || property?.year_built || year || '1800';
  const displayImage = property?.featured_image || property?.thumbnail_image || image || '/themes/properties/classic/1.webp';
  const displayFeatured = property?.is_featured || property?.status?.is_featured || isFeatured;

  const beds = property?.specs?.bedrooms ?? property?.number_of_bedrooms ?? 4;
  const baths = property?.specs?.bathrooms ?? property?.number_of_bathrooms ?? 3;
  const area = property?.specs?.area_formatted || (property?.area_sq_ft ? `${property.area_sq_ft.toLocaleString()} SQFT` : '4,200 SQFT');
  const desc = property?.short_description || (property?.description ? (`${property.description.substring(0, 110)}...`) : 'A significant historic residence featuring verified manorial rights and architectural integrity.');

  const slug = property?.slug;
  const cardLink = slug ? listingLink(slug) : '#';

  return (
    <a href={cardLink} className="pc-estate-card-link">
      <div className="pc-estate-card">
        <div className="pc-image-container">
          <img src={displayImage} alt={displayTitle} />

          {displayFeatured && (
            <div className="pc-estate-featured-badge">
              FEATURED ESTATE
            </div>
          )}

          <div className="pc-card-meta">
            <div>
              <div className="pc-caps pc-card-meta-label">Provenance</div>
              <div className="pc-card-meta-value">EST. {displayYear}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="pc-caps pc-card-meta-label">Valuation</div>
              <div className="pc-card-meta-value">{displayPrice}</div>
            </div>
          </div>
        </div>

        <div className="pc-estate-card-body">
          <div className="pc-estate-location-row">
            <span className="pc-caps" style={{ color: 'var(--pc-teal)', opacity: 0.6, fontSize: '0.7rem' }}>{displayLocation}</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--pc-border)' }} />
            <span style={{ color: 'var(--pc-teal)', fontSize: '1.2rem', opacity: 0.4 }} aria-hidden="true">❦</span>
          </div>
          <h3 className="pc-serif pc-estate-card-title">{displayTitle}</h3>
          <p>{desc}</p>
          <div className="pc-estate-card-specs pc-caps">
            <span>{beds} BEDS</span>
            <span>{baths} BATHS</span>
            <span>{area}</span>
          </div>
        </div>
      </div>
    </a>
  );
};
