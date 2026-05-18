'use client';
import React, { useState } from 'react';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="ecc-header">
      <div className="ecc-header-container">
        <div className="ecc-logo">
          FORUM<span>26</span>
        </div>
        
        <button 
            className={`ecc-hamburger ${isOpen ? 'ecc-hamburger-open' : ''}`} 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation"
            id="ecc-hamburger-toggle"
        >
            <span className="ecc-hamburger-bar"></span>
            <span className="ecc-hamburger-bar"></span>
            <span className="ecc-hamburger-bar"></span>
        </button>

        <nav className={`ecc-nav ${isOpen ? 'ecc-nav-open' : ''}`}>
          {['SPEAKERS', 'SCHEDULE', 'VENUE', 'PARTNERS'].map(item => (
            <span 
                key={item} 
                className="ecc-nav-link" 
                onClick={() => {
                  setIsOpen(false);
                  if (item === 'SPEAKERS') document.getElementById('ecc-speakers-section')?.scrollIntoView({ behavior: 'smooth' });
                  if (item === 'SCHEDULE') document.getElementById('ecc-agenda-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
            >
              {item}
            </span>
          ))}
          <button className="ecc-btn-primary ecc-mobile-btn" style={{ width: '100%', borderRadius: '100px', padding: '1rem 3rem', marginTop: '2rem' }} onClick={() => alert('Registration initialized.')}>
            REGISTER NOW
          </button>
        </nav>

        <button className="ecc-btn-primary ecc-desktop-btn" onClick={() => alert('Registration initialized.')} id="ecc-btn-header-register">
          REGISTER NOW
        </button>
      </div>
    </header>
  );
};

export const Footer = () => (
  <footer className="ecc-footer">
    <div className="ecc-footer-grid">
      <div>
        <div style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--ecc-obsidian)' }}>FORUM26</div>
        <p style={{ color: 'var(--ecc-text-muted)', lineHeight: 1.8, maxWidth: '400px' }}>
          The premier global assembly for architectural engineering and distributed systems. Shaping the future of technical infrastructure.
        </p>
      </div>
      
      <div>
          <div className="ecc-mono" style={{ marginBottom: '2rem', color: 'var(--ecc-text-main)' }}>EXPLORE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="ecc-footer-link-group">
              {['Speakers', 'Agenda', 'Workshops', 'Certification'].map(item => (
                  <span key={item} style={{ color: 'var(--ecc-text-muted)', fontSize: '0.95rem', cursor: 'pointer' }} className="ecc-footer-link" onClick={() => alert(`Navigating: ${item}`)}>{item}</span>
              ))}
          </div>
      </div>

      <div>
          <div className="ecc-mono" style={{ marginBottom: '2rem', color: 'var(--ecc-text-main)' }}>CONTACT</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ color: 'var(--ecc-text-muted)', fontSize: '0.95rem' }}>support@forum26.com</span>
              <span style={{ color: 'var(--ecc-text-muted)', fontSize: '0.95rem' }}>San Francisco, CA</span>
          </div>
      </div>
    </div>
    
    <div className="ecc-footer-bottom">
        <div style={{ color: 'var(--ecc-text-muted)', fontSize: '0.85rem' }}>© 2026 SELLIO_EVENTS_GRP</div>
        <div style={{ display: 'flex', gap: '3rem' }} className="ecc-footer-socials">
            {['PRIVACY', 'TERMS', 'CODE_OF_CONDUCT'].map(item => (
                <span key={item} className="ecc-mono" style={{ fontSize: '0.65rem', cursor: 'pointer' }} onClick={() => alert(`Reviewing: ${item}`)}>{item}</span>
            ))}
        </div>
    </div>
  </footer>
);

export const SpeakerCard = ({ name, role, company, image }: any) => (
  <div className="ecc-speaker-card" onClick={() => alert(`Speaker bio loaded: ${name}`)}>
    <img src={image} alt={name} className="ecc-speaker-image" />
    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--ecc-obsidian)' }}>{name}</h3>
    <div style={{ color: 'var(--ecc-blue)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.2rem' }}>{company}</div>
    <div style={{ color: 'var(--ecc-text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>{role}</div>
  </div>
);

export const AgendaItem = ({ time, title, speaker, track }: any) => (
  <div className="ecc-agenda-item" onClick={() => alert(`Agenda Details for: ${title}`)}>
    <div className="ecc-mono" style={{ fontSize: '0.85rem' }}>{time}</div>
    <div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ 
                background: 'var(--ecc-bone)', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '4px', 
                fontSize: '0.65rem', 
                fontWeight: 800, 
                color: 'var(--ecc-text-muted)',
                letterSpacing: '1px'
            }}>{track}</span>
        </div>
        <h4 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.5px', color: 'var(--ecc-obsidian)' }}>{title}</h4>
        <div style={{ color: 'var(--ecc-text-muted)', fontWeight: 500 }}>Presented by <span style={{ color: 'var(--ecc-text-main)', fontWeight: 700 }}>{speaker}</span></div>
    </div>
  </div>
);
