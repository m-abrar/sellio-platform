'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';

const experimentModeStyle = {
  fontSize: '0.65rem',
  border: '1px solid var(--evc-lime)',
  color: 'var(--evc-lime)',
  cursor: 'pointer',
} as const;

export const CreativeHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const themeLink = useEventsThemeLink();
  const brandLabel = useThemeContent('header.brand_label', 'CREATIVENode');
  const midpoint = Math.max(1, Math.ceil(brandLabel.length / 2));

  return (
    <header className="evc-header">
      <div className="evc-header-container">
        <a href={themeLink('/')} className="evc-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
          {brandLabel.slice(0, midpoint)}<span>{brandLabel.slice(midpoint)}</span>
        </a>
        
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

        <MenuNav
          location="main_header"
          flat
          className={`evc-nav ${isOpen ? 'evc-nav-open' : ''}`}
          linkClassName="evc-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={hashAwareNavItemRenderer}
        />

        <MenuActionButtons
          location="action_buttons"
          className="evc-label evc-mobile-btn"
          as="button"
          onNavigate={() => setIsOpen(false)}
          renderItem={(item, { className, onNavigate }) => (
            <Link href={themeLink('/explore')} style={{ textDecoration: 'none', width: '100%' }} onClick={onNavigate}>
              <div
                className={className}
                style={{ ...experimentModeStyle, padding: '1rem 2rem', textAlign: 'center', marginTop: '2rem', width: '100%' }}
              >
                {item.title}
              </div>
            </Link>
          )}
        />

        <MenuActionButtons
          location="action_buttons"
          className="evc-label evc-desktop-btn"
          as="button"
          renderItem={(item, { className, onNavigate }) => (
            <Link href={themeLink('/explore')} style={{ textDecoration: 'none' }} onClick={onNavigate}>
              <div
                className={className}
                style={{ ...experimentModeStyle, padding: '0.5rem 1.5rem' }}
                id="evc-btn-experiment-status"
              >
                {item.title}
              </div>
            </Link>
          )}
        />
      </div>
    </header>
  );
};

interface ArtisanEventCardProps {
  title: string;
  location: string;
  date: string;
  status: string;
}

export const ArtisanEventCard = ({ title, location, date, status }: ArtisanEventCardProps) => (
  <div className="evc-artisan-card">
    <div className="evc-tag">{status.toUpperCase()} {'//'} 2026</div>
    <div className="evc-label" style={{ marginBottom: '1.5rem', fontSize: '0.55rem', color: 'var(--evc-grey)' }}>{date} {'//'} {location.toUpperCase()}</div>
    <h3 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '3.5rem', lineHeight: 1.1, letterSpacing: '-1.5px', color: 'white' }}>{title}</h3>
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--evc-zinc)', paddingTop: '2.5rem' }} className="evc-card-footer">
        <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--evc-lime)', letterSpacing: '2px' }} className="evc-card-arrow">Get Tickets →</div>
        <div style={{ fontSize: '1.5rem', opacity: 0.3 }} className="evc-card-asterisk">*</div>
    </div>
  </div>
);

export const PulseHUD = ({ label, value }: { label: string, value: string }) => (
    <div className="evc-hud-block">
        <div style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, color: 'var(--evc-lime)', marginBottom: '1rem', letterSpacing: '-4px' }}>{value}</div>
        <div className="evc-label" style={{ fontSize: '0.6rem', color: 'var(--evc-grey)' }}>{label}</div>
    </div>
);

export const VibrantFooter = () => {
    const themeLink = useEventsThemeLink();
    const brandLabel = useThemeContent('footer.brand_label', 'CREATIVE');
    const footerDescription = useThemeContent(
      'footer.description',
      "The home of creative events. Discover and book experimental art, music, and culture experiences near you."
    );
    const footerCopyright = useThemeContent('footer.copyright', '© 2026 CREATIVENode. All rights reserved.');

    return (
        <footer className="evc-footer">
            <div className="evc-footer-grid">
                <div>
                    <a href={themeLink('/')} className="evc-logo" style={{ fontSize: '3rem', marginBottom: '3.5rem', display: 'block', textDecoration: 'none', color: 'inherit' }}>{brandLabel}</a>
                    <p style={{ color: 'var(--evc-grey)', lineHeight: 2, fontSize: '1.1rem', maxWidth: '400px' }}>
                        {footerDescription}
                    </p>
                </div>
                <FooterMenuColumn
                  location="footer_column_1"
                  renderTitle={(title) => (
                    <div className="evc-label" style={{ marginBottom: '3.5rem' }}>{title}</div>
                  )}
                  listClassName="evc-footer-link-group"
                  linkClassName="evc-footer-link"
                />
                <FooterMenuColumn
                  location="footer_column_2"
                  renderTitle={(title) => (
                    <div className="evc-label" style={{ marginBottom: '3.5rem' }}>{title}</div>
                  )}
                  listClassName="evc-footer-link-group"
                  linkClassName="evc-footer-link"
                />
                <FooterMenuColumn
                  location="footer_column_3"
                  renderTitle={(title) => (
                    <div className="evc-label" style={{ marginBottom: '3.5rem' }}>{title}</div>
                  )}
                  listClassName="evc-footer-link-group"
                  linkClassName="evc-footer-link"
                />
            </div>
            <div className="evc-footer-bottom">
                <div className="evc-label" style={{ opacity: 0.2, fontSize: '0.65rem' }}>{footerCopyright}</div>
                <MenuNav
                  location="social_footer"
                  flat
                  className="evc-footer-socials"
                  linkClassName="evc-label"
                  renderItem={(item, { href, className, onNavigate }) => (
                    <span className={className} style={{ opacity: 0.2, fontSize: '0.65rem', cursor: 'pointer' }}>
                      <a href={href} onClick={onNavigate} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
                    </span>
                  )}
                />
            </div>
        </footer>
    );
};
