'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';
import type { MenuItem } from '@sellio/types';
import type { MenuItemRenderProps } from '@/components/menu/menu-renderers';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';

function freelanceUtilityRenderer(variant: 'mobile' | 'desktop') {
  return (item: MenuItem, { href, onNavigate }: MenuItemRenderProps) => {
    const isJoin = item.title.toLowerCase().includes('join');
    const btnClass = isJoin
      ? `jf-btn jf-btn-primary${variant === 'mobile' ? ' jf-mobile-action-btn' : ''}`
      : `jf-btn jf-btn-outline${variant === 'mobile' ? ' jf-mobile-action-btn' : ''}`;

    return (
      <a
        href={href}
        className={btnClass}
        id={isJoin ? 'jf-btn-vibe-status' : undefined}
        onClick={onNavigate}
        style={!isJoin && variant === 'desktop' ? { color: 'var(--jf-text-main)' } : undefined}
      >
        {item.title}
      </a>
    );
  };
}

export const FreelanceHeader = () => {
  const themeLink = useJobsThemeLink();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="jf-header">
      <a href={themeLink('/')} className="jf-logo">
        Gig<span className="jf-text-emerald">Hive</span>
      </a>

      <button 
        className={`jf-hamburger ${isOpen ? 'jf-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        id="jf-hamburger-toggle"
      >
        <span className="jf-hamburger-bar"></span>
        <span className="jf-hamburger-bar"></span>
        <span className="jf-hamburger-bar"></span>
      </button>

      <MenuNav
        location="main_header"
        flat
        className={`jf-nav ${isOpen ? 'jf-nav-open' : ''}`}
        linkClassName="jf-nav-link"
        onNavigate={() => setIsOpen(false)}
        renderItem={hashAwareNavItemRenderer}
      />

      <MenuNav
        location="utility_header"
        flat
        className="jf-mobile-actions"
        onNavigate={() => setIsOpen(false)}
        renderItem={freelanceUtilityRenderer('mobile')}
      />

      <MenuNav
        location="utility_header"
        flat
        className="jf-desktop-actions"
        renderItem={freelanceUtilityRenderer('desktop')}
      />
    </header>
  );
};

export const GigCard = ({ title, name, avatar, image, rating, reviews, price }: any) => (
    <div className="jf-gig-card">
        <img src={image} className="jf-gig-img" alt={title} />
        <div className="jf-gig-body">
            <div className="jf-freelancer-info">
                <img src={avatar} className="jf-avatar" alt={name} />
                <div className="jf-freelancer-name">{name}</div>
            </div>
            <h3 className="jf-gig-title">{title}</h3>
            <div className="jf-gig-rating">
                ★ {rating} <span style={{ color: 'var(--jf-text-muted)', fontWeight: 400 }}>({reviews})</span>
            </div>
            <div className="jf-gig-footer">
                <span style={{ fontSize: '1.25rem', color: '#d1d5db', cursor: 'pointer' }}>♥</span>
                <div className="jf-gig-price">
                    STARTING AT <strong>{price}</strong>
                </div>
            </div>
        </div>
    </div>
);

export const FreelanceFooter = () => {
  const themeLink = useJobsThemeLink();
  return (
    <footer className="jf-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <a href={themeLink('/')} className="jf-logo" style={{ marginBottom: '1rem', display: 'block' }}>
                    Gig<span className="jf-text-emerald">Hive</span>
                </a>
                <p style={{ color: 'var(--jf-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>Find the perfect freelance services for your business. Fast, secure, and professional.</p>
            </div>
            <FooterMenuColumn
              location="footer_column_1"
              titleClassName="jf-footer-col-title"
              titleTag="h4"
              listClassName="jf-footer-links"
              linkClassName="jf-footer-link"
            />
            <FooterMenuColumn
              location="footer_column_2"
              titleClassName="jf-footer-col-title"
              titleTag="h4"
              listClassName="jf-footer-links"
              linkClassName="jf-footer-link"
            />
            <FooterMenuColumn
              location="footer_column_3"
              titleClassName="jf-footer-col-title"
              titleTag="h4"
              listClassName="jf-footer-links"
              linkClassName="jf-footer-link"
            />
        </div>
        <div style={{ borderTop: '1px solid var(--jf-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', color: 'var(--jf-text-muted)', fontSize: '0.85rem' }}>
            <span>© 2026 GigHive. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <span>🌐 English</span>
                <span>$ USD</span>
            </div>
        </div>
    </footer>
  );
};
