'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';

export const LocalHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="local-header">
      <div className="local-logo">
        <span style={{ fontSize: '1.25rem' }}>🔧</span> HomeFix
      </div>
      
      {/* Mobile Hamburger Trigger */}
      <button 
        className={`local-hamburger ${isOpen ? 'local-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        id="local-hamburger-toggle"
      >
        <span className="local-hamburger-bar"></span>
        <span className="local-hamburger-bar"></span>
        <span className="local-hamburger-bar"></span>
      </button>

      <div className={`local-nav ${isOpen ? 'local-nav-open' : ''}`}>
        <MenuNav
          location="main_header"
          flat
          linkClassName="local-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={hashAwareNavItemRenderer}
        />
        <button 
          className="local-btn local-btn-primary local-mobile-btn" 
          onClick={() => alert('Booking portal initializing...')}
        >
          Book a Service
        </button>
      </div>

      <div className="local-desktop-btn-container">
        <button 
          className="local-btn local-btn-primary local-desktop-btn" 
          onClick={() => alert('Booking portal initializing...')}
          id="local-btn-vibe-status"
        >
          Book a Service
        </button>
      </div>
    </header>
  );
};

export const LocalServiceCard = ({ title, description, icon }: any) => (
    <div className="local-service-card">
        <div style={{ width: '60px', height: '60px', background: 'var(--local-yellow-light)', color: 'var(--local-yellow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem' }}>
            {icon}
        </div>
        <h5 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.2rem' }}>{title}</h5>
        <p style={{ color: 'var(--local-text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>{description}</p>
        <button 
          style={{ background: 'transparent', border: '1px solid var(--local-border)', color: 'var(--local-blue)', padding: '0.5rem 1.25rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
          onClick={() => alert(`Exploring details for ${title}...`)}
        >
          View Details
        </button>
    </div>
);

export const ProviderCard = ({ name, title, rating, jobs, image }: any) => (
    <div className="local-provider-card">
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <img src={image} alt={name} className="local-provider-img" />
            <div className="local-cta-overlay">
                <button className="local-btn local-btn-primary" onClick={() => alert(`Booking a consult with ${name}...`)}>Book Now</button>
            </div>
        </div>
        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h5 style={{ fontWeight: 700, marginBottom: '0.25rem', fontSize: '1.25rem' }}>{name}</h5>
            <p style={{ color: 'var(--local-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{title}</p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ background: 'var(--local-green)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>{rating} ★</span>
                <span style={{ color: 'var(--local-text-muted)' }}>| {jobs} jobs done</span>
            </div>
        </div>
    </div>
);

export const LocalFooter = () => (
    <footer className="local-footer">
        <div className="local-footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <div className="local-logo" style={{ marginBottom: '1rem' }}>🔧 HomeFix</div>
                <p style={{ color: 'var(--local-text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    Connecting you with trusted local service professionals quickly and safely.
                </p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                titleTag="h6"
                titleStyle={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}
                linkClassName="local-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                titleTag="h6"
                titleStyle={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}
                linkClassName="local-footer-link"
            />
            <div>
                <h6 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>Contact Us</h6>
                <p style={{ color: 'var(--local-text-muted)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>support@homefix.com</p>
                <p style={{ color: 'var(--local-text-muted)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>(555) 123-4567</p>
                <p style={{ color: 'var(--local-text-muted)', fontSize: '0.95rem' }}>123 Service Ave, Local City</p>
            </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center', color: 'var(--local-text-muted)', fontSize: '0.9rem' }}>
            &copy; 2026 HomeFix Local Services. All rights reserved.
        </div>
    </footer>
);
