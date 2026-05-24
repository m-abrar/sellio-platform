'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';

export const CrtvHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="crtv-header">
      <a href="#" className="crtv-logo gradient-text">CRTV</a>
      
      {/* Mobile Hamburger Trigger */}
      <button 
        className={`crtv-hamburger ${isOpen ? 'crtv-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        id="crtv-hamburger-toggle"
      >
        <span className="crtv-hamburger-bar"></span>
        <span className="crtv-hamburger-bar"></span>
        <span className="crtv-hamburger-bar"></span>
      </button>

      <div className={`crtv-nav ${isOpen ? 'crtv-nav-open' : ''}`}>
        <MenuNav
          location="main_header"
          flat
          linkClassName="crtv-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={hashAwareNavItemRenderer}
        />
        <MenuActionButtons
          linkClassName="crtv-btn crtv-btn-gradient crtv-mobile-btn"
          as="button"
          onAction={() => alert('Vibe-matching dynamic portal activated!')}
          onNavigate={() => setIsOpen(false)}
        />
      </div>

      <div className="crtv-desktop-btn-container">
        <MenuActionButtons
          linkClassName="crtv-btn crtv-btn-gradient crtv-desktop-btn"
          as="button"
          onAction={() => alert('Consultation portal activated.')}
        />
      </div>
    </header>
  );
};


export const CrtvCategoryCard = ({ title, rate, icon }: any) => (
    <div className="crtv-category-card">
        <div className="crtv-category-content">
            <div className="crtv-category-icon">{icon}</div>
            <h5 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{title}</h5>
            <p style={{ fontSize: '0.85rem', color: 'var(--crtv-text)', opacity: 0.7, margin: 0 }}>{rate}</p>
        </div>
    </div>
);

export const CrtvCreativeCard = ({ name, title, rating, rate, image }: any) => (
    <div className="crtv-creative-card">
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={image} alt={name} className="crtv-avatar" />
            <div>
                <h5 style={{ fontWeight: 800, marginBottom: '0.25rem' }}>{name}</h5>
                <p style={{ color: 'var(--crtv-text)', opacity: 0.7, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{title}</p>
                <span style={{ background: '#ffc107', color: '#121212', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>
                    ★ {rating}
                </span>
            </div>
        </div>
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#198754' }}>{rate}</span>
            <button className="crtv-btn crtv-btn-gradient" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>Hire Now</button>
        </div>
    </div>
);

export const CrtvPortfolioItem = ({ title, category, image }: any) => (
    <div className="crtv-portfolio-item">
        <img src={image} alt={title} />
        <div className="crtv-portfolio-overlay">
            <h5 style={{ fontWeight: 800, marginBottom: '0.5rem', fontSize: '1.5rem' }}>{title}</h5>
            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Category: {category}</p>
        </div>
    </div>
);

export const CrtvFooter = () => (
    <footer className="crtv-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <a href="#" className="crtv-logo" style={{ color: 'white' }}>CRTV</a>
                <p style={{ marginTop: '1rem', fontSize: '0.9rem', lineHeight: 1.6 }}>Connecting visionary clients with the world's finest creative talent.</p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                titleTag="h5"
                titleStyle={{ color: 'white', marginBottom: '1.5rem', fontWeight: 800 }}
                linkClassName="crtv-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                titleTag="h5"
                titleStyle={{ color: 'white', marginBottom: '1.5rem', fontWeight: 800 }}
                linkClassName="crtv-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_3"
                titleTag="h5"
                titleStyle={{ color: 'white', marginBottom: '1.5rem', fontWeight: 800 }}
                linkClassName="crtv-footer-link"
            />
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
            &copy; 2026 CRTV. All Rights Reserved.
        </div>
    </footer>
);
