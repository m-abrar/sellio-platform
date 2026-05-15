import React from 'react';

export const AtelierHeader = () => (
  <header className="atelier-header">
    <div className="atelier-logo">AUTO_ATELIER</div>
    <nav className="atelier-nav">
      <span>Inventory</span>
      <span>Bespoke</span>
      <span>Experience</span>
    </nav>
    <div style={{ letterSpacing: '2px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-silver)' }}>PRIVATE_ENTRY_</div>
  </header>
);

export const MonolithicCarBlock = ({ title, year, image, hp, torque, topSpeed }: { title: string, year: number, image: string, hp: string, torque: string, topSpeed: string }) => (
  <div className="monolithic-block">
    <div className="monolithic-image-bg">
      <img src={image} alt={title} />
    </div>
    <div className="monolithic-content">
      <div style={{ fontSize: '0.8rem', letterSpacing: '4px', opacity: 0.5, marginBottom: '1rem' }}>COLLECTION_{year}</div>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '4rem', fontWeight: 400, marginBottom: '2rem' }}>{title}</h2>
      <div className="precision-spec-row">
        <div className="spec-item">
          <span className="spec-value">{hp}</span>
          <span className="spec-label">HORSEPOWER</span>
        </div>
        <div className="spec-item">
          <span className="spec-value">{torque}</span>
          <span className="spec-label">TORQUE</span>
        </div>
        <div className="spec-item">
          <span className="spec-value">{topSpeed}</span>
          <span className="spec-label">TOP_SPEED</span>
        </div>
      </div>
      <button style={{ 
        marginTop: '3rem', 
        background: 'none', 
        border: 'none', 
        borderBottom: '1px solid var(--color-silver)', 
        color: 'white', 
        fontFamily: 'var(--font-serif)', 
        fontSize: '0.9rem', 
        letterSpacing: '3px',
        paddingBottom: '0.5rem',
        cursor: 'pointer'
      }}>
        VIEW_COLLECTION
      </button>
    </div>
  </div>
);

export const ConciergeFooter = () => (
  <footer className="concierge-footer">
    <div className="atelier-logo" style={{ color: 'var(--color-silver)', marginBottom: '3rem' }}>AUTO_ATELIER</div>
    <p style={{ maxWidth: '600px', margin: '0 auto 4rem', opacity: 0.4, lineHeight: '2', letterSpacing: '1px' }}>
      "A sanctuary for the world's most significant automotive achievements. We bridge the gap between engineering precision and emotional mastery."
    </p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', fontSize: '0.6rem', letterSpacing: '3px', opacity: 0.3 }}>
      <span>PRIVACY</span>
      <span>INQUIRY</span>
      <span>GLOBAL_LOCATIONS</span>
    </div>
  </footer>
);
