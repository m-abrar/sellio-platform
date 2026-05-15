import React from 'react';

export const CollectionHeader = () => (
  <header className="collection-header">
    <div className="collection-logo">SELLIO_COLLECT</div>
    <nav className="collection-nav">
      <span>Exhibitions</span>
      <span>Catalog</span>
      <span>Inquiry</span>
    </nav>
    <div style={{ letterSpacing: '2px', fontSize: '0.7rem', fontWeight: 800 }}>PRIVATE_VIEW_</div>
  </header>
);

export const LotCard = ({ lotNo, title, estimate, image }: { lotNo: string, title: string, estimate: string, image: string }) => (
  <div className="lot-card">
    <div className="lot-image-wrapper">
      <img src={image} alt={title} />
    </div>
    <div className="lot-number">LOT_NO_{lotNo}</div>
    <h3 className="lot-title">{title}</h3>
    <div className="lot-estimate">Estimate: {estimate}</div>
  </div>
);

export const CollectorFooter = () => (
  <footer className="collector-footer">
    <div className="collection-logo" style={{ color: 'var(--color-gold)', marginBottom: '3rem' }}>SELLIO_COLLECT</div>
    <p style={{ maxWidth: '600px', margin: '0 auto 4rem', opacity: 0.5, lineHeight: '2', letterSpacing: '1px' }}>
      "A sanctuary for high-fidelity acquisitions. We curate the world's most significant collectibles, fine arts, and high-jewelry into a single, high-fidelity discovery engine."
    </p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', fontSize: '0.65rem', letterSpacing: '3px', opacity: 0.4 }}>
      <span>CONSIGNMENT</span>
      <span>AUTHENTICITY</span>
      <span>GLOBAL_VAULTS</span>
    </div>
  </footer>
);
