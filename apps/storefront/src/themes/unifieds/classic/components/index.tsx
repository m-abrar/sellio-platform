'use client';
import React, { useState } from 'react';

export const LegacyHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="uc-header">
      <div className="uc-logo">
        THE<span style={{ color: 'var(--uc-gold)' }}>LEGACY</span>NODE
      </div>
      
      <button 
          className={`uc-hamburger ${isOpen ? 'uc-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="uc-hamburger-toggle"
      >
          <span className="uc-hamburger-bar"></span>
          <span className="uc-hamburger-bar"></span>
          <span className="uc-hamburger-bar"></span>
      </button>

      <nav className={`uc-nav ${isOpen ? 'uc-nav-open' : ''}`}>
          {['Archive', 'Chronicles', 'Registry', 'Provenance'].map(link => (
              <a key={link} href="#" className="uc-nav-link" onClick={() => setIsOpen(false)}>{link}</a>
          ))}
          <button className="uc-btn-primary uc-mobile-btn" style={{ padding: '1rem 3rem', fontSize: '0.8rem', marginTop: '2rem', width: '100%' }} onClick={() => alert('Accessing Legacy Archive...')}>
            ENTER THE ARCHIVE
          </button>
      </nav>

      <button className="uc-btn-primary uc-desktop-btn" style={{ padding: '0.8rem 2rem', fontSize: '0.75rem' }} onClick={() => alert('Accessing Legacy Archive...')} id="uc-btn-header-access">
        ENTER ARCHIVE
      </button>
    </header>
  );
};

interface HeritageCardProps {
    num: string;
    title: string;
    description: string;
}

const HeritageCard = ({ num, title, description }: HeritageCardProps) => (
    <div className="uc-legacy-card" onClick={() => alert(`Reviewing registry node: ${title}`)}>
        <span className="uc-card-num">{num}</span>
        <h3 style={{ fontFamily: 'var(--uc-font-heading)', fontSize: '2rem', fontWeight: 900, color: 'var(--uc-burgundy)', marginBottom: '2rem' }}>{title}</h3>
        <p style={{ color: '#666', lineHeight: 2, fontSize: '1rem' }}>{description}</p>
    </div>
);

export const HeritageGrid = () => {
    const records = [
        { num: "01", title: "Institutional Legacy", description: "A high-fidelity foundation established through decades of multi-vertical distribution excellence." },
        { num: "02", title: "Verifiable Provenance", description: "Every asset in the legacy registry is verified for its historical integrity and functional legacy." },
        { num: "03", title: "Global Authority", description: "Synchronizing global commerce nodes through the world's most trusted structural protocol." },
    ];

    return (
        <section className="uc-heritage-grid" id="uc-heritage-registry">
            <div style={{ textAlign: 'center', marginBottom: '8rem' }} className="uc-grid-header">
                <span className="uc-mono" style={{ color: 'var(--uc-gold)' }}>ESTABLISHED_1996</span>
                <h2 style={{ fontFamily: 'var(--uc-font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, color: 'var(--uc-burgundy)', marginTop: '2rem' }}>The Registry of <br/>Excellence.</h2>
            </div>
            <div className="uc-heritage-grid-container">
                {records.map((r, i) => <HeritageCard key={i} {...r} />)}
            </div>
        </section>
    );
};

export const ChronicleBar = () => (
    <div className="uc-chronicle-bar">
        <span>★ CORE LEGACY HANDSHAKE PROTOCOL ENFORCED // SECURE STABLE</span>
        <span className="uc-chronicle-separator">//</span>
        <span>PROVENANCE TRUST METRIC: 100% SECURE INTEGRATION</span>
        <span className="uc-chronicle-separator">//</span>
        <span>VERIFIABLE ARCHIVE STABILITY: v8.4.1</span>
    </div>
);

export const AncestralFooter = () => (
    <footer className="uc-ancestral-footer">
        <div className="uc-footer-grid">
            <div>
                <div className="uc-logo" style={{ color: 'white', fontSize: '2.2rem', marginBottom: '3rem' }}>THELEGACYNODE</div>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px' }}>
                    A high-fidelity foundational registry for global commerce. Blending traditional authority with modern secure protocols.
                </p>
            </div>
            {['ARCHIVES', 'PROTOCOL', 'INSTITUTION'].map(col => (
                <div key={col}>
                    <div className="uc-mono" style={{ color: 'var(--uc-gold)', marginBottom: '3rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="uc-footer-link-group">
                        {['Registry', 'Provenance', 'Support Nodes', 'Auth Registry'].map(link => (
                            <span key={link} className="uc-footer-link" onClick={() => alert(`Accessing node: ${link}`)}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div className="uc-footer-bottom">
            <div className="uc-mono" style={{ opacity: 0.4, fontSize: '0.65rem' }}>© 2026 SELLIO_LEGACY_OS // HORIZON_SYNC_STABLE</div>
            <div className="uc-footer-socials">
                {['INSTAGRAM', 'LINKEDIN', 'X_OS'].map(social => (
                    <span key={social} className="uc-mono" style={{ opacity: 0.4, fontSize: '0.65rem', cursor: 'pointer' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
