'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';

export const LegacyHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="uc-header">
      <div className="uc-logo">
        THE<span style={{ color: 'var(--uc-gold)' }}>LEGACY</span>NODE
      </div>
      
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
        { num: "01", title: "Institutional Legacy", description: "A high-fidelity foundation established through decades of multi-vertical distribution excellence." },
        { num: "02", title: "Verifiable Provenance", description: "Every asset in the legacy registry is verified for its historical integrity and functional legacy." },
        { num: "03", title: "Global Authority", description: "Synchronizing global commerce nodes through the world's most trusted structural protocol." },
    ];

    return (
        <section className="uc-heritage-grid" id="uc-heritage-registry">
            <div style={{ textAlign: 'center', marginBottom: '8rem' }} className="uc-grid-header">
                <span className="uc-mono" style={{ color: 'var(--uc-gold)' }}>ESTABLISHED_1996</span>
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
        <span>★ CORE LEGACY HANDSHAKE PROTOCOL ENFORCED // SECURE STABLE</span>
        <span className="uc-chronicle-separator">{'//'}</span>
        <span>PROVENANCE TRUST METRIC: 100% SECURE INTEGRATION</span>
        <span className="uc-chronicle-separator">{'//'}</span>
        <span>VERIFIABLE ARCHIVE STABILITY: v8.4.1</span>
    </div>
);

export const AncestralFooter = () => (
    <footer className="uc-ancestral-footer">
        <div className="uc-footer-grid">
            <div>
                <div className="uc-logo" style={{ color: 'white', fontSize: '2.2rem', marginBottom: '3rem' }}>THELEGACYNODE</div>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px' }}>
                    A high-fidelity foundational registry for global commerce. Blending traditional authority with modern secure protocols.
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
            <div className="uc-mono" style={{ opacity: 0.4, fontSize: '0.65rem' }}>© 2026 SELLIO_LEGACY_OS // HORIZON_SYNC_STABLE</div>
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
