'use client';
import React, { useState } from 'react';

export const SilentHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="usm-header">
      <div className="usm-logo" style={{ textTransform: 'none', letterSpacing: 'normal', fontSize: '1.4rem', fontWeight: 700 }}>
        Universal<span style={{ color: 'var(--usm-primary)' }}>.</span>
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
          {[
            { label: 'Home', target: '#home' },
            { label: 'Explore', target: '#usm-explore-section' },
            { label: 'Listings', target: '#usm-curated-section' },
            { label: 'Contact', target: '#' }
          ].map(link => (
              <a 
                key={link.label} 
                href={link.target} 
                className="usm-nav-link" 
                style={{ textTransform: 'none', letterSpacing: '0.02em', fontSize: '0.9rem', fontWeight: 400 }}
                onClick={(e) => {
                  setIsOpen(false);
                  if (link.target.startsWith('#')) {
                    e.preventDefault();
                    const targetEl = document.querySelector(link.target);
                    if (targetEl) {
                      targetEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
              >
                {link.label}
              </a>
          ))}
          <button className="usm-btn-primary usm-mobile-btn" style={{ padding: '0.85rem 2rem', fontSize: '0.8rem', marginTop: '2rem', width: '100%' }} onClick={() => alert('Post Listing initiated.')}>
            Post Listing
          </button>
      </nav>

      <button className="usm-btn-primary usm-desktop-btn" style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem', borderRadius: '4px' }} onClick={() => alert('Post Listing initiated.')} id="usm-btn-header-access">
        Post Listing
      </button>
    </header>
  );
};

export const ZenFooter = () => (
    <footer className="usm-zen-footer" style={{ borderTop: '1px solid var(--usm-border)' }}>
        <div className="usm-footer-grid">
            <div>
                <div className="usm-logo" style={{ color: 'black', textTransform: 'none', letterSpacing: 'normal', fontSize: '1.4rem', fontWeight: 700, marginBottom: '2rem' }}>
                  Universal<span style={{ color: 'var(--usm-primary)' }}>.</span>
                </div>
                <p style={{ opacity: 0.6, lineHeight: 1.8, fontSize: '0.9rem', maxWidth: '300px', fontWeight: 300 }}>
                    The luxury standard in marketplace design. Simple, precise, elegant and timeless.
                </p>
            </div>
            {[
              {
                title: 'Company',
                links: ['About Us', 'Careers', 'Press']
              },
              {
                title: 'Support',
                links: ['Contact', 'Help Center', 'FAQs']
              },
              {
                title: 'Legal',
                links: ['Terms of Use', 'Privacy Policy', 'Cookies']
              }
            ].map(col => (
                <div key={col.title}>
                    <div style={{ color: 'black', marginBottom: '2rem', fontSize: '0.95rem', fontWeight: 600 }}>{col.title}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="usm-footer-link-group">
                        {col.links.map(link => (
                            <span key={link} className="usm-footer-link" onClick={() => alert(`Navigating: ${link}`)} style={{ fontSize: '0.85rem', fontWeight: 300 }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div className="usm-footer-bottom" style={{ marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid var(--usm-border)' }}>
            <div style={{ opacity: 0.6, fontSize: '0.85rem', fontWeight: 300 }}>© 2026 Universal Marketplace. All rights reserved.</div>
            <div className="usm-footer-socials" style={{ display: 'flex', gap: '2rem' }}>
                {['Instagram', 'LinkedIn', 'Twitter'].map(social => (
                    <span key={social} style={{ opacity: 0.6, fontSize: '0.85rem', cursor: 'pointer', fontWeight: 300 }} onClick={() => alert(`Opening: ${social}`)}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
