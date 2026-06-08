'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';

const vibeSyncStyle = {
  fontSize: '0.65rem',
  border: '1px solid var(--eff-magenta)',
  color: 'var(--eff-magenta)',
  cursor: 'pointer',
} as const;

export const FestivalHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const themeLink = useEventsThemeLink();
  const brandLabel = useThemeContent('header.brand_label', 'NEONPulse');
  const midpoint = Math.max(1, Math.ceil(brandLabel.length / 2));

  return (
    <header className="eff-header">
      <div className="eff-header-container">
        <div className="eff-logo">
          {brandLabel.slice(0, midpoint)}<span>{brandLabel.slice(midpoint)}</span>
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

        <MenuNav
          location="main_header"
          flat
          className={`eff-nav ${isOpen ? 'eff-nav-open' : ''}`}
          linkClassName="eff-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={hashAwareNavItemRenderer}
        />

        <MenuActionButtons
          location="action_buttons"
          className="eff-mono eff-mobile-btn"
          as="button"
          onNavigate={() => setIsOpen(false)}
          renderItem={(item, { className, onNavigate }) => (
            <Link href={themeLink('/explore')} style={{ textDecoration: 'none', width: '100%' }} onClick={onNavigate}>
              <div
                className={className}
                style={{ ...vibeSyncStyle, padding: '1rem 2rem', textAlign: 'center', marginTop: '2rem', width: '100%' }}
              >
                {item.title.toUpperCase()}_ACTIVE
              </div>
            </Link>
          )}
        />

        <MenuActionButtons
          location="action_buttons"
          className="eff-mono eff-desktop-btn"
          as="button"
          renderItem={(item, { className, onNavigate }) => (
            <Link href={themeLink('/explore')} style={{ textDecoration: 'none' }} onClick={onNavigate}>
              <div
                className={className}
                style={{ ...vibeSyncStyle, padding: '0.5rem 2rem' }}
                id="eff-btn-vibe-status"
              >
                {item.title.toUpperCase()}_ACTIVE
              </div>
            </Link>
          )}
        />
      </div>
    </header>
  );
};

interface StageLineupCardProps {
  title: string;
  location: string;
  date: string;
  image: string;
}

export const StageLineupCard = ({ title, location, date, image }: StageLineupCardProps) => (
  <div className="eff-stage-card">
    <img src={image} alt={title} className="eff-img" />
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4rem', background: 'linear-gradient(to top, #000 0%, transparent 100%)' }} className="eff-card-content">
        <div className="eff-mono" style={{ marginBottom: '1.5rem', color: 'var(--eff-magenta)' }}>{date} {'//'} {location.toUpperCase()}</div>
        <h3 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, letterSpacing: '-2px', color: 'white' }}>{title}</h3>
        
        <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem', alignItems: 'center' }} className="eff-card-action">
            <div style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '2px', color: 'white' }} className="eff-action-text">SECURE_PASS -&gt;</div>
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

export const NexusFooter = () => {
    const brandLabel = useThemeContent('footer.brand_label', 'NEON');
    const footerDescription = useThemeContent(
      'footer.description',
      "The world's most immersive distribution node for high-vibe environments. Synchronizing collective pulses with global neon nodes."
    );
    const footerCopyright = useThemeContent('footer.copyright', '(c) 2026 SELLIO_NEON_NODE // VIBE_STABLE');

    return (
        <footer className="eff-footer">
            <div className="eff-footer-grid">
                <div>
                    <div className="eff-logo" style={{ fontSize: '3.5rem', marginBottom: '3.5rem' }}>{brandLabel}</div>
                    <p style={{ color: 'var(--eff-grey)', lineHeight: 2, fontSize: '1.1rem', maxWidth: '400px' }}>
                        {footerDescription}
                    </p>
                </div>
                <FooterMenuColumn
                  location="footer_column_1"
                  renderTitle={(title) => (
                    <div className="eff-mono" style={{ color: 'var(--eff-magenta)', marginBottom: '3.5rem' }}>{title}</div>
                  )}
                  listClassName="eff-footer-link-group"
                  linkClassName="eff-footer-link"
                />
                <FooterMenuColumn
                  location="footer_column_2"
                  renderTitle={(title) => (
                    <div className="eff-mono" style={{ color: 'var(--eff-magenta)', marginBottom: '3.5rem' }}>{title}</div>
                  )}
                  listClassName="eff-footer-link-group"
                  linkClassName="eff-footer-link"
                />
                <FooterMenuColumn
                  location="footer_column_3"
                  renderTitle={(title) => (
                    <div className="eff-mono" style={{ color: 'var(--eff-magenta)', marginBottom: '3.5rem' }}>{title}</div>
                  )}
                  listClassName="eff-footer-link-group"
                  linkClassName="eff-footer-link"
                />
            </div>
            <div className="eff-footer-bottom">
                <div className="eff-mono" style={{ opacity: 0.2, fontSize: '0.65rem', color: 'white' }}>{footerCopyright}</div>
                <MenuNav
                  location="social_footer"
                  flat
                  className="eff-footer-socials"
                  linkClassName="eff-mono"
                  renderItem={(item, { href, className, onNavigate }) => (
                    <span className={className} style={{ opacity: 0.2, fontSize: '0.65rem', cursor: 'pointer', color: 'white' }}>
                      <a href={href} onClick={onNavigate} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
                    </span>
                  )}
                />
            </div>
        </footer>
    );
};
