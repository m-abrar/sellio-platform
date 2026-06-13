'use client';

import React, { useEffect, useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

export const Header = () => {
  const themeLink = usePropertyThemeLink();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <header className="pl-header">
      <a href={themeLink('/')} className="pl-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
        PLATINUM<span style={{ color: 'var(--pl-gold)' }}>Registry</span>
      </a>

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

      <div className={`pl-nav-panel ${isOpen ? 'pl-nav-open' : ''}`} aria-label="Primary">
        <MenuNav
          location="main_header"
          flat
          className="pl-nav"
          linkClassName="pl-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={hashAwareNavItemRenderer}
        />

        <MenuActionButtons
          linkClassName="pl-access-btn pl-mobile-auth-btn"
          onNavigate={() => setIsOpen(false)}
          renderItem={(item, props) => hashAwareNavItemRenderer(item, { ...props, isActive: false })}
        />
      </div>

      <MenuActionButtons
        linkClassName="pl-access-btn pl-desktop-auth-btn"
        renderItem={(item, props) => hashAwareNavItemRenderer(item, { ...props, isActive: false })}
      />
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
          <div className="pl-mono pl-bento-tag">Verified</div>
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

export const Footer = () => {
  const themeLink = usePropertyThemeLink();
  return (
  <footer className="pl-footer">
    <div className="pl-footer-grid">
      <div>
        <a href={themeLink('/')} className="pl-logo pl-footer-logo" style={{ textDecoration: 'none', color: 'inherit' }}>PLATINUM</a>
        <p className="pl-footer-copy">
          The world's most exclusive collection of private estates, verified for architectural excellence.
        </p>
      </div>
      <FooterMenuColumn
        location="footer_column_1"
        renderTitle={(title) => <div className="pl-mono pl-footer-heading">{title}</div>}
        listClassName="pl-footer-links"
        linkClassName="pl-footer-link"
      />
      <FooterMenuColumn
        location="footer_column_2"
        renderTitle={(title) => <div className="pl-mono pl-footer-heading">{title}</div>}
        listClassName="pl-footer-links"
        linkClassName="pl-footer-link"
      />
      <FooterMenuColumn
        location="footer_column_3"
        renderTitle={(title) => <div className="pl-mono pl-footer-heading">{title}</div>}
        listClassName="pl-footer-links"
        linkClassName="pl-footer-link"
      />
    </div>
    <div className="pl-footer-bottom">
      <div className="pl-mono pl-footer-copyright">© 2026 Sellio. All rights reserved.</div>
      <MenuNav
        location="social_footer"
        flat
        className="pl-footer-social"
        linkClassName="pl-mono pl-footer-social-link"
        renderItem={(item, { href, className, onNavigate }) => (
          <span className={className}>
            <a href={href} onClick={onNavigate} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
          </span>
        )}
      />
    </div>
  </footer>
  );
};
