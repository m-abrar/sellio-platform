
import React from 'react';

interface Props {
  title: string;
  price: string;
  location: string;
  year: string;
  image: string;
  isFeatured?: boolean;
}

export const EstateCard = ({ title, price, location, year, image, isFeatured }: Props) => (
  <div className="pc-estate-card">
    <div className="pc-image-container">
      <img src={image} alt={title} style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
      
      {isFeatured && (
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
              <div style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--pc-teal)', letterSpacing: '1px' }}>EST. {year}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
              <div className="pc-caps" style={{ fontSize: '0.65rem', marginBottom: '0.5rem', opacity: 0.6 }}>Valuation</div>
              <div style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--pc-teal)', letterSpacing: '1px' }}>{price}</div>
          </div>
      </div>
    </div>

    <div style={{ padding: '3rem 1.5rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <span className="pc-caps" style={{ color: 'var(--pc-teal)', opacity: 0.6, fontSize: '0.7rem' }}>{location}</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--pc-border)' }} />
            <span style={{ color: 'var(--pc-teal)', fontSize: '1.2rem', opacity: 0.4 }}>❦</span>
        </div>
        <h3 className="pc-serif" style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--pc-teal)', letterSpacing: '-1px' }}>{title}</h3>
        <p style={{ fontSize: '1rem', color: 'var(--pc-text-muted)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            A significant historic residence featuring verified manorial rights and architectural integrity.
        </p>
        <div style={{ display: 'flex', gap: '3rem', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px', color: 'var(--pc-teal)', opacity: 0.8 }}>
            <span>4 BEDS</span>
            <span>3 BATHS</span>
            <span>4,200 SQFT</span>
        </div>
    </div>
  </div>
);
