'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';

export const ScaleHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="usp-header">
      <div className="usp-logo">
        SCALE<span>PROTOCOL</span>
      </div>
      
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

      <nav className={`usp-nav ${isOpen ? 'usp-nav-open' : ''}`}>
          <MenuNav
            location="main_header"
            flat
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
      </nav>

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
    <div className="usp-grid-item" onClick={() => alert(`Reviewing Layer: ${tag}`)}>
        <span className="usp-mono" style={{ color: 'var(--usp-gray)', marginBottom: '1.5rem', display: 'block' }}>{tag}</span>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--usp-navy)' }}>{title}</h3>
        <p style={{ color: 'var(--usp-gray)', fontSize: '0.9rem', lineHeight: 1.7 }}>{description}</p>
    </div>
);

export const ProtocolGrid = () => {
    const protocols = [
        { tag: "DATA_LAYER", title: "Standardized Mapping", description: "Universal schema translation across all 50 vertical storefronts." },
        { tag: "SYNC_ENGINE", title: "Atomic Distribution", description: "Real-time asset synchronization with institutional-grade redundancy." },
        { tag: "UI_PROTOCOL", title: "Geometric Precision", description: "High-fidelity modular components optimized for multi-vertical scale." },
        { tag: "NODE_LOGIC", title: "Isolated Resilience", description: "Sovereign architectural silos ensuring zero-dependency performance." },
        { tag: "AUTH_LAYER", title: "Institutional Security", description: "AES-256 encrypted distribution nodes for verified asset handling." },
        { tag: "CORE_API", title: "Unified Endpoint", description: "A single, robust entry point for global high-fidelity commerce." },
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
        <span>★ PROFESSIONAL STANDARDIZATION // 100% RELIABILITY RATING ACTIVATED</span>
        <span className="usp-bar-separator">//</span>
        <span>LATENCY TARGET: &lt;6ms SYNC PIPELINES</span>
        <span className="usp-bar-separator">//</span>
        <span>SECURE HIGH CAPACITY SCALE ENGINE</span>
    </div>
);

export const StandardFooter = () => (
    <footer className="usp-footer">
        <div className="usp-footer-grid">
            <div>
                <div className="usp-logo" style={{ fontSize: '1.5rem', marginBottom: '3rem' }}>SCALEPROTOCOL</div>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px', color: 'var(--usp-gray)' }}>
                    The advanced heavyweight standard distribution node. Engineered for real-time professional multi-category operations.
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
            <div className="usp-mono" style={{ opacity: 0.4, fontSize: '0.65rem' }}>© 2026 SELLIO_SCALEPROTOCOL_OS // STANDARDS_ACTIVE</div>
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
