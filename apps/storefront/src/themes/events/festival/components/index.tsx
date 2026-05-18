'use client';
import React, { useState } from 'react';

export const FestivalHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="eff-header">
      <div className="eff-header-container">
        <div className="eff-logo">
          NEON<span>Pulse</span>
        </div>
        
        <button 
            className={`eff-hamburger ${isOpen ? 'eff-hamburger-open' : ''}`} 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation"
            id="eff-hamburger-toggle"
        >
            <span className="eff-hamburger-bar"></span>
            <span className="eff-hamburger-bar"></span>
            <span className="eff-hamburger-bar"></span>
        </button>

        <nav className={`eff-nav ${isOpen ? 'eff-nav-open' : ''}`}>
            {['Lineup', 'Stages', 'Collective', 'Vibe_Auth'].map(link => (
                <a 
                    key={link} 
                    href="#" 
                    className="eff-nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false);
                      if (link === 'Lineup') document.getElementById('eff-stages-section')?.scrollIntoView({ behavior: 'smooth' });
                      if (link === 'Stages') document.getElementById('eff-stages-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                  {link}
                </a>
            ))}
            <div className="eff-mono eff-mobile-btn" style={{ fontSize: '0.65rem', border: '1px solid var(--eff-magenta)', padding: '1rem 2rem', color: 'var(--eff-magenta)', textAlign: 'center', marginTop: '2rem', width: '100%', cursor: 'pointer' }} onClick={() => alert('Vibe sync active.')}>
              VIBE_SYNC_ACTIVE
            </div>
        </nav>

        <div className="eff-mono eff-desktop-btn" style={{ fontSize: '0.65rem', border: '1px solid var(--eff-magenta)', padding: '0.5rem 2rem', color: 'var(--eff-magenta)', cursor: 'pointer' }} onClick={() => alert('Vibe sync active.')} id="eff-btn-vibe-status">
          VIBE_SYNC_ACTIVE
        </div>
      </div>
    </header>
  );
};

export const StageLineupCard = ({ title, location, date, image }: any) => (
  <div className="eff-stage-card" onClick={() => alert(`Securing pass for: ${title}`)}>
    <img src={image} alt={title} className="eff-img" />
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4rem', background: 'linear-gradient(to top, #000 0%, transparent 100%)' }} className="eff-card-content">
        <div className="eff-mono" style={{ marginBottom: '1.5rem', color: 'var(--eff-magenta)' }}>{date} // {location.toUpperCase()}</div>
        <h3 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, letterSpacing: '-2px', color: 'white' }}>{title}</h3>
        
        <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem', alignItems: 'center' }} className="eff-card-action">
            <div style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '2px', color: 'white' }} className="eff-action-text">SECURE_PASS →</div>
            <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.3)' }} className="eff-action-line"></div>
        </div>
    </div>
  </div>
);

export const AtmosphereHUD = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div style={{ textAlign: 'center' }} className="eff-hud-block">
        <div style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 900, color: color, marginBottom: '0.5rem', letterSpacing: '-5px' }}>{value}</div>
        <div className="eff-mono" style={{ opacity: 0.4, fontSize: '0.65rem', color: 'white' }}>{label}</div>
    </div>
);

export const NexusFooter = () => (
    <footer className="eff-footer">
        <div className="eff-footer-grid">
            <div>
                <div className="eff-logo" style={{ fontSize: '3.5rem', marginBottom: '3.5rem' }}>NEON</div>
                <p style={{ color: 'var(--eff-grey)', lineHeight: 2, fontSize: '1.1rem', maxWidth: '400px' }}>
                    The world's most immersive distribution node for high-vibe environments. Synchronizing collective pulses with global neon nodes.
                </p>
            </div>
            {['COLLECTIVE', 'STAGES', 'GOVERNANCE'].map(col => (
                <div key={col}>
                    <div className="eff-mono" style={{ color: 'var(--eff-magenta)', marginBottom: '3.5rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="eff-footer-link-group">
                        {['Lineup', 'Vibe Sync', 'Patrons', 'Auth'].map(link => (
                            <span key={link} style={{ fontSize: '1rem', color: 'var(--eff-grey)', cursor: 'pointer' }} className="eff-footer-link" onClick={() => alert(`Navigating: ${link}`)}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div className="eff-footer-bottom">
            <div className="eff-mono" style={{ opacity: 0.2, fontSize: '0.65rem', color: 'white' }}>© 2026 SELLIO_NEON_NODE // VIBE_STABLE</div>
            <div style={{ display: 'flex', gap: '5rem' }} className="eff-footer-socials">
                {['INSTAGRAM', 'LINKEDIN', 'X_NEON'].map(social => (
                    <span key={social} className="eff-mono" style={{ opacity: 0.2, fontSize: '0.65rem', cursor: 'pointer', color: 'white' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
