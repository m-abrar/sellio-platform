import React from 'react';

export const DealerHeader = () => (
  <header className="dealer-header">
    <div className="dealer-brand">SELLIO_MOTORS</div>
    <div className="dealer-contact">CALL_SALES: +1 (800) 555-AUTO</div>
    <button className="request-quote-btn">REQUEST_QUOTE</button>
  </header>
);

export const InventoryCard = ({ name, price, km, transmission, fuel, year, image, isCertified }: { name: string, price: string, km: string, transmission: string, fuel: string, year: number, image: string, isCertified?: boolean }) => (
  <div className="inventory-card">
    <div className="card-image-wrapper">
      <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      {isCertified && <div className="urgency-badge">CERTIFIED_PRE_OWNED</div>}
    </div>
    <div style={{ padding: '1.5rem' }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.5, marginBottom: '0.2rem' }}>{year} MODEL</div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{name}</h3>
      <div className="price-tag-classic">{price}</div>
      <div className="spec-grid-compact">
        <div className="spec-item"><span>KM:</span> {km}</div>
        <div className="spec-item"><span>GEAR:</span> {transmission}</div>
        <div className="spec-item"><span>FUEL:</span> {fuel}</div>
        <div className="spec-item"><span>COND:</span> EXCELLENT</div>
      </div>
    </div>
  </div>
);

export const FilterSidebar = () => (
  <aside className="filter-sidebar">
    <div className="filter-group">
      <div className="filter-title">Quick Search</div>
      <input type="text" placeholder="Make or Model" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
    </div>
    <div className="filter-group">
      <div className="filter-title">Body Type</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        {['SUV', 'Sedan', 'Coupe', 'Hatchback'].map(t => (
          <button key={t} style={{ padding: '0.5rem', border: '1px solid #eee', background: 'white', fontSize: '0.75rem', fontWeight: 700 }}>{t}</button>
        ))}
      </div>
    </div>
    <div className="filter-group">
      <div className="filter-title">Budget Limit</div>
      <input type="range" style={{ width: '100%' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.5rem' }}>
        <span>$5k</span>
        <span>$150k+</span>
      </div>
    </div>
  </aside>
);

export const ClassicFooter = () => (
  <footer className="classic-footer">
    <div>
      <div className="dealer-brand" style={{ color: 'white', marginBottom: '1.5rem' }}>SELLIO_MOTORS</div>
      <p style={{ opacity: 0.5, maxWidth: '300px', fontSize: '0.85rem' }}>Your trusted partner in premium automotive sales since 1998. 500+ vehicles in stock.</p>
    </div>
    <div style={{ display: 'flex', gap: '4rem' }}>
      <div>
        <h4 style={{ color: 'var(--color-red)', marginBottom: '1rem', fontSize: '0.8rem' }}>HOURS</h4>
        <p style={{ fontSize: '0.85rem' }}>MON-FRI: 9AM - 8PM<br/>SAT: 10AM - 6PM</p>
      </div>
      <div>
        <h4 style={{ color: 'var(--color-red)', marginBottom: '1rem', fontSize: '0.8rem' }}>LOCATION</h4>
        <p style={{ fontSize: '0.85rem' }}>1420 Motor Way<br/>Detroit, MI</p>
      </div>
    </div>
  </footer>
);
