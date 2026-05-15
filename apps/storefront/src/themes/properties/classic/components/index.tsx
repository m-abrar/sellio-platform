'use client';
import React from 'react';

export const Header = () => (
  <header className="pc-header">
    <div style={{ fontFamily: 'var(--pc-font-serif)', fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-1px' }}>
      HERITAGE<span style={{ color: 'var(--pc-sage)' }}>Registry</span>
    </div>
    
    <nav className="pc-nav">
        {['Collection', 'Provenance', 'Curators', 'Nodes'].map(link => (
            <a key={link} href="#" className="pc-nav-link">{link}</a>
        ))}
    </nav>

    <button style={{ 
        background: 'transparent', 
        border: '1px solid var(--pc-mahogany)', 
        color: 'var(--pc-mahogany)', 
        padding: '0.8rem 2rem', 
        fontFamily: 'var(--pc-font-serif)', 
        fontStyle: 'italic',
        fontWeight: 700,
        fontSize: '0.9rem',
        cursor: 'pointer'
    }}>
      Inquire
    </button>
  </header>
);

export const EstateCard = ({ title, price, location, year, image }: any) => (
  <div className="pc-estate-card">
    <div className="pc-estate-image-wrapper">
      <img src={image} alt={title} />
    </div>
    <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '3px', color: 'var(--pc-sage)', marginBottom: '1rem' }}>
            ESTABLISHED {year}
        </div>
        <h3 style={{ fontFamily: 'var(--pc-font-serif)', fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{title}</h3>
        <div style={{ fontSize: '0.9rem', color: 'var(--pc-text-muted)', fontStyle: 'italic', marginBottom: '2rem' }}>{location}</div>
        <div style={{ fontSize: '1.5rem', fontFamily: 'var(--pc-font-serif)', fontWeight: 700, color: 'var(--pc-mahogany)' }}>{price}</div>
    </div>
  </div>
);

export const TrustIndicator = () => (
    <div style={{ borderTop: '1px solid var(--pc-border)', borderBottom: '1px solid var(--pc-border)', padding: '3rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {['MANORIAL_RIGHTS', 'HISTORIC_SYNC', 'REGISTRY_NODE'].map(trust => (
            <div key={trust} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: 'var(--pc-sage)', fontSize: '1.5rem' }}>❦</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px' }}>{trust}</span>
            </div>
        ))}
    </div>
);

export const Footer = () => (
    <footer className="pc-footer">
        <div className="pc-footer-grid">
            <div style={{ gridColumn: 'span 1' }}>
                <div style={{ fontFamily: 'var(--pc-font-serif)', fontWeight: 900, fontSize: '2.5rem', marginBottom: '2rem' }}>HERITAGE</div>
                <p style={{ opacity: 0.6, lineHeight: 2, fontSize: '0.95rem' }}>
                    Preserving the world's most significant architectural provenance through a unified digital registry. 
                </p>
            </div>
            {['PRACTICE', 'COLLECTION', 'INSTITUTIONAL'].map(col => (
                <div key={col}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px', marginBottom: '2.5rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {['Registry', 'Provenance', 'Curators', 'Auth'].map(link => (
                            <span key={link} style={{ fontSize: '0.9rem', opacity: 0.5, cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', opacity: 0.4 }}>
            <span>© 2026 SELLIO_HERITAGE_OS // ALL_PROVENANCE_SYNCED</span>
            <div style={{ display: 'flex', gap: '3rem' }}>
                <span>X_PLATFORM</span>
                <span>INSTAGRAM</span>
                <span>LINKEDIN</span>
            </div>
        </div>
    </footer>
);
