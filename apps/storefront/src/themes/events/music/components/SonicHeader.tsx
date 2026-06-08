'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

export const SonicHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const brandLabel = useThemeContent('header.brand_label', 'PULSE');

  return (
    <header className="sonic-header">
      <div className="sonic-logo">{brandLabel}</div>
      
      <button 
        className={`sonic-hamburger ${isOpen ? 'sonic-hamburger-open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
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
        onAction={() => alert('Ticket registration protocol activated.')}
      />

      <div className="sonic-desktop-btn-container">
        <MenuActionButtons
          location="action_buttons"
          className="sonic-desktop-btn-container"
          as="button"
          buttonClassName="sonic-btn-primary sonic-desktop-btn"
          onAction={() => alert('Ticket registration protocol activated.')}
          renderItem={(item, { className, onNavigate }) => (
            <button
              type="button"
              className={className}
              id="sonic-btn-vibe-status"
              onClick={() => {
                alert('Ticket registration protocol activated.');
                onNavigate?.();
              }}
            >
              {item.title}
            </button>
          )}
        />
      </div>
    </header>
  );
};
