'use client';
import React, { useState } from 'react';

export const VenueHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="ecl-header">
      <div className="ecl-logo">
        LEGACY<span style={{ color: 'var(--ecl-gold)', fontWeight: 400, fontStyle: 'italic' }}>Arts</span>
      </div>
      
      <button 
          className={`ecl-hamburger ${isOpen ? 'ecl-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="ecl-hamburger-toggle"
      >
          <span className="ecl-hamburger-bar"></span>
          <span className="ecl-hamburger-bar"></span>
          <span className="ecl-hamburger-bar"></span>
      </button>

      <nav className={`ecl-nav ${isOpen ? 'ecl-nav-open' : ''}`}>
          {['The Repertoire', 'Patrons', 'Archives', 'Institutional'].map(link => (
              <a key={link} href="#" className="ecl-nav-link" onClick={() => setIsOpen(false)}>{link}</a>
          ))}
          <div className="ecl-mono ecl-mobile-btn" style={{ fontSize: '0.65rem', border: '1px solid var(--ecl-burgundy)', padding: '1rem 2rem', color: 'var(--ecl-burgundy)', textAlign: 'center', marginTop: '2rem', width: '100%', cursor: 'pointer' }} onClick={() => alert('Patron Portal synchronized.')}>
            PATRON PORTAL ACTIVE
          </div>
      </nav>

      <div className="ecl-mono ecl-desktop-btn" style={{ fontSize: '0.65rem', border: '1px solid var(--ecl-burgundy)', padding: '0.5rem 2rem', color: 'var(--ecl-burgundy)', cursor: 'pointer' }} onClick={() => alert('Patron Portal synchronized.')} id="ecl-btn-patron-portal">
        PATRON PORTAL ACTIVE
      </div>
    </header>
  );
};

export const OccasionCard = ({ title, location, date, category }: any) => (
  <div className="ecl-occasion-card" onClick={() => alert(`RSVP requested for: ${title}`)}>
    <div className="ecl-mono" style={{ marginBottom: '2.5rem' }}>{date} // {category.toUpperCase()}</div>
    <h3 style={{ fontFamily: 'var(--ecl-serif)', fontSize: '2.25rem', fontWeight: 900, marginBottom: '2rem', lineHeight: 1.1, color: 'var(--ecl-burgundy)' }}>{title}</h3>
    <div style={{ fontStyle: 'italic', color: 'var(--ecl-gold)', fontSize: '1.1rem', marginBottom: '3.5rem', fontFamily: 'var(--ecl-serif)' }}>{location}</div>
    
    <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--ecl-stone)', paddingTop: '2.5rem' }} className="ecl-rsvp-arrow">
        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--ecl-burgundy)', letterSpacing: '3px' }}>REQUEST PATRON PASS →</div>
    </div>
  </div>
);

export const BookingHUD = ({ label, value }: { label: string, value: string }) => (
    <div className="ecl-hud-block">
        <div style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontFamily: 'var(--ecl-serif)', fontWeight: 900, color: 'var(--ecl-burgundy)', marginBottom: '0.5rem' }}>{value}</div>
        <div className="ecl-mono" style={{ opacity: 0.4, fontSize: '0.6rem' }}>{label}</div>
    </div>
);

export const LegacyFooter = () => (
    <footer className="ecl-footer">
        <div className="ecl-footer-grid">
            <div>
                <div className="ecl-logo" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '3rem' }}>LEGACY</div>
                <p style={{ opacity: 0.3, lineHeight: 2, fontSize: '1rem', maxWidth: '400px', color: 'white' }}>
                    The world's most significant archive of cultural repertoire. Synchronizing institutional archives with global patron nodes.
                </p>
            </div>
            {['REPERTOIRE', 'PATRONS', 'GOVERNANCE'].map(col => (
                <div key={col}>
                    <div className="ecl-mono" style={{ color: 'var(--ecl-gold)', marginBottom: '3.5rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="ecl-footer-link-group">
                        {['Registry', 'Archives', 'Protocols', 'Auth'].map(link => (
                            <span key={link} style={{ fontSize: '0.9rem', opacity: 0.3, cursor: 'pointer', color: 'white' }} className="ecl-footer-link" onClick={() => alert(`Navigating: ${link}`)}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div className="ecl-footer-bottom">
            <div className="ecl-mono" style={{ opacity: 0.2, fontSize: '0.65rem', color: 'white' }}>© 2026 SELLIO_LEGACY_ARTS // ARCHIVE_STABLE</div>
            <div style={{ display: 'flex', gap: '5rem' }} className="ecl-footer-socials">
                {['INSTAGRAM', 'LINKEDIN', 'X_LEGACY'].map(social => (
                    <span key={social} className="ecl-mono" style={{ opacity: 0.2, fontSize: '0.65rem', cursor: 'pointer', color: 'white' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
