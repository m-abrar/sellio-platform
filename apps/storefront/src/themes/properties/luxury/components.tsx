import React from 'react';

export const LuxuryHeader = () => (
  <header className="luxury-header">
    <div className="luxury-logo">SELLIO LUXE</div>
    <nav className="luxury-nav">
      <div className="luxury-nav-orb">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  </header>
);

export const LuxuryFooter = () => (
  <footer className="luxury-footer">
    <span className="luxury-footer-logo">SELLIO LUXE</span>
    <p>© 2026 Sellio Global Estates. All Rights Reserved.</p>
    <div style={{ marginTop: '2rem', color: '#c5a059', letterSpacing: '2px', fontSize: '0.8rem' }}>
      LONDON • PARIS • NEW YORK • DUBAI
    </div>
  </footer>
);

export const PropertyCard = ({ title, price, image }: { title: string, price: string, image: string }) => (
  <div className="property-card-luxury">
    <img 
      src={image} 
      alt={title} 
      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 10s linear' }}
      className="card-image-animate"
    />
    <div className="luxury-card-overlay">
      <h3 className="luxury-card-title">{title}</h3>
      <div className="luxury-card-price">{price}</div>
    </div>
  </div>
);
