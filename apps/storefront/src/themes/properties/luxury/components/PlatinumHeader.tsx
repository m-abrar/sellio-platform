'use client';

import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

export const PlatinumHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const themeLink = usePropertyThemeLink();

  return (
    <header className="platinum-header">
      <a href={themeLink('/')} className="platinum-logo">PLATINUM.</a>

      <button
        className={`luxury-hamburger ${isOpen ? 'luxury-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        aria-expanded={isOpen}
      >
        <span className="luxury-hamburger-bar" />
        <span className="luxury-hamburger-bar" />
        <span className="luxury-hamburger-bar" />
      </button>

      <div className={`platinum-nav-panel ${isOpen ? 'platinum-nav-open' : ''}`}>
        <MenuNav
          location="main_header"
          flat
          className="platinum-nav"
          linkClassName="platinum-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={defaultNavItemRenderer}
        />
        <MenuActionButtons
          as="button"
          buttonClassName="luxury-mobile-inquire-btn"
          onNavigate={() => setIsOpen(false)}
          renderItem={(item, { className, onNavigate }) => (
            <button type="button" className={className} onClick={onNavigate}>{item.title}</button>
          )}
        />
      </div>

      <MenuActionButtons
        as="button"
        buttonClassName="luxury-desktop-inquire-btn"
        renderItem={(item, { className, onNavigate }) => (
          <button type="button" className={className} onClick={onNavigate}>{item.title}</button>
        )}
      />
    </header>
  );
};
