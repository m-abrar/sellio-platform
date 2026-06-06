'use client';
import React from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuUtilityNav } from '@/components/menu/MenuUtilityNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

export const TechHeader = () => {
  const brandLabel = useThemeContent('header.brand_label', 'dev_jobs_');
  const brandPrefix = useThemeContent('header.brand_prefix', '>');

  return (
    <header className="jt-header">
        <a href="#" className="jt-logo">
            <span className="jt-text-accent">{brandPrefix}</span>{brandLabel}
        </a>
        <MenuNav
          location="main_header"
          flat
          className="jt-nav d-none d-md-flex"
          linkClassName="jt-nav-link"
          renderItem={hashAwareNavItemRenderer}
        />
        <div style={{ display: 'flex', gap: '1rem' }}>
            <MenuUtilityNav
              location="utility_header"
              linkClassName="jt-btn jt-btn-outline"
            />
            <MenuActionButtons
              location="action_buttons"
              linkClassName="jt-btn jt-btn-primary"
            />
        </div>
    </header>
  );
};

type TechJobCardProps = {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  time: string;
  logo: string;
  skills: string[];
  onClick?: () => void;
};

export const TechJobCard = ({ title, company, location, type, salary, time, logo, skills, onClick }: TechJobCardProps) => (
    <div className="jt-job-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        <div className="jt-company-logo">
            <img src={logo} alt={company} />
        </div>
        <div className="jt-job-body">
            <h3 className="jt-job-title">{title}</h3>
            <div className="jt-job-company">{company}</div>
            <div className="jt-job-tags">
                {skills.map((skill: string) => (
                    <span key={skill} className="jt-skill-tag">{skill}</span>
                ))}
            </div>
            <div className="jt-job-meta">
                <span>📍 {location}</span>
                <span>💼 {type}</span>
                <span>💰 {salary}</span>
            </div>
        </div>
        <div className="jt-job-action">
            <div style={{ fontSize: '0.8rem', color: 'var(--jt-text-muted)' }}>{time}</div>
            <button className="jt-btn jt-btn-primary" onClick={(e) => { e.stopPropagation(); if (onClick) onClick(); }}>Apply</button>
        </div>
    </div>
);

export const TechFooter = () => {
  const brandLabel = useThemeContent('header.brand_label', 'dev_jobs_');
  const brandPrefix = useThemeContent('header.brand_prefix', '>');
  const description = useThemeContent('footer.description', 'The #1 job board for software engineers, product managers, and data scientists.');
  const copyright = useThemeContent('footer.copyright', '© 2026 DevJobs. All rights reserved.');

  return (
    <footer className="jt-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <a href="#" className="jt-logo" style={{ marginBottom: '1rem', display: 'block' }}>
                    <span className="jt-text-accent">{brandPrefix}</span>{brandLabel}
                </a>
                <p style={{ color: 'var(--jt-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{description}</p>
            </div>
            <FooterMenuColumn
              location="footer_column_1"
              titleClassName="jt-sidebar-title"
              titleTag="h4"
              listClassName="jt-footer-links"
              linkClassName="jt-footer-link"
            />
            <FooterMenuColumn
              location="footer_column_2"
              titleClassName="jt-sidebar-title"
              titleTag="h4"
              listClassName="jt-footer-links"
              linkClassName="jt-footer-link"
            />
        </div>
        <div style={{ borderTop: '1px solid var(--jt-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', color: 'var(--jt-text-muted)', fontSize: '0.85rem' }}>
            <span>{copyright}</span>
            <MenuNav
              location="footer_bottom_bar"
              flat
              className="jt-footer-bottom-links"
              renderItem={(item, { href, className, onNavigate }) => (
                <a href={href} className={className} onClick={onNavigate} style={{ color: 'var(--jt-text-muted)', textDecoration: 'none' }}>{item.title}</a>
              )}
            />
        </div>
    </footer>
  );
};
