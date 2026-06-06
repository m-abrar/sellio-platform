'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';

type ServiceTaxonomyRef =
  | string
  | {
      id?: number;
      title?: string;
      slug?: string;
    }
  | null
  | undefined;

export function getServiceTaxonomyLabel(
  value: ServiceTaxonomyRef,
  fallback = 'Specialist',
): string {
  if (!value) {
    return fallback;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (value.title) {
    return value.title;
  }

  if (value.slug) {
    return value.slug;
  }

  if (value.id != null) {
    return String(value.id);
  }

  return fallback;
}

export const WellnessHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sh-header">
      <div className="sh-logo">
        VITALITY<span style={{ color: 'var(--sh-blue)', fontWeight: 300 }}>Labs</span>
      </div>
      
      {/* Mobile Hamburger Trigger */}
      <button 
        className={`sh-hamburger ${isOpen ? 'sh-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        id="sh-hamburger-toggle"
      >
        <span className="sh-hamburger-bar"></span>
        <span className="sh-hamburger-bar"></span>
        <span className="sh-hamburger-bar"></span>
      </button>

      <MenuNav
        location="main_header"
        flat
        className={`sh-nav ${isOpen ? 'sh-nav-open' : ''}`}
        linkClassName="sh-nav-link"
        onNavigate={() => setIsOpen(false)}
        renderItem={hashAwareNavItemRenderer}
      />

      <MenuActionButtons
        className="sh-mono sh-secure-node"
        linkClassName="sh-mono sh-secure-node"
        renderItem={(item, { className }) => (
          <div className={className} style={{ fontSize: '0.65rem', border: '1px solid var(--sh-teal)', padding: '0.5rem 2rem', borderRadius: '4px', background: 'var(--sh-teal-light)' }}>
            {item.title}
          </div>
        )}
      />
    </header>
  );
};

export const PractitionerCard = ({ name, title, image, rating, availability }: any) => (
  <div className="sh-specialist-card">
    <div className="sh-img-circle">
      <img src={image} alt={name} className="sh-img" />
    </div>
    <div className="sh-mono" style={{ marginBottom: '1rem', fontSize: '0.6rem', color: 'var(--sh-teal)' }}>{title}</div>
    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>{name}</h3>
    
    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem', alignItems: 'center' }}>
        <span style={{ color: '#F59E0B' }}>★</span>
        <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{rating}</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--sh-teal)' }}>{availability}</span>
    </div>
    
    <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--sh-border)', paddingTop: '2rem' }}>
        <button 
          style={{ background: 'transparent', border: 'none', fontSize: '0.8rem', fontWeight: 900, color: 'var(--sh-blue)', letterSpacing: '2px', cursor: 'pointer' }}
          onClick={() => alert(`Consultation portal initializing for ${name}...`)}
        >
          BOOK CONSULTATION →
        </button>
    </div>
  </div>
);

export const VitalityHUD = ({ label, value, sub }: { label: string, value: string, sub: string }) => (
    <div className="sh-hud-card" style={{ padding: '3.5rem', background: 'white', border: '1px solid var(--sh-border)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
        <div className="sh-mono" style={{ marginBottom: '2rem' }}>{label}</div>
        <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--sh-teal)', marginBottom: '1.5rem', letterSpacing: '-2px' }}>{value}</div>
        <div style={{ fontSize: '0.95rem', color: 'var(--sh-grey)', lineHeight: 1.6, fontWeight: 300 }}>{sub}</div>
    </div>
);

export const ClinicFooter = () => (
    <footer className="sh-footer">
        <div className="sh-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="sh-logo" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '3rem' }}>VITALITY<span style={{ fontWeight: 300 }}>Labs</span></div>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '1.05rem', maxWidth: '400px', fontWeight: 300 }}>
                    The world's most trusted distribution node for high-fidelity clinical care. Synchronizing personal telemetry with global medical protocols.
                </p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                renderTitle={(title) => (
                    <div className="sh-mono" style={{ color: 'var(--sh-teal)', marginBottom: '4rem' }}>{title}</div>
                )}
                listClassName="sh-footer-link-list"
                linkClassName="sh-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                renderTitle={(title) => (
                    <div className="sh-mono" style={{ color: 'var(--sh-teal)', marginBottom: '4rem' }}>{title}</div>
                )}
                listClassName="sh-footer-link-list"
                linkClassName="sh-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_3"
                renderTitle={(title) => (
                    <div className="sh-mono" style={{ color: 'var(--sh-teal)', marginBottom: '4rem' }}>{title}</div>
                )}
                listClassName="sh-footer-link-list"
                linkClassName="sh-footer-link"
            />
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            <div className="sh-mono" style={{ opacity: 0.3, fontSize: '0.65rem' }}>© 2026 VITALITY LABS // CLINICAL GRADE NODE</div>
            <div style={{ display: 'flex', gap: '6rem', flexWrap: 'wrap' }}>
                <MenuNav
                    location="social_footer"
                    flat
                    linkClassName="sh-mono"
                    renderItem={(item, { href, className, onNavigate }) => (
                        <span className={className} style={{ opacity: 0.3, fontSize: '0.65rem', cursor: 'pointer' }} onClick={onNavigate}>
                            <a href={href} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
                        </span>
                    )}
                />
            </div>
        </div>
    </footer>
);
