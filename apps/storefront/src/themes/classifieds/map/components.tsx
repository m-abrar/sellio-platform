import React from 'react';

export const CommunityMapHeader = () => (
  <header className="community-map-header">
    <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#3b82f6' }}>LOCAL_HUB</div>
    <div className="local-search-input">
      <span>Search items near Brooklyn, NY</span>
    </div>
    <div className="local-filter-pills">
      <div className="local-pill">Under $100</div>
      <div className="local-pill">New Today</div>
      <div className="local-pill">Free</div>
      <div className="local-pill" style={{ background: 'var(--color-blue)', color: 'white', borderColor: 'var(--color-blue)' }}>Map View</div>
    </div>
  </header>
);

export const LocalListingCard = ({ price, title, location, date, image }: { price: string, title: string, location: string, date: string, image: string }) => (
  <div className="local-card-compact">
    <div className="local-thumb">
      <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <div className="local-info">
      <div className="local-price">{price}</div>
      <div className="local-title">{title}</div>
      <div className="local-meta">{location} • {date}</div>
    </div>
  </div>
);

export const PriceBubble = ({ price, top, left }: { price: string, top: string, left: string }) => (
  <div className="price-bubble-marker" style={{ top, left }}>
    {price}
  </div>
);
