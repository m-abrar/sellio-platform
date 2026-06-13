'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';

export const ModernHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const themeLink = useJobsThemeLink();

  return (
    <div className="jm-header-container">
      <header className="jm-header jm-glass">
        <a href={themeLink('/')} className="jm-logo">
          Nex<span className="jm-text-gradient">Role</span>
        </a>

        <button 
          className={`jm-hamburger ${isOpen ? 'jm-hamburger-open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="jm-hamburger-toggle"
        >
          <span className="jm-hamburger-bar"></span>
          <span className="jm-hamburger-bar"></span>
          <span className="jm-hamburger-bar"></span>
        </button>

        <MenuNav
          location="main_header"
          flat
          className={`jm-nav ${isOpen ? 'jm-nav-open' : ''}`}
          linkClassName="jm-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={hashAwareNavItemRenderer}
        />

        <div className="jm-mobile-actions">
          <MenuNav
            location="utility_header"
            flat
            linkClassName="jm-btn jm-btn-outline jm-mobile-action-btn"
            onNavigate={() => setIsOpen(false)}
          />
          <MenuActionButtons
            location="action_buttons"
            linkClassName="jm-btn jm-btn-primary jm-mobile-action-btn"
            onNavigate={() => setIsOpen(false)}
          />
        </div>

        <div className="jm-desktop-actions">
          <MenuNav
            location="utility_header"
            flat
            className="jm-utility-nav"
            linkClassName="jm-btn jm-btn-outline"
          />
          <MenuActionButtons
            location="action_buttons"
            linkClassName="jm-btn jm-btn-primary"
            renderItem={(item, { href, className, onNavigate }) => (
              <a href={href} className={className} id="jm-btn-vibe-status" onClick={onNavigate}>
                {item.title}
              </a>
            )}
          />
        </div>
      </header>
    </div>
  );
};

export const ModernJobCard = ({ title, company, location, type, level, salary, logo }: any) => (
    <div className="jm-job-card jm-glass">
        <div className="jm-company-header">
            <div className="jm-company-logo">
                <img src={logo} alt={company} />
            </div>
            <div>
                <div className="jm-company-name">{company}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--jm-text-muted)' }}>📍 {location}</div>
            </div>
        </div>
        <h3 className="jm-job-title">{title}</h3>
        <div className="jm-job-tags">
            <span className="jm-tag">{type}</span>
            <span className="jm-tag">{level}</span>
        </div>
        <div className="jm-job-footer">
            <div className="jm-salary">{salary}</div>
            <button className="jm-apply-btn" aria-label="Apply Now">→</button>
        </div>
    </div>
);

export const ModernFooter = () => {
    const themeLink = useJobsThemeLink();
    return (
    <footer className="jm-footer">
        <div className="jm-glass" style={{ borderRadius: '32px', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '4rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Ready for your next big move?</h2>
            <p style={{ color: 'var(--jm-text-muted)', fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '500px' }}>Join over 2 million professionals advancing their careers on NexRole.</p>
            <a href={themeLink('/explore')} className="jm-btn jm-btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', display: 'inline-block', textDecoration: 'none' }}>Browse Open Roles</a>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            <a href={themeLink('/')} className="jm-logo">
                Nex<span className="jm-text-gradient">Role</span>
            </a>
            <MenuNav
              location="footer_bottom_bar"
              flat
              className="jm-footer-bottom-links"
              linkClassName="jm-nav-link"
            />
            <div style={{ color: 'var(--jm-text-muted)', fontSize: '0.9rem' }}>
                &copy; 2026 Sellio. All rights reserved.
            </div>
        </div>
    </footer>
    );
};
