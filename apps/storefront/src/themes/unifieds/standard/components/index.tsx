'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

export const ScaleHeader = () => {
  const themeLink = useUnifiedThemeLink();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="usp-header">
      <a href={themeLink('/')} className="usp-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
        SCALE<span>PROTOCOL</span>
      </a>
      
      <button 
          className={`usp-hamburger ${isOpen ? 'usp-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="usp-hamburger-toggle"
      >
          <span className="usp-hamburger-bar"></span>
          <span className="usp-hamburger-bar"></span>
          <span className="usp-hamburger-bar"></span>
      </button>

      <div className={`usp-nav-panel ${isOpen ? 'usp-nav-open' : ''}`}>
          <MenuNav
            location="main_header"
            flat
            className="usp-nav"
            linkClassName="usp-nav-link"
            onNavigate={() => setIsOpen(false)}
            renderItem={defaultNavItemRenderer}
          />
          <MenuActionButtons
            as="button"
            buttonClassName="usp-btn-primary usp-mobile-btn"
            onNavigate={() => setIsOpen(false)}
            renderItem={(item, { className, onNavigate }) => (
              <button type="button" className={className} style={{ padding: '1rem 3rem', fontSize: '0.8rem', marginTop: '2rem', width: '100%', borderRadius: '6px' }} onClick={onNavigate}>{item.title}</button>
            )}
          />
      </div>

      <MenuActionButtons
        as="button"
        buttonClassName="usp-btn-primary usp-desktop-btn"
        renderItem={(item, { className, onNavigate }) => (
          <button type="button" className={className} style={{ padding: '0.8rem 2rem', fontSize: '0.75rem', borderRadius: '6px' }} onClick={onNavigate} id="usp-btn-header-access">{item.title}</button>
        )}
      />
    </header>
  );
};

interface ProtocolCardProps {
    tag: string;
    title: string;
    description: string;
}

const ProtocolCard = ({ tag, title, description }: ProtocolCardProps) => (
    <div className="usp-grid-item" >
        <span className="usp-mono" style={{ color: 'var(--usp-gray)', marginBottom: '1.5rem', display: 'block' }}>{tag}</span>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--usp-navy)' }}>{title}</h3>
        <p style={{ color: 'var(--usp-gray)', fontSize: '0.9rem', lineHeight: 1.7 }}>{description}</p>
    </div>
);

export const ProtocolGrid = () => {
    const protocols = [
        { tag: "Data Layer", title: "Standardized Data", description: "Universal schema across all 50 marketplace verticals for clean, consistent listings." },
        { tag: "Sync Engine", title: "Real-Time Updates", description: "Product records update in real time so buyers always see the latest inventory." },
        { tag: "UI Design", title: "Modular Components", description: "Clean, responsive components optimized for multi-vertical marketplace scale." },
        { tag: "Performance", title: "Reliable Uptime", description: "Isolated architecture ensures fast, stable performance under any traffic volume." },
        { tag: "Security", title: "Secure Transactions", description: "AES-256 encryption and verified seller handling for every transaction." },
        { tag: "API", title: "Unified Endpoint", description: "A single, robust API entry point for all marketplace categories." },
    ];

    return (
        <section className="usp-protocol-grid" id="usp-exchange-section">
            <div className="usp-grid">
                {protocols.map((p, i) => <ProtocolCard key={i} {...p} />)}
            </div>
        </section>
    );
};

export const EfficiencyBar = () => (
    <div className="usp-efficiency-bar">
        <span>★ PLATFORM STATUS: ONLINE // 100% RELIABILITY</span>
        <span className="usp-bar-separator">//</span>
        <span>FAST RESPONSE &lt;6ms AVERAGE</span>
        <span className="usp-bar-separator">//</span>
        <span>SECURE HIGH-CAPACITY MARKETPLACE</span>
    </div>
);

export const StandardFooter = () => {
  const themeLink = useUnifiedThemeLink();
  return (
    <footer className="usp-footer">
        <div className="usp-footer-grid">
            <div>
                <a href={themeLink('/')} className="usp-logo" style={{ fontSize: '1.5rem', marginBottom: '3rem', textDecoration: 'none', color: 'inherit' }}>SCALEPROTOCOL</a>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px', color: 'var(--usp-gray)' }}>
                    A professional multi-category marketplace platform built for real-time listing delivery and reliable seller operations.
                </p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                renderTitle={(title) => <div className="usp-mono" style={{ color: 'var(--usp-navy)', marginBottom: '3rem', fontWeight: 700 }}>{title}</div>}
                listClassName="usp-footer-link-group"
                linkClassName="usp-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                renderTitle={(title) => <div className="usp-mono" style={{ color: 'var(--usp-navy)', marginBottom: '3rem', fontWeight: 700 }}>{title}</div>}
                listClassName="usp-footer-link-group"
                linkClassName="usp-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_3"
                renderTitle={(title) => <div className="usp-mono" style={{ color: 'var(--usp-navy)', marginBottom: '3rem', fontWeight: 700 }}>{title}</div>}
                listClassName="usp-footer-link-group"
                linkClassName="usp-footer-link"
            />
        </div>
        <div className="usp-footer-bottom">
            <div className="usp-mono" style={{ opacity: 0.4, fontSize: '0.65rem' }}>© 2026 Sellio. All rights reserved.</div>
            <div className="usp-footer-socials">
                <MenuNav
                    location="social_footer"
                    flat
                    linkClassName="usp-mono"
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
