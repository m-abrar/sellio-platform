import React from 'react';

export const MinimalHeader = () => (
  <header className="minimal-header">
    <div className="minimal-logo">SELLIO_MINIMAL</div>
    <nav className="minimal-nav">
      <span>Marketplace</span>
      <span>Collections</span>
      <span>Post Item</span>
    </nav>
    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Search_</div>
  </header>
);

export const MonolithCard = ({ title, price, location, date, image }: { title: string, price: string, location: string, date: string, image: string }) => (
  <div className="monolith-card">
    <div className="monolith-image-wrapper">
      <img src={image} alt={title} />
    </div>
    <div className="monolith-meta">
      <div>
        <h3 className="monolith-title">{title}</h3>
        <div className="monolith-details">{location} // {date}</div>
      </div>
      <div className="monolith-price">{price}</div>
    </div>
  </div>
);

export const MinimalFooter = () => (
  <footer className="minimal-footer">
    <div className="footer-columns">
      <div>
        <h4 className="footer-heading">Sitemap</h4>
        <a href="#" className="footer-link">Marketplace</a>
        <a href="#" className="footer-link">Categories</a>
        <a href="#" className="footer-link">Locations</a>
      </div>
      <div>
        <h4 className="footer-heading">Support</h4>
        <a href="#" className="footer-link">Help Center</a>
        <a href="#" className="footer-link">Safety</a>
        <a href="#" className="footer-link">Privacy</a>
      </div>
      <div>
        <h4 className="footer-heading">Company</h4>
        <a href="#" className="footer-link">About Us</a>
        <a href="#" className="footer-link">Press</a>
        <a href="#" className="footer-link">Careers</a>
      </div>
      <div>
        <h4 className="footer-heading">Social</h4>
        <a href="#" className="footer-link">Twitter</a>
        <a href="#" className="footer-link">Instagram</a>
      </div>
    </div>
    <div style={{ marginTop: '4rem', fontSize: '0.75rem', opacity: 0.3, fontWeight: 700 }}>
      SELLIO_CORE_MINIMAL_ENGINE_V1.0
    </div>
  </footer>
);
