
import React from 'react';

export const DealsHeader = () => (
  <header className="deals-header">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-deal-red)', fontWeight: 900, fontSize: '1.5rem' }}>%</div>
        <span style={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-1px' }}>SELLIO_DEALS</span>
      </div>
      <div className="deals-search-bar" style={{ flex: 0.6 }}>
        <span style={{ marginRight: '1rem' }}>🔍</span>
        <input type="text" placeholder="Search 1,200+ active bargains..." style={{ border: 'none', background: 'none', outline: 'none', width: '100%', fontWeight: 600 }} />
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.8 }}>ACTIVE_DEALS</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>4,291</div>
        </div>
        <button style={{ background: 'white', color: 'var(--color-deal-red)', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>SELL_FAST</button>
      </div>
    </div>
    <div className="trending-pills">
      {['#iPhone15', '#HermanMiller', '#PS5', '#RoadBikes', '#VintageLenses', '#DesignerFurniture'].map(tag => (
        <span key={tag} className="trending-pill">{tag}</span>
      ))}
    </div>
  </header>
);

export const UrgencyTicker = () => (
  <div className="urgency-ticker">
    <div className="ticker-content">
      🔥 JUST_SOLD: MacBook Pro M2 for $1,200 (Saved 35%) • ⚡ NEW_DEAL: Sony A7IV - $1,800 • 🚀 POPULAR: 12 users watching Aeron Chair Size B • 🔥 JUST_SOLD: Canon R5 Body for $2,100 • ⚡ NEW_DEAL: RTX 4090 - $1,400
    </div>
  </div>
);

export const BargainCard = ({ title, price, oldPrice, location, time, image, isHot }: any) => {
  const savings = Math.round((1 - (parseFloat(price.replace('$', '').replace(',', '')) / parseFloat(oldPrice.replace('$', '').replace(',', '')))) * 100);
  
  return (
    <div className="bargain-card">
      <div className="deal-image-wrapper">
        <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {isHot && <div className="deal-badge">HOT_DEAL</div>}
        <div className="deal-price-cut">-{savings}%</div>
      </div>
      <div className="deal-content">
        <h3 className="deal-title">{title}</h3>
        <div className="deal-price-wrapper">
          <span className="deal-price-current">{price}</span>
          <span className="deal-price-old">{oldPrice}</span>
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ flex: 1, height: '4px', background: '#eee', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: isHot ? '85%' : '40%', height: '100%', background: 'var(--color-deal-red)' }}></div>
          </div>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-deal-red)' }}>{isHot ? 'HIGH_INTEREST' : 'STABLE'}</span>
        </div>
      </div>
      <div className="deal-footer">
        <span>📍 {location}</span>
        <span>🕒 {time}</span>
      </div>
    </div>
  );
};
