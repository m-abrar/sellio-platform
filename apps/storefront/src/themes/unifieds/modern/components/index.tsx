'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';

export const NexusHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="unp-header">
      <div className="unp-logo">
        NEXUS<span>PRIME</span>
      </div>
      
      <button 
          className={`unp-hamburger ${isOpen ? 'unp-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="unp-hamburger-toggle"
      >
          <span className="unp-hamburger-bar"></span>
          <span className="unp-hamburger-bar"></span>
          <span className="unp-hamburger-bar"></span>
      </button>

      <div className={`unp-nav-panel ${isOpen ? 'unp-nav-open' : ''}`}>
          <MenuNav
            location="main_header"
            flat
            className="unp-nav"
            linkClassName="unp-nav-link"
            onNavigate={() => setIsOpen(false)}
            renderItem={defaultNavItemRenderer}
          />
          <MenuActionButtons
            as="button"
            buttonClassName="unp-btn-primary unp-mobile-btn"
            onNavigate={() => setIsOpen(false)}
            renderItem={(item, { className, onNavigate }) => (
              <button type="button" className={className} style={{ padding: '1rem 3rem', fontSize: '0.8rem', marginTop: '2rem', width: '100%', borderRadius: '12px' }} onClick={onNavigate}>{item.title}</button>
            )}
          />
      </div>

      <MenuActionButtons
        as="button"
        buttonClassName="unp-btn-primary unp-desktop-btn"
        renderItem={(item, { className, onNavigate }) => (
          <button type="button" className={className} style={{ padding: '0.8rem 2rem', fontSize: '0.75rem', borderRadius: '12px' }} onClick={onNavigate} id="unp-btn-header-access">{item.title}</button>
        )}
      />
    </header>
  );
};

export const NexusBentoGrid = () => (
    <section className="unp-bento-section">
        <div className="unp-bento-grid">
            <div className="unp-bento-item unp-bento-main glass-panel" style={{ padding: '4rem' }}>
                <span className="unp-mono" style={{ color: 'var(--unp-cyan)', fontWeight: 700 }}>CORE_ENGINE</span>
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, marginTop: '1rem', marginBottom: '2rem', fontFamily: 'var(--unp-font-nexus)', color: 'white', lineHeight: 1.1 }}>Unified Data <br/>Architecture.</h2>
                <p style={{ color: 'var(--unp-dim)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '500px' }}>
                    One core engine powering 50+ vertical-specific storefronts. Standardize your distribution logic across any industry with high-fidelity performance.
                </p>
            </div>
            <div className="unp-bento-item unp-bento-side-top glass-panel" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--unp-cyan)', fontFamily: 'var(--unp-font-nexus)' }}>1.2M</div>
                <p style={{ color: 'var(--unp-dim)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Real-time transactions per node.</p>
            </div>
            <div className="unp-bento-item unp-bento-side-bottom glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }} className="unp-pulse-group">
                    {[1,2,3,4].map(i => <div key={i} style={{ width: '12px', height: '12px', background: 'var(--unp-cyan)', borderRadius: '50%' }} className="unp-pulse-sphere"></div>)}
                </div>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'white', lineHeight: 1.2 }}>High-Fidelity <br/>Sync Active.</p>
            </div>
        </div>
    </section>
);

export const NexusPricing = () => {
    const plans = [
        { name: "Starter Node", price: "$49", features: ["1 Storefront License", "Core Schema Mapping", "8ms Latency Target", "Standard Support"] },
        { name: "Nexus Pro", price: "$149", features: ["10 Storefront Licenses", "Advanced Schema DNA", "1ms Custom Pipelines", "Priority Support"], featured: true },
        { name: "Enterprise Hub", price: "$499", features: ["Unlimited Licenses", "Dedicated Hardware Node", "Sovereign Sub-Second Sync", "24/7 Nodal Operations"] }
    ];

    return (
        <section className="unp-pricing" id="unp-exchange-section">
            <span className="unp-mono" style={{ color: 'var(--unp-cyan)' }}>NODAL_SUBSCRIPTION</span>
            <h2 style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 700, fontFamily: 'var(--unp-font-nexus)', color: 'white', marginTop: '2rem', marginBottom: '1.5rem', letterSpacing: '-2px' }}>Siloed Capacity Plans.</h2>
            <p style={{ color: 'var(--unp-dim)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 5rem' }}>
                Scalable distribution subscriptions built for modern enterprise operations. Zero setup overhead.
            </p>
            <div className="unp-pricing-grid">
                {plans.map((plan, i) => (
                    <div key={i} className={`unp-price-card glass-panel ${plan.featured ? 'unp-featured-card' : ''}`} style={{ padding: '3rem', textAlign: 'left' }}>
                        <div className="unp-mono" style={{ color: plan.featured ? 'var(--unp-cyan)' : 'var(--unp-dim)', marginBottom: '1.5rem' }}>{plan.name}</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '2.5rem' }}>
                            <span style={{ fontSize: '3.5rem', fontWeight: 700, color: 'white', fontFamily: 'var(--unp-font-nexus)' }}>{plan.price}</span>
                            <span style={{ color: 'var(--unp-dim)', fontSize: '0.9rem' }}>/month</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3.5rem' }} className="unp-plan-features">
                            {plan.features.map((feat, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--unp-text)', fontSize: '0.9rem' }}>
                                    <div style={{ width: '6px', height: '6px', background: 'var(--unp-cyan)', borderRadius: '50%' }}></div>
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>
                        <button className="unp-btn-primary" style={{ width: '100%', borderRadius: '12px', background: plan.featured ? 'var(--unp-cyan)' : 'transparent', border: plan.featured ? 'none' : '1px solid var(--unp-border)', color: plan.featured ? 'var(--unp-bg)' : 'white' }} >
                            ACTIVATE NODE
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export const NexusFooter = () => (
    <footer className="unp-footer">
        <div className="unp-footer-grid">
            <div>
                <div className="unp-logo" style={{ fontSize: '1.5rem', marginBottom: '3rem' }}>NEXUSPRIME</div>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px', color: 'var(--unp-dim)' }}>
                    The advanced heavyweight app-like distribution node. Engineered for real-time high-fidelity multi-category scaling operations.
                </p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                renderTitle={(title) => <div className="unp-mono" style={{ color: 'white', marginBottom: '3rem', fontWeight: 700 }}>{title}</div>}
                listClassName="unp-footer-link-group"
                linkClassName="unp-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                renderTitle={(title) => <div className="unp-mono" style={{ color: 'white', marginBottom: '3rem', fontWeight: 700 }}>{title}</div>}
                listClassName="unp-footer-link-group"
                linkClassName="unp-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_3"
                renderTitle={(title) => <div className="unp-mono" style={{ color: 'white', marginBottom: '3rem', fontWeight: 700 }}>{title}</div>}
                listClassName="unp-footer-link-group"
                linkClassName="unp-footer-link"
            />
        </div>
        <div className="unp-footer-bottom">
            <div className="unp-mono" style={{ opacity: 0.4, fontSize: '0.65rem' }}>© 2026 SELLIO_NEXUSPRIME_OS // CORE_ACTIVE</div>
            <div className="unp-footer-socials">
                <MenuNav
                    location="social_footer"
                    flat
                    linkClassName="unp-mono"
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
