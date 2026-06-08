'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuUtilityNav } from '@/components/menu/MenuUtilityNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';

export const CorporateHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const themeLink = useJobsThemeLink();
  const brandLabel = useThemeContent('header.brand_label', 'TalentCorp');
  const brandHighlight = useThemeContent('header.brand_highlight', 'Talent');
  const brandRest = brandLabel.startsWith(brandHighlight)
    ? brandLabel.slice(brandHighlight.length)
    : brandLabel;

  return (
    <header className="jc-header">
      <a href={themeLink('')} className="jc-logo">
        <span style={{ color: 'var(--jc-blue-accent)' }}>{brandHighlight}</span>{brandRest}
      </a>

      <button 
        className={`jc-hamburger ${isOpen ? 'jc-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        id="jc-hamburger-toggle"
      >
        <span className="jc-hamburger-bar"></span>
        <span className="jc-hamburger-bar"></span>
        <span className="jc-hamburger-bar"></span>
      </button>

      <MenuNav
        location="main_header"
        flat
        className={`jc-nav ${isOpen ? 'jc-nav-open' : ''}`}
        linkClassName="jc-nav-link"
        onNavigate={() => setIsOpen(false)}
        renderItem={hashAwareNavItemRenderer}
      />

      <div className="jc-mobile-actions">
        <MenuUtilityNav
          location="utility_header"
          linkClassName="jc-btn jc-btn-outline jc-mobile-action-btn"
          onNavigate={() => setIsOpen(false)}
        />
        <MenuActionButtons
          location="action_buttons"
          linkClassName="jc-btn jc-btn-navy jc-mobile-action-btn"
          onNavigate={() => setIsOpen(false)}
        />
      </div>

      <div className="jc-desktop-actions">
        <MenuUtilityNav
          location="utility_header"
          linkClassName="jc-btn jc-btn-outline"
        />
        <MenuActionButtons
          location="action_buttons"
          linkClassName="jc-btn jc-btn-navy"
          renderItem={(item, { href, className, onNavigate }) => (
            <a href={href} className={className} id="jc-btn-vibe-status" onClick={onNavigate}>{item.title}</a>
          )}
        />
      </div>
    </header>
  );
};

type JobCardProps = {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  time: string;
  logo: string;
};

export const JobCard = ({ title, company, location, type, salary, time, logo }: JobCardProps) => (
    <div className="jc-job-card">
        <div className="jc-company-logo">
            <img src={logo} alt={company} />
        </div>
        <div className="jc-job-body">
            <h3 className="jc-job-title">{title}</h3>
            <div className="jc-company-name">{company}</div>
            <div className="jc-job-meta">
                <span>📍 {location}</span>
                <span>💼 {type}</span>
                <span>💰 {salary}</span>
                <span>⏱️ {time}</span>
            </div>
        </div>
        <div className="jc-job-action">
            <button className="jc-btn jc-btn-navy">Apply Now</button>
        </div>
    </div>
);

export const DashboardCard = () => {
  const title = useThemeContent('dashboard.title', 'Get Discovered by Top Employers');
  const description = useThemeContent('dashboard.description', 'Upload your resume and let recruiters come to you. Track applications in real-time.');
  const primaryLabel = useThemeContent('dashboard.primary_cta_label', 'Upload Resume');
  const secondaryLabel = useThemeContent('dashboard.secondary_cta_label', 'View Tracker');

  return (
    <div className="jc-dashboard-card" id="resume">
        <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>{title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>{description}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="jc-btn" style={{ backgroundColor: 'white', color: 'var(--jc-navy)' }}>{primaryLabel}</button>
            <button className="jc-btn jc-btn-outline" style={{ color: 'white', borderColor: 'white' }}>{secondaryLabel}</button>
        </div>
    </div>
  );
};

export const CorporateFooter = () => {
  const themeLink = useJobsThemeLink();
  const brandLabel = useThemeContent('header.brand_label', 'TalentCorp');
  const brandHighlight = useThemeContent('header.brand_highlight', 'Talent');
  const brandRest = brandLabel.startsWith(brandHighlight)
    ? brandLabel.slice(brandHighlight.length)
    : brandLabel;
  const description = useThemeContent('footer.description', 'Empowering professionals and leading enterprises to connect seamlessly.');
  const subscribeTitle = useThemeContent('footer.subscribe_title', 'Subscribe');
  const subscribeDescription = useThemeContent('footer.subscribe_description', 'Get daily job alerts.');
  const emailPlaceholder = useThemeContent('footer.email_placeholder', 'Email');
  const subscribeButtonLabel = useThemeContent('footer.subscribe_button_label', 'Subscribe');
  const copyright = useThemeContent('footer.copyright', '© 2026 TalentCorp Inc. All rights reserved.');

  return (
    <footer className="jc-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <a href={themeLink('')} className="jc-logo" style={{ marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--jc-blue-accent)' }}>{brandHighlight}</span>{brandRest}
                </a>
                <p style={{ color: 'var(--jc-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{description}</p>
            </div>
            <FooterMenuColumn
              location="footer_column_1"
              renderTitle={(title) => (
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--jc-navy)', marginBottom: '1.5rem' }}>{title}</h4>
              )}
              listClassName="jc-footer-links"
              linkClassName="jc-footer-link"
            />
            <FooterMenuColumn
              location="footer_column_2"
              renderTitle={(title) => (
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--jc-navy)', marginBottom: '1.5rem' }}>{title}</h4>
              )}
              listClassName="jc-footer-links"
              linkClassName="jc-footer-link"
            />
            <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--jc-navy)', marginBottom: '1.5rem' }}>{subscribeTitle}</h4>
                <p style={{ color: 'var(--jc-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{subscribeDescription}</p>
                <div style={{ display: 'flex' }}>
                    <input type="email" placeholder={emailPlaceholder} style={{ padding: '0.5rem', border: '1px solid var(--jc-border)', borderRadius: '4px 0 0 4px', width: '100%', outline: 'none' }} />
                    <button className="jc-btn jc-btn-navy" style={{ borderRadius: '0 4px 4px 0' }}>{subscribeButtonLabel}</button>
                </div>
            </div>
        </div>
        <div style={{ borderTop: '1px solid var(--jc-border)', paddingTop: '1.5rem', textAlign: 'center', color: 'var(--jc-text-muted)', fontSize: '0.85rem' }}>
            {copyright}
        </div>
    </footer>
  );
};
