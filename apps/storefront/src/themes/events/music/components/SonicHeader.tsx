'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';

export const SonicHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const themeLink = useEventsThemeLink();
  const brandLabel = useThemeContent('header.brand_label', 'PULSE');

  return (
    <header className="sonic-header">
      <a href={themeLink('/')} className="sonic-logo" style={{ textDecoration: 'none', color: 'inherit' }}>{brandLabel}</a>
      
      <button
        className={`sonic-hamburger ${isOpen ? 'sonic-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        aria-expanded={isOpen}
        id="sonic-hamburger-toggle"
      >
        <span className="sonic-hamburger-bar"></span>
        <span className="sonic-hamburger-bar"></span>
        <span className="sonic-hamburger-bar"></span>
      </button>

      <MenuNav
        location="main_header"
        flat
        className={`sonic-nav ${isOpen ? 'sonic-nav-open' : ''}`}
        linkClassName="sonic-nav-link"
        onNavigate={() => setIsOpen(false)}
        renderItem={hashAwareNavItemRenderer}
      />

      <MenuActionButtons
        location="action_buttons"
        className="sonic-mobile-btn"
        as="button"
        buttonClassName="sonic-btn-primary sonic-mobile-btn"
        onNavigate={() => setIsOpen(false)}
        renderItem={(item, { className, onNavigate }) => (
          <Link href={themeLink('/explore')} style={{ width: '100%', textDecoration: 'none' }} onClick={onNavigate}>
            <button type="button" className={className}>{item.title}</button>
          </Link>
        )}
      />

      <div className="sonic-desktop-btn-container">
        <MenuActionButtons
          location="action_buttons"
          className="sonic-desktop-btn-container"
          as="button"
          buttonClassName="sonic-btn-primary sonic-desktop-btn"
          renderItem={(item, { className, onNavigate }) => (
            <Link href={themeLink('/explore')} style={{ textDecoration: 'none' }} onClick={onNavigate}>
              <button type="button" className={className} id="sonic-btn-vibe-status">
                {item.title}
              </button>
            </Link>
          )}
        />
      </div>
    </header>
  );
};
