'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

export const LegacyHeader = () => {
  const themeLink = useUnifiedThemeLink();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="uc-header">
      <a href={themeLink('/')} className="uc-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
        THE<span style={{ color: 'var(--uc-gold)' }}>LEGACY</span>NODE
      </a>
      
      <button 
          className={`uc-hamburger ${isOpen ? 'uc-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="uc-hamburger-toggle"
      >
          <span className="uc-hamburger-bar"></span>
          <span className="uc-hamburger-bar"></span>
          <span className="uc-hamburger-bar"></span>
      </button>

      <div className={`uc-nav-panel ${isOpen ? 'uc-nav-open' : ''}`}>
          <MenuNav
            location="main_header"
            flat
            className="uc-nav"
            linkClassName="uc-nav-link"
            onNavigate={() => setIsOpen(false)}
            renderItem={defaultNavItemRenderer}
          />
          <MenuActionButtons
            as="button"
            buttonClassName="uc-btn-primary uc-mobile-btn"
            onNavigate={() => setIsOpen(false)}
            renderItem={(item, { className, onNavigate }) => (
              <button type="button" className={className} style={{ padding: '1rem 3rem', fontSize: '0.8rem', marginTop: '2rem', width: '100%' }} onClick={onNavigate}>{item.title}</button>
            )}
          />
      </div>

      <MenuActionButtons
        as="button"
        buttonClassName="uc-btn-primary uc-desktop-btn"
        renderItem={(item, { className, onNavigate }) => (
          <button type="button" className={className} style={{ padding: '0.8rem 2rem', fontSize: '0.75rem' }} onClick={onNavigate} id="uc-btn-header-access">{item.title}</button>
        )}
      />
    </header>
  );
};

interface HeritageCardProps {
    num: string;
    title: string;
    description: string;
}

const HeritageCard = ({ num, title, description }: HeritageCardProps) => (
    <div className="uc-legacy-card" >
        <span className="uc-card-num">{num}</span>
        <h3 style={{ fontFamily: 'var(--uc-font-heading)', fontSize: '2rem', fontWeight: 900, color: 'var(--uc-burgundy)', marginBottom: '2rem' }}>{title}</h3>
        <p style={{ color: '#666', lineHeight: 2, fontSize: '1rem' }}>{description}</p>
    </div>
);

export const HeritageGrid = () => {
    const records = [
        { num: "01", title: "Trusted Foundation", description: "A marketplace built through decades of multi-vertical commerce experience and proven reliability." },
        { num: "02", title: "Verified Listings", description: "Every product in this catalog is verified for accuracy, quality, and seller legitimacy." },
        { num: "03", title: "Global Reach", description: "Serving buyers and sellers worldwide through a trusted, consistently reliable marketplace platform." },
    ];

    return (
        <section className="uc-heritage-grid" id="uc-heritage-registry">
            <div style={{ textAlign: 'center', marginBottom: '8rem' }} className="uc-grid-header">
                <span className="uc-mono" style={{ color: 'var(--uc-gold)' }}>Established 1996</span>
                <h2 style={{ fontFamily: 'var(--uc-font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, color: 'var(--uc-burgundy)', marginTop: '2rem' }}>The Registry of <br/>Excellence.</h2>
            </div>
            <div className="uc-heritage-grid-container">
                {records.map((r, i) => <HeritageCard key={i} {...r} />)}
            </div>
        </section>
    );
};

export const ChronicleBar = () => (
    <div className="uc-chronicle-bar">
        <span>★ PLATFORM STATUS: ONLINE // SECURE &amp; STABLE</span>
        <span className="uc-chronicle-separator">{'//'}</span>
        <span>VERIFIED LISTINGS: 100% QUALITY CHECKED</span>
        <span className="uc-chronicle-separator">{'//'}</span>
        <span>FAST LOAD TIMES &lt;8ms RESPONSE</span>
    </div>
);

export const AncestralFooter = () => {
    const themeLink = useUnifiedThemeLink();
    return (
    <footer className="uc-ancestral-footer">
        <div className="uc-footer-grid">
            <div>
                <a href={themeLink('/')} className="uc-logo" style={{ color: 'white', fontSize: '2.2rem', marginBottom: '3rem', textDecoration: 'none' }}>THELEGACYNODE</a>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px' }}>
                    A trusted multi-category marketplace platform built on decades of commerce experience and global reliability.
                </p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                renderTitle={(title) => <div className="uc-mono" style={{ color: 'var(--uc-gold)', marginBottom: '3rem' }}>{title}</div>}
                listClassName="uc-footer-link-group"
                linkClassName="uc-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                renderTitle={(title) => <div className="uc-mono" style={{ color: 'var(--uc-gold)', marginBottom: '3rem' }}>{title}</div>}
                listClassName="uc-footer-link-group"
                linkClassName="uc-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_3"
                renderTitle={(title) => <div className="uc-mono" style={{ color: 'var(--uc-gold)', marginBottom: '3rem' }}>{title}</div>}
                listClassName="uc-footer-link-group"
                linkClassName="uc-footer-link"
            />
        </div>
        <div className="uc-footer-bottom">
            <div className="uc-mono" style={{ opacity: 0.4, fontSize: '0.65rem' }}>© 2026 Sellio. All rights reserved.</div>
            <div className="uc-footer-socials">
                <MenuNav
                    location="social_footer"
                    flat
                    linkClassName="uc-mono"
                    renderItem={(item, { href, className, onNavigate }) => (
                        <span className={className} style={{ opacity: 0.4, fontSize: '0.65rem', cursor: 'pointer' }}>
                            <a href={href} onClick={onNavigate} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
                        </span>
                    )}
                />
            </div>
        </div>
    </footer>
    );
};
