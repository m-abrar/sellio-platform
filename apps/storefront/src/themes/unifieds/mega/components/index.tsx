'use client';
import React, { useState } from 'react';

export const MegaHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="ugm-header">
      <div className="ugm-logo">
        MEGA<span>GRID</span>
      </div>
      
      <button 
          className={`ugm-hamburger ${isOpen ? 'ugm-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="ugm-hamburger-toggle"
      >
          <span className="ugm-hamburger-bar"></span>
          <span className="ugm-hamburger-bar"></span>
          <span className="ugm-hamburger-bar"></span>
      </button>

      <nav className={`ugm-nav ${isOpen ? 'ugm-nav-open' : ''}`}>
          {['Infrastructure', 'Capacity', 'Redundancy', 'Provenances'].map(link => (
              <a key={link} href="#" className="ugm-nav-link" onClick={() => setIsOpen(false)}>{link}</a>
          ))}
          <button className="ugm-btn-primary ugm-mobile-btn" style={{ padding: '1rem 3rem', fontSize: '0.8rem', marginTop: '2rem', width: '100%' }} onClick={() => alert('Mega Grid sync active.')}>
            INITIALIZE MEGA SYNC
          </button>
      </nav>

      <button className="ugm-btn-primary ugm-desktop-btn" style={{ padding: '0.8rem 2rem', fontSize: '0.75rem', borderRadius: '4px' }} onClick={() => alert('Mega Grid sync active.')} id="ugm-btn-header-access">
        INITIALIZE MEGA SYNC
      </button>
    </header>
  );
};

interface MegaItemProps {
    title: string;
    value: string;
    label: string;
}

const MegaItem = ({ title, value, label }: MegaItemProps) => (
    <div className="ugm-grid-item" onClick={() => alert(`Reviewing: ${title}`)}>
        <div className="ugm-mono" style={{ color: 'var(--ugm-orange)', marginBottom: '1.5rem' }}>{title}</div>
        <div style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'var(--ugm-font-heading)', lineHeight: 1, marginBottom: '0.5rem', color: '#171717' }} className="ugm-value-text">{value}</div>
        <div style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 700, color: '#171717' }}>{label}</div>
    </div>
);

export const HeavyweightGrid = () => {
    const items = [
        { title: "GLOBAL_THROUGHPUT", value: "840TB", label: "Monthly Data Sync" },
        { title: "NODAL_CAPACITY", value: "12k+", label: "Active Distribution Nodes" },
        { title: "REGISTRY_VOLUME", value: "1.4M", label: "Verified Assets" },
        { title: "SYSTEM_UPTIME", value: "99.9", label: "Core Reliability" },
    ];

    return (
        <section className="ugm-heavyweight-grid" id="ugm-exchange-section">
            <div style={{ marginBottom: '8rem' }} className="ugm-grid-header">
                <span className="ugm-mono" style={{ color: 'var(--ugm-orange)' }}>HEAVYWEIGHT_LOGIC</span>
                <h2 style={{ fontFamily: 'var(--ugm-font-heading)', fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 900, marginTop: '2rem', letterSpacing: '-3px', color: '#171717', lineHeight: 1.1 }}>Unrivaled <br/>Capacity.</h2>
            </div>
            <div className="ugm-grid">
                {items.map((item, i) => <MegaItem key={i} {...item} />)}
            </div>
        </section>
    );
};

export const MassiveSyncBar = () => (
    <div className="ugm-massive-sync-bar">
        <span>★ INFRASTRUCTURE SYNC: ONLINE // 99.99% SYSTEM CAPABILITY ACTIVATED</span>
        <span className="ugm-bar-separator">//</span>
        <span>LATENCY TARGET: &lt;8ms NODAL PIPELINES</span>
        <span className="ugm-bar-separator">//</span>
        <span>SECURE HIGH VOLUME HEAVYWEIGHT PROTOCOL</span>
    </div>
);

export const AuthorityFooter = () => (
    <footer className="ugm-authority-footer">
        <div className="ugm-footer-grid">
            <div>
                <div className="ugm-logo" style={{ color: 'white', fontSize: '2.2rem', marginBottom: '3rem' }}>MEGAGRID</div>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px' }}>
                    The advanced heavyweight multi-category distribution node. Engineered for maximum scaling capacity and transactional authority.
                </p>
            </div>
            {['RESOURCES', 'PRODUCTS', 'COMPANY'].map(col => (
                <div key={col}>
                    <div className="ugm-mono" style={{ color: 'var(--ugm-orange)', marginBottom: '3rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="ugm-footer-link-group">
                        {['Nodal Registry', 'Capacity Hub', 'System Spec', 'Stable Sync'].map(link => (
                            <span key={link} className="ugm-footer-link" onClick={() => alert(`Navigating: ${link}`)}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div className="ugm-footer-bottom">
            <div className="ugm-mono" style={{ opacity: 0.4, fontSize: '0.65rem' }}>© 2026 SELLIO_MEGAGRID_OS // SYNC_STABLE</div>
            <div className="ugm-footer-socials">
                {['INSTAGRAM', 'LINKEDIN', 'X_OS'].map(social => (
                    <span key={social} className="ugm-mono" style={{ opacity: 0.4, fontSize: '0.65rem', cursor: 'pointer' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
