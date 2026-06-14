'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';

export const RunwayHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const themeLink = useEcommerceThemeLink();
  const brandLabel = useThemeContent('header.brand_label', 'ATELIERRunway');
  const seasonLabel = useThemeContent('header.season_label', 'AUTUMN / WINTER 26');
  const runwayIndex = brandLabel.toLowerCase().indexOf('runway');
  const brandPrimary = runwayIndex >= 0 ? brandLabel.slice(0, runwayIndex) : brandLabel;
  const brandSecondary = runwayIndex >= 0 ? brandLabel.slice(runwayIndex) : '';

  return (
    <header className="ef-header">
      <a className="ef-logo" href={themeLink('/')}>
        {brandPrimary}<span style={{ fontWeight: 400, fontStyle: 'italic' }}>{brandSecondary}</span>
      </a>
      
      <button 
        className={`ef-hamburger ${isOpen ? 'ef-hamburger-open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        id="ef-hamburger-toggle"
      >
        <span className="ef-hamburger-bar"></span>
        <span className="ef-hamburger-bar"></span>
        <span className="ef-hamburger-bar"></span>
      </button>

      <div className={`ef-nav-panel ${isOpen ? 'ef-nav-open' : ''}`}>
        <MenuNav
          location="main_header"
          flat
          className="ef-nav"
          linkClassName="ef-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={defaultNavItemRenderer}
        />
        <div className="ef-mono ef-mobile-header-meta" style={{ fontSize: '0.6rem', border: '1px solid var(--ef-ebony)', padding: '0.5rem 1.5rem', marginTop: '2rem' }}>
          {seasonLabel}
        </div>
      </div>

      <div className="ef-mono ef-desktop-header-meta" style={{ fontSize: '0.6rem', border: '1px solid var(--ef-ebony)', padding: '0.5rem 1.5rem' }}>
        {seasonLabel}
      </div>
    </header>
  );
};

interface EditorialLookCardProps {
  name: string;
  price: string | number;
  image: string;
  lookNumber?: string;
  onClick?: () => void;
}

export const EditorialLookCard = ({ name, price, image, lookNumber = "LOOK_07", onClick }: EditorialLookCardProps) => (
  <div className="ef-look-card" onClick={onClick}>
    <div className="ef-img-frame">
      <img src={image} alt={name} className="ef-img" />
      <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', background: 'white', padding: '0.5rem 1rem', fontWeight: 900, fontSize: '0.65rem', letterSpacing: '2px' }}>
        {lookNumber}
      </div>
    </div>
    <div style={{ textAlign: 'center' }}>
        <div className="ef-mono" style={{ marginBottom: '1rem', fontSize: '0.55rem', opacity: 0.4 }}>Ready to Wear</div>
        <h3 style={{ fontFamily: 'var(--ef-serif)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>{name}</h3>
        <div style={{ fontSize: '0.9rem', color: 'var(--ef-champagne)', fontWeight: 700 }}>{price}</div>
    </div>
  </div>
);

export const TrendHUD = ({ label, value }: { label: string, value: string }) => (
    <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', fontFamily: 'var(--ef-serif)', fontWeight: 900, marginBottom: '0.5rem' }}>{value}</div>
        <div className="ef-mono" style={{ fontSize: '0.6rem', opacity: 0.4 }}>{label}</div>
    </div>
);

export const AtelierFooter = () => {
    const themeLink = useEcommerceThemeLink();
    const brandLabel = useThemeContent('footer.brand_label', 'ATELIER');
    const footerDescription = useThemeContent(
        'footer.description',
        'We do not build garments. We architect confidence through the precision of silhouette and the purity of material.',
    );

    return (
    <footer className="ef-footer">
        <a className="ef-logo" href={themeLink('/')} style={{ fontSize: '4rem', marginBottom: '6rem', display: 'block', textDecoration: 'none' }}>{brandLabel}</a>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'left' }}>
            <div>
                <div className="ef-mono" style={{ color: 'var(--ef-champagne)', marginBottom: '3.5rem' }}>PHILOSOPHY</div>
                <p style={{ opacity: 0.3, lineHeight: 2, fontSize: '0.9rem' }}>
                    {footerDescription}
                </p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                renderTitle={(title) => (
                    <div className="ef-mono" style={{ color: 'var(--ef-champagne)', marginBottom: '3.5rem' }}>{title}</div>
                )}
                linkClassName=""
            />
            <FooterMenuColumn
                location="footer_column_2"
                renderTitle={(title) => (
                    <div className="ef-mono" style={{ color: 'var(--ef-champagne)', marginBottom: '3.5rem' }}>{title}</div>
                )}
            />
            <FooterMenuColumn
                location="footer_column_3"
                renderTitle={(title) => (
                    <div className="ef-mono" style={{ color: 'var(--ef-champagne)', marginBottom: '3.5rem' }}>{title}</div>
                )}
            />
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="ef-mono" style={{ opacity: 0.2, fontSize: '0.6rem' }}>© 2026 Sellio Atelier. All rights reserved.</div>
            <MenuNav
                location="social_footer"
                flat
                style={{ display: 'flex', gap: '5rem' }}
                linkClassName="ef-mono"
                renderItem={(item, { href, className, onNavigate }) => (
                    <a href={href} className={className} style={{ opacity: 0.2, fontSize: '0.6rem' }} onClick={onNavigate}>
                        {item.title}
                    </a>
                )}
            />
        </div>
    </footer>
    );
};
