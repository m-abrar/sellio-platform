'use client';
import React, { useState } from 'react';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="pl-header">
      <div className="pl-logo">
        PLATINUM<span style={{ color: 'var(--pl-gold)' }}>Registry</span>
      </div>
      
      <button 
          className={`pl-hamburger ${isOpen ? 'pl-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
      >
          <span className="pl-hamburger-bar"></span>
          <span className="pl-hamburger-bar"></span>
          <span className="pl-hamburger-bar"></span>
      </button>

      <nav className={`pl-nav ${isOpen ? 'pl-nav-open' : ''}`}>
          {['Collection', 'Insights', 'Concierge', 'Private_Auth'].map(link => (
              <a key={link} href="#" className="pl-nav-link" onClick={() => setIsOpen(false)}>{link}</a>
          ))}
          
          <div className="pl-mono pl-mobile-auth-btn" style={{ color: 'white', border: '1px solid var(--pl-border)', padding: '0.8rem 2rem', borderRadius: '4px', marginTop: '2rem' }}>
            ACCESS_SECURE_NODE
          </div>
      </nav>

      <div className="pl-mono pl-desktop-auth-btn" style={{ color: 'white', border: '1px solid var(--pl-border)', padding: '0.6rem 1.5rem', borderRadius: '4px' }}>
        ACCESS_SECURE_NODE
      </div>
    </header>
  );
};

export const ShowcaseCard = ({ title, price, image, span }: any) => (
  <div className={`pl-bento-card pl-${span}`}>
    <img src={image} alt={title} className="pl-bento-img" />
    <div className="pl-bento-overlay">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', textTransform: 'uppercase' }}>{title}</h3>
                <div className="pl-mono" style={{ color: 'var(--pl-gold)' }}>CERTIFIED_ACQUISITION</div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{price}</div>
        </div>
    </div>
  </div>
);

export const StatisticsNode = ({ label, value }: { label: string, value: string }) => (
    <div style={{ borderLeft: '1px solid var(--pl-gold)', paddingLeft: '2.5rem' }}>
        <div className="pl-mono" style={{ color: 'var(--pl-text-dim)', marginBottom: '1rem' }}>{label}</div>
        <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-2px' }}>{value}</div>
    </div>
);

export const Footer = () => (
    <footer className="pl-footer">
        <div className="pl-footer-grid">
            <div style={{ gridColumn: 'span 1' }}>
                <div className="pl-logo" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>PLATINUM</div>
                <p style={{ color: 'var(--pl-text-dim)', lineHeight: 2, fontSize: '0.95rem' }}>
                    The world's most exclusive distribution network for ultra-high-fidelity private estates. 
                </p>
            </div>
            {['ACQUISITION', 'RESOURCES', 'LEGAL'].map(col => (
                <div key={col}>
                    <div className="pl-mono" style={{ color: 'var(--pl-gold)', marginBottom: '3rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Registry', 'Insights', 'Concierge', 'Node_Auth'].map(link => (
                            <span key={link} style={{ fontSize: '0.9rem', color: 'var(--pl-text-dim)', cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '10rem', paddingTop: '4rem', borderTop: '1px solid var(--pl-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="pl-mono" style={{ color: 'var(--pl-text-dim)' }}>© 2026 SELLIO_PLATINUM_GRP // NODE_STABLE</div>
            <div style={{ display: 'flex', gap: '3rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_OS'].map(social => (
                    <span key={social} className="pl-mono" style={{ color: 'var(--pl-text-dim)' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
