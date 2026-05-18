'use client';
import React, { useState } from 'react';

export const CreativeHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="evc-header">
      <div className="evc-header-container">
        <div className="evc-logo">
          CREATIVE<span>Node</span>
        </div>
        
        <button 
            className={`evc-hamburger ${isOpen ? 'evc-hamburger-open' : ''}`} 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation"
            id="evc-hamburger-toggle"
        >
            <span className="evc-hamburger-bar"></span>
            <span className="evc-hamburger-bar"></span>
            <span className="evc-hamburger-bar"></span>
        </button>

        <nav className={`evc-nav ${isOpen ? 'evc-nav-open' : ''}`}>
            {['Protocols', 'Laboratory', 'Manifesto', 'Node_Auth'].map(link => (
                <a 
                    key={link} 
                    href="#" 
                    className="evc-nav-link" 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false);
                      if (link === 'Protocols') document.getElementById('evc-protocols-section')?.scrollIntoView({ behavior: 'smooth' });
                      if (link === 'Laboratory') document.getElementById('evc-lab-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                  {link}
                </a>
            ))}
            <div className="evc-label evc-mobile-btn" style={{ fontSize: '0.65rem', border: '1px solid var(--evc-lime)', padding: '1rem 2rem', color: 'var(--evc-lime)', textAlign: 'center', marginTop: '2rem', width: '100%', cursor: 'pointer' }} onClick={() => alert('Experiment mode active.')}>
              EXPERIMENT_MODE: ACTIVE
            </div>
        </nav>

        <div className="evc-label evc-desktop-btn" style={{ fontSize: '0.65rem', border: '1px solid var(--evc-lime)', padding: '0.5rem 1.5rem', color: 'var(--evc-lime)', cursor: 'pointer' }} onClick={() => alert('Experiment mode active.')} id="evc-btn-experiment-status">
          EXPERIMENT_MODE: ACTIVE
        </div>
      </div>
    </header>
  );
};

export const ArtisanEventCard = ({ title, location, date, status }: any) => (
  <div className="evc-artisan-card" onClick={() => alert(`Syncing node for: ${title}`)}>
    <div className="evc-tag">{status.toUpperCase()} // 2026</div>
    <div className="evc-label" style={{ marginBottom: '1.5rem', fontSize: '0.55rem', color: 'var(--evc-grey)' }}>{date} // {location.toUpperCase()}</div>
    <h3 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '3.5rem', lineHeight: 1.1, letterSpacing: '-1.5px', color: 'white' }}>{title}</h3>
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--evc-zinc)', paddingTop: '2.5rem' }} className="evc-card-footer">
        <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--evc-lime)', letterSpacing: '2px' }} className="evc-card-arrow">SYNC_NODE →</div>
        <div style={{ fontSize: '1.5rem', opacity: 0.3 }} className="evc-card-asterisk">✺</div>
    </div>
  </div>
);

export const PulseHUD = ({ label, value }: { label: string, value: string }) => (
    <div className="evc-hud-block">
        <div style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, color: 'var(--evc-lime)', marginBottom: '1rem', letterSpacing: '-4px' }}>{value}</div>
        <div className="evc-label" style={{ fontSize: '0.6rem', color: 'var(--evc-grey)' }}>{label}</div>
    </div>
);

export const VibrantFooter = () => (
    <footer className="evc-footer">
        <div className="evc-footer-grid">
            <div>
                <div className="evc-logo" style={{ fontSize: '3rem', marginBottom: '3.5rem' }}>CREATIVE</div>
                <p style={{ color: 'var(--evc-grey)', lineHeight: 2, fontSize: '1.1rem', maxWidth: '400px' }}>
                    The world's most vibrant distribution node for experimental event modules. Synchronizing creative pulses with global community nodes.
                </p>
            </div>
            {['PROTOCOLS', 'LABORATORY', 'COMMUNITY'].map(col => (
                <div key={col}>
                    <div className="evc-label" style={{ marginBottom: '3.5rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="evc-footer-link-group">
                        {['Hackathons', 'Synthetic Art', 'Bio-Digital', 'Auth'].map(link => (
                            <span key={link} style={{ fontSize: '1rem', color: 'var(--evc-grey)', cursor: 'pointer' }} className="evc-footer-link" onClick={() => alert(`Navigating: ${link}`)}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div className="evc-footer-bottom">
            <div className="evc-label" style={{ opacity: 0.2, fontSize: '0.65rem' }}>© 2026 SELLIO_CREATIVE_NODE // PULSE_STABLE</div>
            <div style={{ display: 'flex', gap: '5rem' }} className="evc-footer-socials">
                {['INSTAGRAM', 'LINKEDIN', 'X_CREATIVE'].map(social => (
                    <span key={social} className="evc-label" style={{ opacity: 0.2, fontSize: '0.65rem', cursor: 'pointer' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
