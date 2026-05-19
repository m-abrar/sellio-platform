'use client';
import React from 'react';

interface HeaderProps {
  onPostClick: () => void;
}

export const PremiumHeader = ({ onPostClick }: HeaderProps) => (
  <header className="cp-header">
    <a href="#" className="cp-logo" onClick={(e) => { e.preventDefault(); window.location.reload(); }}>
      Sellio<span>Premium</span>
    </a>
    
    <nav className="cp-nav">
      <a href="#" className="cp-nav-link active" onClick={(e) => { e.preventDefault(); alert("Browsing active corporate acquisition listings..."); }}>Businesses</a>
      <a href="#" className="cp-nav-link" onClick={(e) => { e.preventDefault(); alert("Accessing professional appraisal advisory services..."); }}>Appraisals</a>
      <a href="#" className="cp-nav-link" onClick={(e) => { e.preventDefault(); alert("Connecting with elite M&A brokers..."); }}>Brokers</a>
      <a href="#" className="cp-nav-link" onClick={(e) => { e.preventDefault(); alert("Opening private members forum..."); }}>Private Hub</a>
      <button className="cp-btn-post" onClick={onPostClick}>💼 List Business</button>
    </nav>
  </header>
);

interface PremiumCardProps {
  title: string;
  price: string;
  description: string;
  location: string;
  image: string;
  isVerified?: boolean;
  onViewDetails: () => void;
}

export const PremiumCard = ({ title, price, description, location, image, isVerified, onViewDetails }: PremiumCardProps) => {
  return (
    <div className="cp-card">
      <div className="cp-card-img-wrap">
        <img src={image} className="cp-card-img" alt={title} />
      </div>
      
      <div className="cp-card-body">
        {isVerified && (
          <span className="cp-badge-verified">
            🛡️ Verified Opportunity
          </span>
        )}
        
        <h5 className="cp-card-title">{title}</h5>
        <p className="cp-card-text">{description}</p>
        
        <div className="cp-card-footer">
          <span className="cp-card-location">📍 {location}</span>
          <span className="cp-card-price">{price}</span>
        </div>
        
        <button className="cp-btn-details" onClick={onViewDetails}>
          View Memorandum & Details
        </button>
      </div>
    </div>
  );
};

export const PremiumFooter = () => (
  <footer className="cp-footer">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
      <div>
        <a href="#" className="cp-logo" style={{ color: 'var(--cp-navy)', marginBottom: '1.25rem' }} onClick={(e) => e.preventDefault()}>
          Sellio<span>Premium</span>
        </a>
        <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
          The premier boutique marketplace connecting serious, high-net-worth investors with established business acquisitions, franchises, and digital SaaS properties.
        </p>
      </div>
      
      <div>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--cp-navy)', marginBottom: '1.25rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Acquisitions</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
          <span style={{ color: '#64748b', cursor: 'pointer' }} onClick={() => alert("Technology & SaaS acquisitions catalog")}>SaaS & Tech Platforms</span>
          <span style={{ color: '#64748b', cursor: 'pointer' }} onClick={() => alert("F&B and Hospitality acquisitions catalog")}>Hospitality & F&B</span>
          <span style={{ color: '#64748b', cursor: 'pointer' }} onClick={() => alert("Local service businesses catalog")}>Local Retail Routes</span>
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--cp-navy)', marginBottom: '1.25rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Professional Services</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
          <span style={{ color: '#64748b', cursor: 'pointer' }} onClick={() => alert("Business Valuations program")}>Business Valuations</span>
          <span style={{ color: '#64748b', cursor: 'pointer' }} onClick={() => alert("M&A advisory & escrow programs")}>M&A Advisory</span>
          <span style={{ color: '#64748b', cursor: 'pointer' }} onClick={() => alert("Due Diligence vetting reports")}>Due Diligence Hub</span>
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--cp-navy)', marginBottom: '1.25rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Legal & Trust</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
          <span style={{ color: '#64748b', cursor: 'pointer' }} onClick={() => alert("Vetting guidelines terms")}>Vetting Guidelines</span>
          <span style={{ color: '#64748b', cursor: 'pointer' }} onClick={() => alert("Non-Disclosure Agreement patterns")}>NDA Agreement</span>
          <span style={{ color: '#64748b', cursor: 'pointer' }} onClick={() => alert("Sovereign Escrow Protection")}>Escrow & Safety</span>
        </div>
      </div>
    </div>
    
    <div style={{ borderTop: '1.5px solid var(--cp-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
      <span>&copy; 2026 Sellio Premium Holdings Ltd. Vetted Network. All rights reserved.</span>
      <span>🔒 Escrow Secured Node &bull; Elite Sovereign Standards</span>
    </div>
  </footer>
);

// Obsolete compatibility placeholders
export const CuratedListingCard = () => null;
export const DiamondFooter = () => null;
export const EliteHeader = () => null;
