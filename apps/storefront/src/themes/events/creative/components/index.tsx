'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';

const experimentModeStyle = {
  fontSize: '0.65rem',
  border: '1px solid var(--evc-lime)',
  color: 'var(--evc-lime)',
  cursor: 'pointer',
} as const;

export const CreativeHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="evc-header">
      <div className="evc-header-container">
        <div className="evc-logo">
          CREATIVE<span>Node</span>
        </div>
        
        <button 
            className={`evc-hamburger ${isOpen ? 'evc-hamburger-open' : ''}`} 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation"
            id="evc-hamburger-toggle"
        >
            <span className="evc-hamburger-bar"></span>
            <span className="evc-hamburger-bar"></span>
            <span className="evc-hamburger-bar"></span>
        </button>

        <MenuNav
          location="main_header"
          flat
          className={`evc-nav ${isOpen ? 'evc-nav-open' : ''}`}
          linkClassName="evc-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={hashAwareNavItemRenderer}
        />

        <MenuActionButtons
          location="action_buttons"
          className="evc-label evc-mobile-btn"
          as="button"
          onNavigate={() => setIsOpen(false)}
          renderItem={(item, { className, onNavigate }) => (
            <div
              className={className}
              style={{ ...experimentModeStyle, padding: '1rem 2rem', textAlign: 'center', marginTop: '2rem', width: '100%' }}
              onClick={() => {
                alert('Experiment mode active.');
                onNavigate?.();
              }}
            >
              {item.title.toUpperCase()}: ACTIVE
            </div>
          )}
        />

        <MenuActionButtons
          location="action_buttons"
          className="evc-label evc-desktop-btn"
          as="button"
          renderItem={(item, { className, onNavigate }) => (
            <div
              className={className}
              style={{ ...experimentModeStyle, padding: '0.5rem 1.5rem' }}
              onClick={() => {
                alert('Experiment mode active.');
                onNavigate?.();
              }}
              id="evc-btn-experiment-status"
            >
              {item.title.toUpperCase()}: ACTIVE
            </div>
          )}
        />
      </div>
    </header>
  );
};

export const ArtisanEventCard = ({ title, location, date, status }: any) => (
  <div className="evc-artisan-card" onClick={() => alert(`Syncing node for: ${title}`)}>
    <div className="evc-tag">{status.toUpperCase()} // 2026</div>
    <div className="evc-label" style={{ marginBottom: '1.5rem', fontSize: '0.55rem', color: 'var(--evc-grey)' }}>{date} // {location.toUpperCase()}</div>
    <h3 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '3.5rem', lineHeight: 1.1, letterSpacing: '-1.5px', color: 'white' }}>{title}</h3>
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--evc-zinc)', paddingTop: '2.5rem' }} className="evc-card-footer">
        <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--evc-lime)', letterSpacing: '2px' }} className="evc-card-arrow">SYNC_NODE →</div>
        <div style={{ fontSize: '1.5rem', opacity: 0.3 }} className="evc-card-asterisk">✺</div>
    </div>
  </div>
);

export const PulseHUD = ({ label, value }: { label: string, value: string }) => (
    <div className="evc-hud-block">
        <div style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, color: 'var(--evc-lime)', marginBottom: '1rem', letterSpacing: '-4px' }}>{value}</div>
        <div className="evc-label" style={{ fontSize: '0.6rem', color: 'var(--evc-grey)' }}>{label}</div>
    </div>
);

export const VibrantFooter = () => (
    <footer className="evc-footer">
        <div className="evc-footer-grid">
            <div>
                <div className="evc-logo" style={{ fontSize: '3rem', marginBottom: '3.5rem' }}>CREATIVE</div>
                <p style={{ color: 'var(--evc-grey)', lineHeight: 2, fontSize: '1.1rem', maxWidth: '400px' }}>
                    The world's most vibrant distribution node for experimental event modules. Synchronizing creative pulses with global community nodes.
                </p>
            </div>
            <FooterMenuColumn
              location="footer_column_1"
              renderTitle={(title) => (
                <div className="evc-label" style={{ marginBottom: '3.5rem' }}>{title}</div>
              )}
              listClassName="evc-footer-link-group"
              linkClassName="evc-footer-link"
            />
            <FooterMenuColumn
              location="footer_column_2"
              renderTitle={(title) => (
                <div className="evc-label" style={{ marginBottom: '3.5rem' }}>{title}</div>
              )}
              listClassName="evc-footer-link-group"
              linkClassName="evc-footer-link"
            />
            <FooterMenuColumn
              location="footer_column_3"
              renderTitle={(title) => (
                <div className="evc-label" style={{ marginBottom: '3.5rem' }}>{title}</div>
              )}
              listClassName="evc-footer-link-group"
              linkClassName="evc-footer-link"
            />
        </div>
        <div className="evc-footer-bottom">
            <div className="evc-label" style={{ opacity: 0.2, fontSize: '0.65rem' }}>© 2026 SELLIO_CREATIVE_NODE // PULSE_STABLE</div>
            <MenuNav
              location="social_footer"
              flat
              className="evc-footer-socials"
              linkClassName="evc-label"
              renderItem={(item, { href, className, onNavigate }) => (
                <span className={className} style={{ opacity: 0.2, fontSize: '0.65rem', cursor: 'pointer' }}>
                  <a href={href} onClick={onNavigate} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
                </span>
              )}
            />
        </div>
    </footer>
);
