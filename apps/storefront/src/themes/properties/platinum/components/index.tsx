'use client';

import React, { useEffect, useState } from 'react';
import { scrollToSection } from '../utils';

const navItems = [
  { label: 'Collection', target: 'pl-showcase-section' },
  { label: 'Insights', target: 'pl-protocol-section' },
  { label: 'Concierge', target: 'pl-cta-section' },
  { label: 'Private Auth', target: 'pl-cta-section' },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavClick = (event: React.MouseEvent, target: string) => {
    event.preventDefault();
    setIsOpen(false);
    scrollToSection(target);
  };

  const handleAccess = () => {
    setIsOpen(false);
    scrollToSection('pl-showcase-section');
  };

  return (
    <header className="pl-header">
      <div className="pl-logo">
        PLATINUM<span style={{ color: 'var(--pl-gold)' }}>Registry</span>
      </div>

      {isOpen && (
        <button
          type="button"
          className="pl-nav-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
        />
      )}

      <button
        type="button"
        className={`pl-hamburger ${isOpen ? 'pl-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        aria-expanded={isOpen}
      >
        <span className="pl-hamburger-bar"></span>
        <span className="pl-hamburger-bar"></span>
        <span className="pl-hamburger-bar"></span>
      </button>

      <nav className={`pl-nav ${isOpen ? 'pl-nav-open' : ''}`} aria-label="Primary">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={`#${item.target}`}
            className="pl-nav-link"
            onClick={(event) => handleNavClick(event, item.target)}
          >
            {item.label.replace('_', ' ')}
          </a>
        ))}

        <button type="button" className="pl-access-btn pl-mobile-auth-btn" onClick={handleAccess}>
          ACCESS_SECURE_NODE
        </button>
      </nav>

      <button type="button" className="pl-access-btn pl-desktop-auth-btn" onClick={handleAccess}>
        ACCESS_SECURE_NODE
      </button>
    </header>
  );
};

export const ShowcaseCard = ({ title, price, image }: {
  title: string;
  price: string;
  image: string;
}) => (
  <div className="pl-bento-card">
    <img src={image} alt={title} className="pl-bento-img" loading="lazy" />
    <div className="pl-bento-overlay">
      <div className="pl-bento-overlay-row">
        <div className="pl-bento-overlay-copy">
          <h3>{title}</h3>
          <div className="pl-mono pl-bento-tag">CERTIFIED_ACQUISITION</div>
        </div>
        <div className="pl-bento-price">{price}</div>
      </div>
    </div>
  </div>
);

export const StatisticsNode = ({ label, value }: { label: string; value: string }) => (
  <div className="pl-stat-node">
    <div className="pl-mono pl-stat-label">{label}</div>
    <div className="pl-stat-value">{value}</div>
  </div>
);

export const Footer = () => (
  <footer className="pl-footer">
    <div className="pl-footer-grid">
      <div>
        <div className="pl-logo pl-footer-logo">PLATINUM</div>
        <p className="pl-footer-copy">
          The world's most exclusive distribution network for ultra-high-fidelity private estates.
        </p>
      </div>
      {['ACQUISITION', 'RESOURCES', 'LEGAL'].map((col) => (
        <div key={col}>
          <div className="pl-mono pl-footer-heading">{col}</div>
          <div className="pl-footer-links">
            {['Registry', 'Insights', 'Concierge', 'Node Auth'].map((link) => (
              <span key={link} className="pl-footer-link">{link}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className="pl-footer-bottom">
      <div className="pl-mono pl-footer-copyright">© 2026 SELLIO_PLATINUM_GRP // NODE_STABLE</div>
      <div className="pl-footer-social">
        {['INSTAGRAM', 'LINKEDIN', 'X_OS'].map((social) => (
          <span key={social} className="pl-mono pl-footer-social-link">{social}</span>
        ))}
      </div>
    </div>
  </footer>
);
