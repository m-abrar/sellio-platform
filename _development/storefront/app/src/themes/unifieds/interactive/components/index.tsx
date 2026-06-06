'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';

export const MotionHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="ui-header">
      <div className="ui-logo">
        MOTION<span style={{ color: 'var(--ui-yellow)' }}>NODE</span>
      </div>
      
      <button 
          className={`ui-hamburger ${isOpen ? 'ui-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="ui-hamburger-toggle"
      >
          <span className="ui-hamburger-bar"></span>
          <span className="ui-hamburger-bar"></span>
          <span className="ui-hamburger-bar"></span>
      </button>

      <div className={`ui-nav-panel ${isOpen ? 'ui-nav-open' : ''}`}>
          <MenuNav
            location="main_header"
            flat
            className="ui-nav"
            linkClassName="ui-nav-link"
            onNavigate={() => setIsOpen(false)}
            renderItem={defaultNavItemRenderer}
          />
          <MenuActionButtons
            as="button"
            buttonClassName="ui-btn-primary ui-mobile-btn"
            onNavigate={() => setIsOpen(false)}
            renderItem={(item, { className, onNavigate }) => (
              <button type="button" className={className} style={{ padding: '1rem 3rem', fontSize: '0.8rem', marginTop: '2rem', width: '100%' }} onClick={onNavigate}>{item.title}</button>
            )}
          />
      </div>

      <MenuActionButtons
        as="button"
        buttonClassName="ui-btn-primary ui-desktop-btn"
        renderItem={(item, { className, onNavigate }) => (
          <button type="button" className={className} style={{ padding: '0.8rem 2rem', fontSize: '0.75rem' }} onClick={onNavigate} id="ui-btn-header-access">{item.title}</button>
        )}
      />
    </header>
  );
};

export const InteractionCanvas = () => {
  const [activeNode, setActiveNode] = useState(3);

  return (
    <section className="ui-interaction-canvas" id="ui-interactive-canvas-section">
      <div className="ui-canvas-grid">
          <div className="ui-canvas-item ui-item-main" style={{ padding: '5rem' }}>
              <div className="ui-mono" style={{ color: 'var(--ui-yellow)', marginBottom: '2rem' }}>DYNAMIC_SCHEMA_V4</div>
              <h2 style={{ fontFamily: 'var(--ui-font-heading)', fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 800, lineHeight: 0.9, marginBottom: '3rem', color: 'white' }}>Kinetic <br/>Architecture.</h2>
              <p style={{ maxWidth: '600px', fontSize: '1.25rem', color: '#888', lineHeight: 1.8 }}>
                  The Motion Node is a high-fidelity interactive engine designed for multi-vertical distribution. Synchronize your digital assets through fluid logic and kinetic transitions.
              </p>
              <div style={{ marginTop: '5rem', display: 'flex', gap: '4rem', flexWrap: 'wrap' }} className="ui-stats-container">
                  <div>
                      <div style={{ fontSize: '3rem', fontWeight: 800, color: 'white', fontFamily: 'var(--ui-font-heading)' }}>120fps</div>
                      <div className="ui-mono" style={{ color: '#444', fontSize: '0.65rem' }}>FLUID_LATENCY</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '3rem', fontWeight: 800, color: 'white', fontFamily: 'var(--ui-font-heading)' }}>Realtime</div>
                      <div className="ui-mono" style={{ color: '#444', fontSize: '0.65rem' }}>INTERACTION_SYNC</div>
                  </div>
              </div>
          </div>
          
          <div className="ui-canvas-item ui-item-side" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '350px' }}>
              <div className="ui-glowing-pulse"></div>
          </div>
          
          <div className="ui-canvas-item ui-item-side" style={{ padding: '3rem', height: '350px' }} onClick={() => {
              const next = activeNode === 5 ? 1 : activeNode + 1;
              setActiveNode(next);
          }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--ui-font-heading)', color: 'white' }}>Nodes_Active</div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }} className="ui-interactive-bars">
                  {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} style={{ flex: 1, height: '40px', background: i <= activeNode ? 'var(--ui-indigo)' : '#111', cursor: 'pointer', transition: 'background 0.3s ease' }} title={`Toggle node ${i}`}></div>
                  ))}
              </div>
              <div className="ui-mono" style={{ fontSize: '0.65rem', color: '#444', marginTop: '2rem' }}>CLICK TO TOGGLE ACTIVE FLOWS</div>
          </div>
      </div>
    </section>
  );
};

export const FluidLogicBar = () => (
    <div className="ui-fluid-logic-bar">
        <span>★ DYNAMIC TRANSMISSION: CONNECTED // FLOW STABLE</span>
        <span className="ui-fluid-separator">//</span>
        <span>LATENCY TARGET: &lt;8ms SYNCED</span>
        <span className="ui-fluid-separator">//</span>
        <span>HIGH PERFORMANCE SCHEMA ACTIVE</span>
    </div>
);

export const KineticFooter = () => (
    <footer className="ui-kinetic-footer">
        <div className="ui-footer-grid">
            <div>
                <div className="ui-logo" style={{ color: 'white', fontSize: '2rem', marginBottom: '3rem' }}>MOTIONNODE</div>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px' }}>
                    The advanced high-fidelity interactive distribution node. Built for fluid transition and precise multi-vertical operations.
                </p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                renderTitle={(title) => <div className="ui-mono" style={{ color: 'var(--ui-yellow)', marginBottom: '3rem' }}>{title}</div>}
                listClassName="ui-footer-link-group"
                linkClassName="ui-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                renderTitle={(title) => <div className="ui-mono" style={{ color: 'var(--ui-yellow)', marginBottom: '3rem' }}>{title}</div>}
                listClassName="ui-footer-link-group"
                linkClassName="ui-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_3"
                renderTitle={(title) => <div className="ui-mono" style={{ color: 'var(--ui-yellow)', marginBottom: '3rem' }}>{title}</div>}
                listClassName="ui-footer-link-group"
                linkClassName="ui-footer-link"
            />
        </div>
        <div className="ui-footer-bottom">
            <div className="ui-mono" style={{ opacity: 0.4, fontSize: '0.65rem' }}>© 2026 SELLIO_MOTION_OS // INSTANT_SYNC_STABLE</div>
            <div className="ui-footer-socials">
                <MenuNav
                    location="social_footer"
                    flat
                    linkClassName="ui-mono"
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
