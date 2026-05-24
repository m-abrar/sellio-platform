'use client';
import React from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuUtilityNav } from '@/components/menu/MenuUtilityNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';

export const TechHeader = () => (
    <header className="jt-header">
        <a href="#" className="jt-logo">
            <span className="jt-text-accent">{'>'}</span>dev_jobs_
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

export const TechJobCard = ({ title, company, location, type, salary, time, logo, skills, onClick }: any) => (
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

export const TechFooter = () => (
    <footer className="jt-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <a href="#" className="jt-logo" style={{ marginBottom: '1rem', display: 'block' }}>
                    <span className="jt-text-accent">{'>'}</span>dev_jobs_
                </a>
                <p style={{ color: 'var(--jt-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>The #1 job board for software engineers, product managers, and data scientists.</p>
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
            <span>&copy; 2026 DevJobs. All rights reserved.</span>
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
