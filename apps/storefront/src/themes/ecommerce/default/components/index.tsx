'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuUtilityNav } from '@/components/menu/MenuUtilityNav';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

export const ShopHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const brandLabel = useThemeContent('header.brand_label', 'SELLIOShop');
  const brandHighlight = useThemeContent('header.brand_highlight', 'Shop');
  const brandPrefix = brandLabel.endsWith(brandHighlight) ? brandLabel.slice(0, -brandHighlight.length) : brandLabel;

  return (
    <header className="ed-header">
      <div className="ed-logo">
        {brandPrefix}<span style={{ color: 'var(--ed-blue)' }}>{brandHighlight}</span>
      </div>
      
      <button 
        className={`ed-hamburger ${isOpen ? 'ed-hamburger-open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        id="ed-hamburger-toggle"
      >
        <span className="ed-hamburger-bar"></span>
        <span className="ed-hamburger-bar"></span>
        <span className="ed-hamburger-bar"></span>
      </button>

      <div className={`ed-nav-panel ${isOpen ? 'ed-nav-open' : ''}`}>
        <MenuNav
          location="main_header"
          flat
          className="ed-nav"
          linkClassName="ed-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={defaultNavItemRenderer}
        />
        <MenuUtilityNav
          className="ed-mono ed-mobile-header-meta"
          onNavigate={() => setIsOpen(false)}
        />
      </div>

      <MenuUtilityNav
        className="ed-mono ed-desktop-header-meta"
      />
    </header>
  );
};

type PremiumProductCardProps = {
  name: string;
  price: string;
  category: string;
  image: string;
};

export const PremiumProductCard = ({ name, price, category, image }: PremiumProductCardProps) => (
  <div className="ed-product-card">
    <div className="ed-img-frame">
      <img src={image} alt={name} className="ed-img" />
      <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7v14"/></svg>
      </div>
    </div>
    <div style={{ padding: '0.5rem' }}>
        <div className="ed-mono" style={{ marginBottom: '0.75rem', fontSize: '0.55rem', opacity: 0.5 }}>{category}</div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--ed-slate)' }}>{name}</h3>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ed-blue)' }}>{price}</div>
    </div>
  </div>
);

export const CategoryRibbon = ({ label, count }: { label: string, count: string }) => (
    <div style={{ padding: '2.5rem', background: 'var(--ed-frost)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'var(--ed-transition)' }} className="category-item-hover">
        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{label}</div>
        <div className="ed-mono" style={{ fontSize: '0.65rem', opacity: 0.4 }}>{count} ITEMS</div>
    </div>
);

export const TransactionFooter = () => {
    const brandLabel = useThemeContent('header.brand_label', 'SELLIOShop');
    const footerBrand = useThemeContent('footer.brand_label', 'SELLIO');
    const description = useThemeContent('footer.description', "The world's most advanced transaction protocol for high-fidelity retail. Synchronizing refined essentials with global distribution nodes.");
    const copyright = useThemeContent('footer.copyright', '© 2026 SELLIO_SHOP // TRANSACTION_SYNC_STABLE');

    return (
    <footer className="ed-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="ed-logo" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>{footerBrand || brandLabel}</div>
                <p style={{ color: 'var(--ed-text-muted)', lineHeight: 2, fontSize: '1.1rem', maxWidth: '400px' }}>
                    {description}
                </p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                renderTitle={(title) => (
                    <div className="ed-mono" style={{ marginBottom: '3.5rem' }}>{title}</div>
                )}
                listClassName=""
                linkClassName=""
            />
            <FooterMenuColumn
                location="footer_column_2"
                renderTitle={(title) => (
                    <div className="ed-mono" style={{ marginBottom: '3.5rem' }}>{title}</div>
                )}
            />
            <FooterMenuColumn
                location="footer_column_3"
                renderTitle={(title) => (
                    <div className="ed-mono" style={{ marginBottom: '3.5rem' }}>{title}</div>
                )}
            />
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid var(--ed-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="ed-mono" style={{ color: 'var(--ed-text-muted)', fontSize: '0.65rem' }}>{copyright}</div>
            <MenuNav
                location="social_footer"
                flat
                style={{ display: 'flex', gap: '5rem' }}
                linkClassName="ed-mono"
                renderItem={(item, { href, className, onNavigate }) => (
                    <a href={href} className={className} style={{ color: 'var(--ed-text-muted)', fontSize: '0.65rem' }} onClick={onNavigate}>
                        {item.title}
                    </a>
                )}
            />
        </div>
    </footer>
    );
};
