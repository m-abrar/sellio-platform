import React from 'react';

export const MapHeader = () => (
  <header className="map-utility-header">
    <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary)' }}>MAP_NAV</div>
    <div className="map-search-input">
      <span>Anywhere in Manhattan, NY</span>
    </div>
    <div className="map-filter-pills" style={{ display: 'flex', gap: '0.5rem' }}>
      <div className="map-filter-pill">Price: Any</div>
      <div className="map-filter-pill">Beds: 2+</div>
      <div className="map-filter-pill">Home Type</div>
      <div className="map-filter-pill" style={{ background: 'var(--color-primary)', color: 'white', borderColor: 'var(--color-primary)' }}>Save Search</div>
    </div>
  </header>
);

export const MapListCard = ({ price, address, beds, baths, sqft, image }: { price: string, address: string, beds: number, baths: number, sqft: string, image: string }) => (
  <div className="map-card-compact">
    <div className="compact-image-wrapper">
      <img src={image} alt={address} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <div className="compact-content">
      <div className="compact-price">{price}</div>
      <div className="compact-address">{address}</div>
      <div className="compact-specs">
        <span>{beds} bds</span>
        <span>{baths} ba</span>
        <span>{sqft} sqft</span>
      </div>
    </div>
  </div>
);

export const MapPriceMarker = ({ price, top, left }: { price: string, top: string, left: string }) => (
  <div className="map-price-marker" style={{ top, left }}>
    {price}
  </div>
);
