'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';

export const OriginHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="ud-header">
      <div className="ud-logo">
        CORE<span style={{ color: 'var(--ud-azure)' }}>ORIGIN</span>
      </div>
      
      <button 
          className={`ud-hamburger ${isOpen ? 'ud-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="ud-hamburger-toggle"
      >
          <span className="ud-hamburger-bar"></span>
          <span className="ud-hamburger-bar"></span>
          <span className="ud-hamburger-bar"></span>
      </button>

      <MenuNav
        location="main_header"
        flat
        className={`ud-nav ${isOpen ? 'ud-nav-open' : ''}`}
        linkClassName="ud-nav-link"
        onNavigate={() => setIsOpen(false)}
        renderItem={(item, { href, className, onNavigate }) => (
          <a href={href} className={className} onClick={onNavigate}>{item.title}</a>
        )}
      />

      <button className="ud-btn-primary ud-mobile-btn" style={{ padding: '1rem 3rem', fontSize: '0.8rem', marginTop: '2rem', width: '100%' }} onClick={() => alert('Core Origin distribution active.')}>
        GET STARTED CORE
      </button>

      <button className="ud-btn-primary ud-desktop-btn" style={{ padding: '0.8rem 2rem', fontSize: '0.75rem', borderRadius: '8px' }} onClick={() => alert('Core Origin distribution active.')} id="ud-btn-header-access">
        GET STARTED
      </button>
    </header>
  );
};

export const CoreFeatures = () => {
  const features = [
    { icon: "🛡️", title: "Siloed Node Protocol", description: "Enforcing isolated zero-template dependencies across all industry verticals for ultimate monorepo security." },
    { icon: "⚡", title: "High-Fidelity Engine", description: "High-performance styling and sub-millisecond render loops engineered for Envato-level premium quality." },
    { icon: "📊", title: "Unified Analytics HUD", description: "Real-time verification metrics and connected intelligence logs tracking global distribution provenance." },
  ];

  return (
    <section className="ud-features" id="ud-features-section">
      <div style={{ textAlign: 'center', marginBottom: '8rem' }} className="ud-features-header">
          <div className="ud-mono" style={{ color: 'var(--ud-azure)', marginBottom: '1.5rem' }}>CORE_COMPETENCIES</div>
          <h2 style={{ fontFamily: 'var(--ud-font-heading)', fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 800, color: '#1e293b' }}>Engineered for Scaling.</h2>
      </div>
      <div className="ud-feature-grid">
        {features.map((f, i) => (
          <div key={i} className="ud-feature-card-premium" onClick={() => alert(`Reviewing core feature: ${f.title}`)}>
            <span className="ud-feature-icon">{f.icon}</span>
            <h3 style={{ fontFamily: 'var(--ud-font-heading)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1e293b' }}>{f.title}</h3>
            <p style={{ color: 'var(--ud-slate)', lineHeight: 1.7, fontSize: '0.95rem' }}>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export const GlobalTrust = () => (
    <section className="ud-trust-bar" aria-label="Enterprise Trust Provenance">
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '3rem' }} className="ud-trust-container">
            {['100%_SECURE_SYNC', 'ENTERPRISE_READY', 'SUB_MILLISECOND_LATENCY', 'CONNECTED_INTELLIGENCE'].map(trust => (
                <div key={trust} className="ud-mono" style={{ fontSize: '0.7rem', color: 'var(--ud-slate)', opacity: 0.8 }}>{trust}</div>
            ))}
        </div>
    </section>
);

export const InstitutionalFooter = () => (
    <footer className="ud-institutional-footer">
        <div className="ud-footer-grid">
            <div>
                <div className="ud-logo" style={{ color: 'white', fontSize: '2rem', marginBottom: '3rem' }}>COREORIGIN</div>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px' }}>
                    The high-fidelity core distribution platform for global commerce pipelines. Authority and provenance guaranteed.
                </p>
            </div>
            {['RESOURCES', 'PRODUCTS', 'COMPANY'].map(col => (
                <div key={col}>
                    <div className="ud-mono" style={{ color: 'white', marginBottom: '3rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="ud-footer-link-group">
                        {['Registry System', 'Features Node', 'Analytics Hub', 'Secure Protocol'].map(link => (
                            <span key={link} className="ud-footer-link" onClick={() => alert(`Navigating core nodes: ${link}`)}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div className="ud-footer-bottom">
            <div className="ud-mono" style={{ opacity: 0.4, fontSize: '0.65rem' }}>© 2026 SELLIO_CORE_OS // HORIZON_SYNC_STABLE</div>
            <div className="ud-footer-socials">
                {['INSTAGRAM', 'LINKEDIN', 'X_OS'].map(social => (
                    <span key={social} className="ud-mono" style={{ opacity: 0.4, fontSize: '0.65rem', cursor: 'pointer' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
