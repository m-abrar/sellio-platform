'use client';
import React from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';

export const GrowthHeader = () => {
  const themeLink = useJobsThemeLink();
  const brandLabel = useThemeContent('header.brand_label', 'Venture Hub.');

  return (
    <header className="growth-header">
        <a href={themeLink('/')} className="growth-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: '24px', height: '24px', background: 'var(--growth-neon)', borderRadius: '4px', transform: 'rotate(45deg)' }}></div>
            {brandLabel.endsWith('.') ? brandLabel.slice(0, -1) : brandLabel}<span>.</span>
        </a>
        <MenuNav
          location="main_header"
          flat
          className="growth-nav"
          linkClassName="growth-nav-link"
          renderItem={defaultNavItemRenderer}
        />
        <MenuActionButtons
          location="action_buttons"
          as="button"
          buttonClassName="growth-btn-primary"
          renderItem={(item, { className, onNavigate }) => (
            <button
              type="button"
              className={className}
              style={{ padding: '0.7rem 2rem', fontSize: '0.8rem' }}
              onClick={onNavigate}
            >
              {item.title}
            </button>
          )}
        />
    </header>
  );
};
