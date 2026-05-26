
import React from 'react';
import type { Property } from '@sellio/types';

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
  const desc = property?.short_description || (property?.description ? (property.description.substring(0, 110) + '...') : 'A significant historic residence featuring verified manorial rights and architectural integrity.');

  const slug = property?.slug;

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        const themeKey = window.location.pathname.split('/')[2];
        return `/preview/${themeKey}${path}`;
      }
    }
    return path;
  };

  const cardLink = slug ? getThemeLink(`/product/${slug}`) : '#';

  return (
    <a href={cardLink} style={{ textDecoration: 'none', color: 'inherit' }} className="pc-estate-card-link">
      <div className="pc-estate-card" style={{ cursor: 'pointer' }}>
        <div className="pc-image-container" style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={displayImage} alt={displayTitle} style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
          
          {displayFeatured && (
            <div style={{ 
              position: 'absolute', 
              top: '2rem', 
              left: '2rem', 
              background: 'var(--pc-teal)', 
              color: 'var(--pc-bone)', 
              padding: '0.8rem 1.5rem', 
              fontSize: '0.7rem', 
              fontWeight: 900, 
              letterSpacing: '3px',
              zIndex: 10
            }}>
              FEATURED ESTATE
            </div>
          )}

          {/* Card Meta Overlay */}
          <div className="pc-card-meta">
              <div style={{ textAlign: 'left' }}>
                  <div className="pc-caps" style={{ fontSize: '0.65rem', marginBottom: '0.5rem', opacity: 0.6 }}>Provenance</div>
                  <div style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--pc-teal)', letterSpacing: '1px' }}>EST. {displayYear}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                  <div className="pc-caps" style={{ fontSize: '0.65rem', marginBottom: '0.5rem', opacity: 0.6 }}>Valuation</div>
                  <div style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--pc-teal)', letterSpacing: '1px' }}>{displayPrice}</div>
              </div>
          </div>
        </div>

        <div style={{ padding: '3rem 1.5rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                <span className="pc-caps" style={{ color: 'var(--pc-teal)', opacity: 0.6, fontSize: '0.7rem' }}>{displayLocation}</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--pc-border)' }} />
                <span style={{ color: 'var(--pc-teal)', fontSize: '1.2rem', opacity: 0.4 }}>❦</span>
            </div>
            <h3 className="pc-serif" style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--pc-teal)', letterSpacing: '-1px' }}>{displayTitle}</h3>
            <p style={{ fontSize: '1rem', color: 'var(--pc-text-muted)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                {desc}
            </p>
            <div style={{ display: 'flex', gap: '3rem', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px', color: 'var(--pc-teal)', opacity: 0.8 }}>
                <span>{beds} BEDS</span>
                <span>{baths} BATHS</span>
                <span>{area}</span>
            </div>
        </div>
      </div>
    </a>
  );
};
