'use client';
import React, { useState } from 'react';

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

      <nav className={`ui-nav ${isOpen ? 'ui-nav-open' : ''}`}>
          {['Logic', 'Grid', 'Transitions', 'Provenances'].map(link => (
              <a key={link} href="#" className="ui-nav-link" onClick={() => setIsOpen(false)}>{link}</a>
          ))}
          <button className="ui-btn-primary ui-mobile-btn" style={{ padding: '1rem 3rem', fontSize: '0.8rem', marginTop: '2rem', width: '100%' }} onClick={() => alert('Motion Node transition sync active.')}>
            INITIALIZE SYNC
          </button>
      </nav>

      <button className="ui-btn-primary ui-desktop-btn" style={{ padding: '0.8rem 2rem', fontSize: '0.75rem' }} onClick={() => alert('Motion Node transition sync active.')} id="ui-btn-header-access">
        INITIALIZE SYNC
      </button>
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
            {['LOGICS', 'TRANSITIONS', 'SECURITY'].map(col => (
                <div key={col}>
                    <div className="ui-mono" style={{ color: 'var(--ui-yellow)', marginBottom: '3rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="ui-footer-link-group">
                        {['Transition Sync', 'Metrics Hub', 'Dynamic System', 'Fluid Node'].map(link => (
                            <span key={link} className="ui-footer-link" onClick={() => alert(`Navigating interactive link: ${link}`)}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div className="ui-footer-bottom">
            <div className="ui-mono" style={{ opacity: 0.4, fontSize: '0.65rem' }}>© 2026 SELLIO_MOTION_OS // INSTANT_SYNC_STABLE</div>
            <div className="ui-footer-socials">
                {['INSTAGRAM', 'LINKEDIN', 'X_OS'].map(social => (
                    <span key={social} className="ui-mono" style={{ opacity: 0.4, fontSize: '0.65rem', cursor: 'pointer' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
