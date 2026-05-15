import React from 'react';

export const DealsHeader = () => (
  <header className="deals-header">
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
      <div style={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-1px' }}>SELLIO_DEALS</div>
      <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>LOCAL_CITY: NEW YORK</div>
    </div>
    <div className="deals-search-bar">
      Search for anything (iPhone, Sofa, Bike...)
    </div>
    <div className="trending-pills">
      <div className="trending-pill">#iPhone15</div>
      <div className="trending-pill">#GamingLaptop</div>
      <div className="trending-pill">#DesignerBags</div>
      <div className="trending-pill">#FreeItems</div>
    </div>
  </header>
);

export const UrgencyTicker = () => (
  <div className="urgency-ticker">
    <div style={{ display: 'inline-block', animation: 'scroll 20s linear infinite' }}>
      LATEST_DEAL: MACBOOK PRO M3 (-25%) // NEW_LISTING: VINTAGE ROLEX (JUST IN) // PRICE_DROP: HERMAN MILLER CHAIR // FREE_ITEM: SECTIONAL SOFA (COLLECTION ONLY)
    </div>
    <style>{`
      @keyframes scroll {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
    `}</style>
  </div>
);

export const BargainCard = ({ title, price, oldPrice, location, time, image, isHot }: { title: string, price: string, oldPrice?: string, location: string, time: string, image: string, isHot?: boolean }) => (
  <div className="bargain-card">
    <div className="deal-image-wrapper">
      <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      {isHot && <div className="deal-badge">HOT_DEAL</div>}
      {oldPrice && <div className="deal-price-cut">-{Math.round((1 - parseFloat(price.replace(/[^0-9.]/g, '')) / parseFloat(oldPrice.replace(/[^0-9.]/g, ''))) * 100)}%</div>}
    </div>
    <div className="deal-content">
      <h3 className="deal-title">{title}</h3>
      <div className="deal-price-wrapper">
        <span className="deal-price-current">{price}</span>
        {oldPrice && <span className="deal-price-old">{oldPrice}</span>}
      </div>
    </div>
    <div className="deal-footer">
      <span>{location}</span>
      <span>{time}</span>
    </div>
  </div>
);
