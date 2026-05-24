'use client';

import React, { useEffect, useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';

export const CommercialHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

      <div role="navigation" className={`pc-nav-panel ${isOpen ? 'pc-nav-open' : ''}`} aria-label="Primary">
        <MenuNav
          location="main_header"
          flat
          className="pc-nav"
          linkClassName="pc-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={hashAwareNavItemRenderer}
        />

        <MenuActionButtons
          linkClassName="pc-audit-badge pc-mobile-auth-btn"
          onNavigate={() => setIsOpen(false)}
          renderItem={(item, props) => hashAwareNavItemRenderer(item, { ...props, isActive: false, className: 'pc-audit-badge pc-mobile-auth-btn' })}
        />
      </div>

      <MenuActionButtons
        linkClassName="pc-audit-badge pc-desktop-auth-btn"
        renderItem={(item, props) => hashAwareNavItemRenderer(item, { ...props, isActive: false, className: 'pc-audit-badge pc-desktop-auth-btn' })}
      />
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
      <FooterMenuColumn
        location="footer_column_1"
        renderTitle={(title) => <div className="pc-mono pc-footer-heading">{title}</div>}
        listClassName="pc-footer-links"
        linkClassName="pc-footer-link"
      />
      <FooterMenuColumn
        location="footer_column_2"
        renderTitle={(title) => <div className="pc-mono pc-footer-heading">{title}</div>}
        listClassName="pc-footer-links"
        linkClassName="pc-footer-link"
      />
      <FooterMenuColumn
        location="footer_column_3"
        renderTitle={(title) => <div className="pc-mono pc-footer-heading">{title}</div>}
        listClassName="pc-footer-links"
        linkClassName="pc-footer-link"
      />
    </div>
    <div className="pc-footer-bottom">
      <div className="pc-mono pc-footer-copyright">© 2026 SELLIO_COMMERCIAL_GRP // NODE_STABLE</div>
      <MenuNav
        location="social_footer"
        flat
        className="pc-footer-social"
        linkClassName="pc-mono pc-footer-social-link"
        renderItem={(item, { href, className, onNavigate }) => (
          <span className={className}>
            <a href={href} onClick={onNavigate} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
          </span>
        )}
      />
    </div>
  </footer>
);
