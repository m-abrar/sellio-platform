'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';

export const BlueCollarHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="jbc-header">
      <a href="#" className="jbc-logo">
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
        onAction={() => alert('Job posting form starting...')}
      />

      <div className="jbc-desktop-btn-container">
        <MenuActionButtons
          location="action_buttons"
          as="button"
          buttonClassName="jbc-btn jbc-btn-primary jbc-desktop-btn"
          onAction={() => alert('Job posting form starting...')}
          renderItem={(item, { className, onNavigate }) => (
            <button
              type="button"
              className={className}
              id="jbc-btn-vibe-status"
              onClick={() => {
                alert('Job posting form starting...');
                onNavigate?.();
              }}
            >
              {item.title}
            </button>
          )}
        />
      </div>
    </header>
  );
};

export const BlueCollarJobCard = ({ title, company, location, type, wage, time }: any) => (
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
            <button className="jbc-btn jbc-btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }} onClick={() => alert(`Applying to ${title} at ${company}...`)}>Apply Now</button>
        </div>
    </div>
);

export const BlueCollarFooter = () => (
    <footer className="jbc-footer">
        <div className="jbc-footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <a href="#" className="jbc-logo" style={{ marginBottom: '1.5rem', display: 'block' }}>
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
            &copy; 2026 TradesWork Platform. All Rights Reserved.
        </div>
    </footer>
);
