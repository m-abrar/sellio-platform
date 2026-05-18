'use client';
import React, { useState } from 'react';

export const SilentHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="usm-header">
      <div className="usm-logo">
        SILENT<span>EDGE</span>
      </div>
      
      <button 
          className={`usm-hamburger ${isOpen ? 'usm-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="usm-hamburger-toggle"
      >
          <span className="usm-hamburger-bar"></span>
          <span className="usm-hamburger-bar"></span>
          <span className="usm-hamburger-bar"></span>
      </button>

      <nav className={`usm-nav ${isOpen ? 'usm-nav-open' : ''}`}>
          {['Quietude', 'Telemetry', 'Presence', 'Void'].map(link => (
              <a key={link} href="#" className="usm-nav-link" onClick={() => setIsOpen(false)}>{link}</a>
          ))}
          <button className="usm-btn-primary usm-mobile-btn" style={{ padding: '1rem 3rem', fontSize: '0.8rem', marginTop: '2rem', width: '100%' }} onClick={() => alert('Silent sync active.')}>
            INITIALIZE VOID
          </button>
      </nav>

      <button className="usm-btn-primary usm-desktop-btn" style={{ padding: '0.8rem 2rem', fontSize: '0.75rem', borderRadius: '0' }} onClick={() => alert('Silent sync active.')} id="usm-btn-header-access">
        INITIALIZE VOID
      </button>
    </header>
  );
};

interface MinimalItemProps {
    title: string;
    description: string;
}

const MinimalItem = ({ title, description }: MinimalItemProps) => (
    <div className="usm-grid-item" onClick={() => alert(`Reviewing: ${title}`)}>
        <h3 style={{ fontFamily: 'var(--usm-font-heading)', fontSize: '1rem', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '2rem', color: '#000000' }}>{title}</h3>
        <p style={{ color: '#888', lineHeight: 2, fontSize: '0.85rem', fontWeight: 300 }}>{description}</p>
    </div>
);

export const MinimalGrid = () => {
    const items = [
        { title: "Reductionist Logic", description: "A high-fidelity distribution node stripped of all non-essential telemetry." },
        { title: "Zero Latency", description: "Synchronizing global commerce through invisible architectural transitions." },
        { title: "Pure Presence", description: "Establishing structural authority through minimalist geometric precision." },
    ];

    return (
        <section className="usm-minimal-grid" id="usm-exchange-section">
            <div className="usm-grid">
                {items.map((item, i) => <MinimalItem key={i} {...item} />)}
            </div>
        </section>
    );
};

export const VoidSyncBar = () => (
    <div className="usm-void-sync-bar">
        <span>★ TELEMETRY SYNC: INACTIVE // 100% PURE REDUCTIONIST CAPACITY</span>
        <span className="usm-bar-separator">//</span>
        <span>LATENCY TARGET: &lt;1ms ZEN PIPELINES</span>
        <span className="usm-bar-separator">//</span>
        <span>SECURE ULTRA MINIMAL GHOST PROTOCOL</span>
    </div>
);

export const ZenFooter = () => (
    <footer className="usm-zen-footer">
        <div className="usm-footer-grid">
            <div>
                <div className="usm-logo" style={{ color: 'black', fontSize: '1.5rem', marginBottom: '3rem' }}>SILENTEDGE</div>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px' }}>
                    The advanced reductionist multi-category distribution node. Engineered for pure minimalist performance and zero operational noise.
                </p>
            </div>
            {['PRACTICES', 'PARADIGMS', 'REDUCTIONS'].map(col => (
                <div key={col}>
                    <div className="usm-mono usm-footer-title" style={{ color: 'black', marginBottom: '3rem', fontWeight: 500 }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="usm-footer-link-group">
                        {['Zen Registry', 'Silent Hub', 'Ghost Spec', 'Invisible Sync'].map(link => (
                            <span key={link} className="usm-footer-link" onClick={() => alert(`Navigating: ${link}`)}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div className="usm-footer-bottom">
            <div className="usm-mono" style={{ opacity: 0.4, fontSize: '0.65rem' }}>© 2026 SELLIO_SILENTEDGE_OS // ZERO_NOISE</div>
            <div className="usm-footer-socials">
                {['INSTAGRAM', 'LINKEDIN', 'X_OS'].map(social => (
                    <span key={social} className="usm-mono" style={{ opacity: 0.4, fontSize: '0.65rem', cursor: 'pointer' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
