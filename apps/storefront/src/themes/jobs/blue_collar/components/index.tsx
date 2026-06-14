'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';

export const BlueCollarHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const themeLink = useJobsThemeLink();

  return (
    <header className="jbc-header">
      <a href={themeLink('/')} className="jbc-logo">
        Trades<span>Work</span>
      </a>

      <button 
        className={`jbc-hamburger ${isOpen ? 'jbc-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        id="jbc-hamburger-toggle"
      >
        <span className="jbc-hamburger-bar"></span>
        <span className="jbc-hamburger-bar"></span>
        <span className="jbc-hamburger-bar"></span>
      </button>

      <MenuNav
        location="main_header"
        flat
        className={`jbc-nav ${isOpen ? 'jbc-nav-open' : ''}`}
        linkClassName="jbc-nav-link"
        onNavigate={() => setIsOpen(false)}
        renderItem={hashAwareNavItemRenderer}
      />

      <MenuActionButtons
        location="action_buttons"
        className="jbc-mobile-btn"
        as="button"
        buttonClassName="jbc-btn jbc-btn-primary jbc-mobile-btn"
        onNavigate={() => setIsOpen(false)}
        renderItem={(item, { className, onNavigate }) => (
          <Link href={themeLink('/explore')} style={{ textDecoration: 'none', width: '100%' }} onClick={onNavigate}>
            <button type="button" className={className}>{item.title}</button>
          </Link>
        )}
      />

      <div className="jbc-desktop-btn-container">
        <MenuActionButtons
          location="action_buttons"
          as="button"
          buttonClassName="jbc-btn jbc-btn-primary jbc-desktop-btn"
          renderItem={(item, { className, onNavigate }) => (
            <Link href={themeLink('/explore')} style={{ textDecoration: 'none' }} onClick={onNavigate}>
              <button type="button" className={className} id="jbc-btn-vibe-status">{item.title}</button>
            </Link>
          )}
        />
      </div>
    </header>
  );
};

export const BlueCollarJobCard = ({ title, company, location, type, wage, time }: {
  title: string;
  company: string;
  location: string;
  type: string;
  wage: string;
  time: string;
}) => (
    <div className="jbc-job-card">
        <h3 className="jbc-job-title">{title}</h3>
        <div className="jbc-job-company">{company}</div>
        
        <div className="jbc-job-meta">
            <span className="jbc-meta-item">📍 {location}</span>
            <span className="jbc-meta-item">⏱️ {type}</span>
            <span className="jbc-meta-item">📅 {time}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
            <div className="jbc-wage">{wage}</div>
            <span className="jbc-btn jbc-btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>View Job</span>
        </div>
    </div>
);

export const BlueCollarFooter = () => {
  const themeLink = useJobsThemeLink();
  return (
    <footer className="jbc-footer">
        <div className="jbc-footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <a href={themeLink('/')} className="jbc-logo" style={{ marginBottom: '1.5rem', display: 'block' }}>
                    Trades<span>Work</span>
                </a>
                <p style={{ color: 'var(--jbc-text-muted)', fontWeight: 500, lineHeight: 1.6 }}>Connecting skilled tradespeople with top employers in construction, manufacturing, and logistics.</p>
            </div>
            <FooterMenuColumn
              location="footer_column_1"
              renderTitle={(title) => (
                <h4 style={{ textTransform: 'uppercase', fontWeight: 900, marginBottom: '1.5rem', fontSize: '1.1rem', color: 'white' }}>{title}</h4>
              )}
              listClassName="jbc-footer-links"
              linkClassName="jbc-footer-link"
            />
            <FooterMenuColumn
              location="footer_column_2"
              renderTitle={(title) => (
                <h4 style={{ textTransform: 'uppercase', fontWeight: 900, marginBottom: '1.5rem', fontSize: '1.1rem', color: 'white' }}>{title}</h4>
              )}
              listClassName="jbc-footer-links"
              linkClassName="jbc-footer-link"
            />
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', color: '#757575', fontSize: '0.85rem', textAlign: 'center', fontWeight: 500 }}>
            © 2026 Sellio. All rights reserved.
        </div>
    </footer>
  );
};
