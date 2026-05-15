import React from 'react';

export const MaisonHeader = () => (
  <header className="maison-header">
    <div className="maison-logo">SELLIO_MAISON</div>
    <nav className="maison-nav">
      <span>Heritage</span>
      <span>Collections</span>
      <span>Ateliers</span>
    </nav>
    <div style={{ letterSpacing: '2px', fontSize: '0.7rem', fontWeight: 800 }}>INQUIRY_</div>
  </header>
);

export const MaisonIndustrySection = ({ title, description, image }: { title: string, description: string, image: string }) => (
  <div className="maison-industry-section">
    <div className="maison-image-half">
      <img src={image} alt={title} />
    </div>
    <div className="maison-text-half">
      <div className="signature-divider"></div>
      <h2 className="maison-category-title">{title}</h2>
      <p className="maison-description">{description}</p>
      <div className="maison-explore-btn">EXPLORE_COLLECTION</div>
    </div>
  </div>
);

export const HeritageFooter = () => (
  <footer className="heritage-footer">
    <div className="maison-logo" style={{ color: 'var(--color-gold)', marginBottom: '3rem' }}>SELLIO_MAISON</div>
    <p style={{ maxWidth: '600px', margin: '0 auto 4rem', opacity: 0.5, lineHeight: '2', letterSpacing: '1px' }}>
      "A collective of excellence, bridging the gap between artisanal heritage and digital precision across fifty global industries."
    </p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', fontSize: '0.65rem', letterSpacing: '3px', opacity: 0.4 }}>
      <span>PRIVACY</span>
      <span>TERMS</span>
      <span>GLOBAL_BOUTIQUES</span>
    </div>
  </footer>
);
