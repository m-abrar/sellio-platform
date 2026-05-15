import React from 'react';

export const BoutiqueMapHeader = () => (
  <header className="boutique-map-header">
    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.2rem', color: '#e11d48' }}>BOUTIQUES</div>
    <div className="boutique-search-input">
      <span>Search brands in Soho, NY</span>
    </div>
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <div style={{ padding: '0.5rem 1.2rem', border: '1px solid #f1f5f9', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700 }}>Pick up Today</div>
      <div style={{ padding: '0.5rem 1.2rem', border: '1px solid #f1f5f9', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700 }}>Open Now</div>
      <div style={{ padding: '0.5rem 1.2rem', background: '#e11d48', color: 'white', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700 }}>Filters</div>
    </div>
  </header>
);

export const BoutiqueProductCard = ({ title, price, brand, image }: { title: string, price: string, brand: string, image: string }) => (
  <div className="boutique-card-horizontal">
    <div className="boutique-item-thumb">
      <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <div className="boutique-item-info">
      <div className="pickup-badge-map">READY_FOR_PICKUP</div>
      <div className="boutique-item-price">{price}</div>
      <div className="boutique-item-title">{title}</div>
      <div style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: 700 }}>{brand}</div>
    </div>
  </div>
);

export const BoutiqueMarker = ({ top, left }: { top: string, left: string }) => (
  <div className="boutique-location-marker" style={{ top, left }}>
    <span>🛍️</span>
  </div>
);
