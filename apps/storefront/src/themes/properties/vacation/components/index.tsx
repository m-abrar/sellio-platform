'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';

export const VacationHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="pv-header">
      <div className="pv-logo">
        ESCAPE<span style={{ color: 'var(--pv-coral)' }}>Node</span>
      </div>
      
      <button 
          className={`pv-hamburger ${isOpen ? 'pv-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="pv-hamburger-toggle"
      >
          <span className="pv-hamburger-bar"></span>
          <span className="pv-hamburger-bar"></span>
          <span className="pv-hamburger-bar"></span>
      </button>

      <nav className={`pv-nav ${isOpen ? 'pv-nav-open' : ''}`}>
          <MenuNav
            location="main_header"
            flat
            linkClassName="pv-nav-link"
            onNavigate={() => setIsOpen(false)}
            renderItem={defaultNavItemRenderer}
          />
          <MenuActionButtons
            as="button"
            buttonClassName="pv-btn-primary pv-mobile-btn"
            onNavigate={() => setIsOpen(false)}
            renderItem={(item, { className, onNavigate }) => (
              <button type="button" className={className} style={{ padding: '1rem 3rem', fontSize: '0.8rem', marginTop: '2rem', width: '100%' }} onClick={onNavigate}>{item.title}</button>
            )}
          />
      </nav>

      <MenuActionButtons
        as="button"
        buttonClassName="pv-btn-primary pv-desktop-btn"
        renderItem={(item, { className, onNavigate }) => (
          <button type="button" className={className} style={{ padding: '0.8rem 2rem', fontSize: '0.75rem', boxShadow: 'none' }} onClick={onNavigate} id="pv-btn-header-book">{item.title}</button>
        )}
      />
    </header>
  );
};

export const RetreatBentoCard = ({ title, location, price, rating, image, onClick }: any) => (
  <div className="pv-retreat-card" onClick={onClick}>
    <div className="pv-card-img-wrapper">
      <img src={image} alt={title} className="pv-card-img" />
      <div className="pv-card-rating">
        ★ {rating}
      </div>
    </div>
    <div style={{ padding: '3rem' }}>
        <div className="pv-mono" style={{ marginBottom: '1rem', color: 'var(--pv-sand)' }}>AUTHENTICATED RETREAT</div>
        <h3 style={{ fontFamily: 'var(--pv-font-serif)', fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', lineHeight: 1.2 }}>{title}</h3>
        <div style={{ fontSize: '0.9rem', color: 'var(--pv-text-muted)', marginBottom: '3rem' }}>{location}</div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--pv-border)', paddingTop: '2.5rem' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--pv-azure)' }}>{price}<span style={{ fontSize: '0.9rem', color: 'var(--pv-text-muted)', fontWeight: 600 }}>/night</span></div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px', color: 'var(--pv-coral)' }} className="pv-card-cta">SECURE BOOKING →</div>
        </div>
    </div>
  </div>
);


export const ExperienceStats = ({ value, label }: { value: string, label: string }) => (
    <div style={{ textAlign: 'center' }} className="pv-stat-item">
        <div style={{ fontSize: '4rem', fontFamily: 'var(--pv-font-serif)', fontWeight: 900, color: 'var(--pv-azure)', marginBottom: '1rem' }} className="pv-stat-value">{value}</div>
        <div className="pv-mono" style={{ color: 'var(--pv-text-muted)', fontSize: '0.65rem' }}>{label}</div>
    </div>
);

export const EscapeFooter = () => (
    <footer className="pv-footer">
        <div className="pv-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="pv-logo" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '3rem' }}>ESCAPENODE</div>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px' }}>
                    A high-fidelity vacation registry designed for the global traveler. Synchronizing authentic retreats with local expertise.
                </p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                renderTitle={(title) => <div className="pv-mono" style={{ color: 'var(--pv-sand)', marginBottom: '3rem' }}>{title}</div>}
                listClassName="pv-footer-link-group"
                linkClassName="pv-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                renderTitle={(title) => <div className="pv-mono" style={{ color: 'var(--pv-sand)', marginBottom: '3rem' }}>{title}</div>}
                listClassName="pv-footer-link-group"
                linkClassName="pv-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_3"
                renderTitle={(title) => <div className="pv-mono" style={{ color: 'var(--pv-sand)', marginBottom: '3rem' }}>{title}</div>}
                listClassName="pv-footer-link-group"
                linkClassName="pv-footer-link"
            />
        </div>
        <div style={{ marginTop: '10rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="pv-footer-bottom">
            <div className="pv-mono" style={{ opacity: 0.4, fontSize: '0.65rem' }}>© 2026 SELLIO_VACATION_OS // HORIZON_SYNC_STABLE</div>
            <div style={{ display: 'flex', gap: '4rem' }} className="pv-footer-socials">
                <MenuNav
                    location="social_footer"
                    flat
                    linkClassName="pv-mono"
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
