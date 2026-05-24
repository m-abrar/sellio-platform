'use client';

import React, { useEffect, useState } from 'react';
import { scrollToSection } from '../utils';

const navItems = [
  { label: 'Registry', target: 'pc-inventory-section' },
  { label: 'Yield Sync', target: 'pc-intelligence-section' },
  { label: 'Institutional', target: 'pc-cta-section' },
  { label: 'Master Auth', target: 'pc-cta-section' },
];

export const CommercialHeader = () => {
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

  return (
    <header className="pc-header">
      <div className="pc-logo">
        CORP<span style={{ color: 'var(--pc-blue)' }}>Portfolio</span>
      </div>

      {isOpen && (
        <button
          type="button"
          className="pc-nav-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
        />
      )}

      <button
        type="button"
        className={`pc-hamburger ${isOpen ? 'pc-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        aria-expanded={isOpen}
      >
        <span className="pc-hamburger-bar"></span>
        <span className="pc-hamburger-bar"></span>
        <span className="pc-hamburger-bar"></span>
      </button>

      <nav className={`pc-nav ${isOpen ? 'pc-nav-open' : ''}`} aria-label="Primary">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={`#${item.target}`}
            className="pc-nav-link"
            onClick={(event) => handleNavClick(event, item.target)}
          >
            {item.label}
          </a>
        ))}

        <button
          type="button"
          className="pc-audit-badge pc-mobile-auth-btn"
          onClick={() => handleNavClick({ preventDefault: () => {} } as React.MouseEvent, 'pc-inventory-section')}
        >
          AUDIT_STABLE
        </button>
      </nav>

      <button
        type="button"
        className="pc-audit-badge pc-desktop-auth-btn"
        onClick={() => scrollToSection('pc-inventory-section')}
      >
        AUDIT_STABLE
      </button>
    </header>
  );
};

export const AssetRegistryCard = ({ title, type, area, status, id, image, onClick }: {
  title: string;
  type: string;
  area: string;
  status: string;
  id: string;
  image?: string;
  onClick?: () => void;
}) => (
  <div className="pc-asset-card" onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
    {image && (
      <div className="pc-card-image-frame">
        <img src={image} alt={title} className="pc-card-img" loading="lazy" />
      </div>
    )}
    <div className="pc-mono pc-asset-id">{id} // {type}</div>
    <h3 className="pc-asset-title">{title}</h3>

    <div className="pc-asset-meta">
      <div>
        <div className="pc-mono pc-asset-meta-label">TOTAL_AREA</div>
        <div className="pc-asset-meta-value">{area}</div>
      </div>
      <div>
        <div className="pc-mono pc-asset-meta-label">STATUS</div>
        <div className={`pc-asset-meta-value ${status === 'AVAILABLE' ? 'pc-status-available' : ''}`}>{status}</div>
      </div>
    </div>

    <div className="pc-asset-footer">
      <span>REQUEST_AUDIT</span>
      <span className="pc-asset-cta">VIEW_YIELD →</span>
    </div>
  </div>
);

export const IntelligenceHUD = ({ label, value }: { label: string; value: string }) => (
  <div className="pc-hud-node">
    <div className="pc-mono pc-hud-label">{label}</div>
    <div className="pc-hud-value">{value}</div>
  </div>
);

export const InstitutionalFooter = () => (
  <footer className="pc-footer">
    <div className="pc-footer-grid">
      <div>
        <div className="pc-logo pc-footer-logo">CORP</div>
        <p className="pc-footer-copy">
          The global authoritative registry for institutional-grade commercial assets. Synchronizing yield and structural metadata.
        </p>
      </div>
      {['ACQUISITION', 'AUDIT', 'GOVERNANCE'].map((col) => (
        <div key={col}>
          <div className="pc-mono pc-footer-heading">{col}</div>
          <div className="pc-footer-links">
            {['Registry', 'Verification', 'Support', 'Auth'].map((link) => (
              <span key={link} className="pc-footer-link">{link}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className="pc-footer-bottom">
      <div className="pc-mono pc-footer-copyright">© 2026 SELLIO_COMMERCIAL_GRP // NODE_STABLE</div>
      <div className="pc-footer-social">
        {['INSTAGRAM', 'LINKEDIN', 'X_OS'].map((social) => (
          <span key={social} className="pc-mono pc-footer-social-link">{social}</span>
        ))}
      </div>
    </div>
  </footer>
);
