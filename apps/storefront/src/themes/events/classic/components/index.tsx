'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

const patronPortalStyle = {
  fontSize: '0.65rem',
  border: '1px solid var(--ecl-burgundy)',
  color: 'var(--ecl-burgundy)',
  cursor: 'pointer',
} as const;

export const VenueHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const brandLabel = useThemeContent('header.brand_label', 'LEGACYArts');
  const brandPrimary = brandLabel.slice(0, Math.ceil(brandLabel.length / 2));
  const brandSecondary = brandLabel.slice(Math.ceil(brandLabel.length / 2));

  return (
    <header className="ecl-header">
      <div className="ecl-logo">
        {brandPrimary}<span style={{ color: 'var(--ecl-gold)', fontWeight: 400, fontStyle: 'italic' }}>{brandSecondary}</span>
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

      <MenuNav
        location="main_header"
        flat
        className={`ecl-nav ${isOpen ? 'ecl-nav-open' : ''}`}
        linkClassName="ecl-nav-link"
        onNavigate={() => setIsOpen(false)}
        renderItem={defaultNavItemRenderer}
      />

      <MenuActionButtons
        location="action_buttons"
        className="ecl-mono ecl-mobile-btn"
        buttonClassName="ecl-mono ecl-mobile-btn"
        as="button"
        onNavigate={() => setIsOpen(false)}
        renderItem={(item, { className, onNavigate }) => (
          <div
            className={className}
            style={{ ...patronPortalStyle, padding: '1rem 2rem', textAlign: 'center', marginTop: '2rem', width: '100%' }}
            onClick={() => {
              alert('Patron Portal synchronized.');
              onNavigate?.();
            }}
            id="ecl-btn-patron-portal-mobile"
          >
            {item.title.toUpperCase()} ACTIVE
          </div>
        )}
      />

      <MenuActionButtons
        location="action_buttons"
        className="ecl-mono ecl-desktop-btn"
        buttonClassName="ecl-mono ecl-desktop-btn"
        as="button"
        renderItem={(item, { className, onNavigate }) => (
          <div
            className={className}
            style={{ ...patronPortalStyle, padding: '0.5rem 2rem' }}
            onClick={() => {
              alert('Patron Portal synchronized.');
              onNavigate?.();
            }}
            id="ecl-btn-patron-portal"
          >
            {item.title.toUpperCase()} ACTIVE
          </div>
        )}
      />
    </header>
  );
};

interface OccasionCardProps {
  title: string;
  location: string;
  date: string;
  category: string;
}

export const OccasionCard = ({ title, location, date, category }: OccasionCardProps) => (
  <div className="ecl-occasion-card" onClick={() => alert(`RSVP requested for: ${title}`)}>
    <div className="ecl-mono" style={{ marginBottom: '2.5rem' }}>{date}{' // '}{category.toUpperCase()}</div>
    <h3 style={{ fontFamily: 'var(--ecl-serif)', fontSize: '2.25rem', fontWeight: 900, marginBottom: '2rem', lineHeight: 1.1, color: 'var(--ecl-burgundy)' }}>{title}</h3>
    <div style={{ fontStyle: 'italic', color: 'var(--ecl-gold)', fontSize: '1.1rem', marginBottom: '3.5rem', fontFamily: 'var(--ecl-serif)' }}>{location}</div>
    
    <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--ecl-stone)', paddingTop: '2.5rem' }} className="ecl-rsvp-arrow">
        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--ecl-burgundy)', letterSpacing: '3px' }}>REQUEST PATRON PASS -&gt;</div>
    </div>
  </div>
);

export const BookingHUD = ({ label, value }: { label: string, value: string }) => (
    <div className="ecl-hud-block">
        <div style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontFamily: 'var(--ecl-serif)', fontWeight: 900, color: 'var(--ecl-burgundy)', marginBottom: '0.5rem' }}>{value}</div>
        <div className="ecl-mono" style={{ opacity: 0.4, fontSize: '0.6rem' }}>{label}</div>
    </div>
);

export const LegacyFooter = () => {
    const brandLabel = useThemeContent('header.brand_label', 'LEGACYArts');
    const footerBrand = useThemeContent('footer.brand_label', brandLabel);
    const footerDescription = useThemeContent(
      'footer.description',
      "The world's most significant archive of cultural repertoire. Synchronizing institutional archives with global patron nodes."
    );
    const footerCopyright = useThemeContent('footer.copyright', '(c) 2026 SELLIO_LEGACY_ARTS // ARCHIVE_STABLE');

    return (
        <footer className="ecl-footer">
            <div className="ecl-footer-grid">
                <div>
                    <div className="ecl-logo" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '3rem' }}>{footerBrand}</div>
                    <p style={{ opacity: 0.3, lineHeight: 2, fontSize: '1rem', maxWidth: '400px', color: 'white' }}>
                        {footerDescription}
                    </p>
                </div>
                <FooterMenuColumn
                  location="footer_column_1"
                  renderTitle={(title) => (
                    <div className="ecl-mono" style={{ color: 'var(--ecl-gold)', marginBottom: '3.5rem' }}>{title}</div>
                  )}
                  listClassName="ecl-footer-link-group"
                  linkClassName="ecl-footer-link"
                />
                <FooterMenuColumn
                  location="footer_column_2"
                  renderTitle={(title) => (
                    <div className="ecl-mono" style={{ color: 'var(--ecl-gold)', marginBottom: '3.5rem' }}>{title}</div>
                  )}
                  listClassName="ecl-footer-link-group"
                  linkClassName="ecl-footer-link"
                />
                <FooterMenuColumn
                  location="footer_column_3"
                  renderTitle={(title) => (
                    <div className="ecl-mono" style={{ color: 'var(--ecl-gold)', marginBottom: '3.5rem' }}>{title}</div>
                  )}
                  listClassName="ecl-footer-link-group"
                  linkClassName="ecl-footer-link"
                />
            </div>
            <div className="ecl-footer-bottom">
                <div className="ecl-mono" style={{ opacity: 0.2, fontSize: '0.65rem', color: 'white' }}>{footerCopyright}</div>
                <MenuNav
                  location="social_footer"
                  flat
                  className="ecl-footer-socials"
                  linkClassName="ecl-mono"
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
