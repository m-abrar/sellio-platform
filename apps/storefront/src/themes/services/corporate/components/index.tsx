
'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';

export const CorporateHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sc-header">
      <div className="sc-logo">
        <span className="text-primary">Corporate</span> <span style={{ color: 'var(--sc-text-dim)' }}>Services</span>
      </div>
      
      {/* Mobile Hamburger Trigger */}
      <button 
        className={`sc-hamburger ${isOpen ? 'sc-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        id="sc-hamburger-toggle"
      >
        <span className="sc-hamburger-bar"></span>
        <span className="sc-hamburger-bar"></span>
        <span className="sc-hamburger-bar"></span>
      </button>

      <div className={`sc-nav ${isOpen ? 'sc-nav-open' : ''}`}>
        <MenuNav
          location="main_header"
          flat
          linkClassName="sc-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={hashAwareNavItemRenderer}
        />
        <MenuActionButtons
          linkClassName="sc-btn sc-btn-primary sc-mobile-btn"
          as="button"
          onAction={() => alert('Consultation portal activated.')}
          onNavigate={() => setIsOpen(false)}
        />
      </div>

      <div className="sc-desktop-btn-container">
        <MenuActionButtons
          linkClassName="sc-btn sc-btn-primary sc-desktop-btn"
          renderItem={(item, props) => hashAwareNavItemRenderer(item, { ...props, isActive: false })}
        />
      </div>
    </header>
  );
};


export const ServiceCard = ({ title, description, icon }: any) => (
  <div className="sc-service-card">
    <div className="icon">{icon}</div>
    <h4 style={{ fontFamily: 'var(--sc-font-heading)', fontWeight: 600, color: 'var(--sc-dark)', marginBottom: '1rem', fontSize: '1.25rem' }}>{title}</h4>
    <p style={{ color: 'var(--sc-text-dim)', lineHeight: 1.6, fontSize: '0.95rem' }}>{description}</p>
  </div>
);

export const CaseStudyCard = ({ title, description, image }: any) => (
    <div className="sc-case-card">
        <img src={image} alt={title} className="sc-case-img" />
        <div className="sc-case-body">
            <h5 style={{ fontFamily: 'var(--sc-font-heading)', fontWeight: 600, color: 'var(--sc-dark)', marginBottom: '0.75rem', fontSize: '1.25rem' }}>{title}</h5>
            <p style={{ color: 'var(--sc-text-dim)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>{description}</p>
            <a href="#" style={{ color: 'var(--sc-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>Read More →</a>
        </div>
    </div>
);

export const TestimonialCard = ({ quote, name, title, avatar }: any) => (
    <div className="sc-testimonial-card">
        <p style={{ fontStyle: 'italic', fontSize: '1.1rem', color: '#555', marginBottom: '1.5rem', lineHeight: 1.8 }}>"{quote}"</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src={avatar} alt={name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
                <p style={{ fontWeight: 600, color: 'var(--sc-dark)', margin: 0 }}>{name}</p>
                <p style={{ fontSize: '0.9rem', color: '#777', margin: 0 }}>{title}</p>
            </div>
        </div>
    </div>
);

export const CorporateFooter = () => (
    <footer className="sc-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
            <div>
                <h5 style={{ fontFamily: 'var(--sc-font-heading)', fontWeight: 700, color: 'white', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Corporate Services</h5>
                <p style={{ color: '#adb5bd', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '2rem' }}>
                    Providing strategic consulting and innovative solutions to drive business growth and success.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    {['fb', 'tw', 'in', 'ig'].map(social => (
                        <div key={social} style={{ color: '#adb5bd', cursor: 'pointer' }}>•</div>
                    ))}
                </div>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                titleTag="h5"
                titleClassName="sc-footer-col-title"
                titleStyle={{ fontFamily: 'var(--sc-font-heading)', fontWeight: 600, color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem' }}
                linkClassName="sc-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                titleTag="h5"
                titleClassName="sc-footer-col-title"
                titleStyle={{ fontFamily: 'var(--sc-font-heading)', fontWeight: 600, color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem' }}
                linkClassName="sc-footer-link"
            />
            <div>
                <h5 style={{ fontFamily: 'var(--sc-font-heading)', fontWeight: 600, color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Contact Us</h5>
                <p style={{ color: '#adb5bd', fontSize: '0.95rem', marginBottom: '0.5rem' }}>123 Business Rd, City, State 12345</p>
                <p style={{ color: '#adb5bd', fontSize: '0.95rem', marginBottom: '0.5rem' }}>+1 (123) 456-7890</p>
                <p style={{ color: '#adb5bd', fontSize: '0.95rem' }}>info@corporateservices.com</p>
            </div>
        </div>
        <div style={{ borderTop: '1px solid #444', paddingTop: '2rem', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
            &copy; 2026 Corporate Services. All rights reserved.
        </div>
    </footer>
);
