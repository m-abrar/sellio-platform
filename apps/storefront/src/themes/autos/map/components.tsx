import React from 'react';

export const DealerMapHeader = () => (
  <header className="dealer-map-header">
    <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#0ea5e9' }}>AUTO_LOCATOR</div>
    <div className="dealer-search-box">
      <span>Search Dealerships near Los Angeles, CA</span>
    </div>
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <div style={{ padding: '0.5rem 1.2rem', border: '1px solid #e2e8f0', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700 }}>Within 25mi</div>
      <div style={{ padding: '0.5rem 1.2rem', border: '1px solid #e2e8f0', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700 }}>New Inventory</div>
      <div style={{ padding: '0.5rem 1.2rem', background: '#0ea5e9', color: 'white', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700 }}>List View</div>
    </div>
  </header>
);

export const DealerVehicleCard = ({ name, price, year, km, image }: { name: string, price: string, year: number, km: string, image: string }) => (
  <div className="dealer-card-horizontal">
    <div className="dealer-car-thumb">
      <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <div className="dealer-car-info">
      <div className="dealer-car-price">{price}</div>
      <div className="dealer-car-name">{year} {name}</div>
      <div className="dealer-car-meta">
        <span>{km}</span>
        <span>•</span>
        <span>AUTO</span>
        <span>•</span>
        <span>CERTIFIED</span>
      </div>
    </div>
  </div>
);

export const DealerMarker = ({ top, left }: { top: string, left: string }) => (
  <div className="dealer-location-marker" style={{ top, left }}>
    <span>🏎️</span>
  </div>
);
