'use client';

import React from 'react';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

export const ConciergeFooter = () => {
  const themeLink = usePropertyThemeLink();
  const tagline = useThemeContent('footer.tagline', 'Curated luxury real estate for the discerning estate holder.');
  const copyright = useThemeContent('footer.copyright', '');
  const year = new Date().getFullYear();

  return (
    <footer className="concierge-footer">
      <div className="concierge-footer-grid">
        <div>
          <a className="platinum-logo concierge-footer-logo" href={themeLink('/')}>PLATINUM.</a>
          <p className="concierge-footer-desc">{tagline}</p>
        </div>
        <FooterMenuColumn location="footer_column_1" titleTag="h4" linkClassName="footer-link" />
        <FooterMenuColumn location="footer_column_2" titleTag="h4" linkClassName="footer-link" />
        <FooterMenuColumn location="footer_column_3" titleTag="h4" linkClassName="footer-link" />
      </div>
      <div className="concierge-footer-bottom">
        <span>{copyright || `© ${year} Sellio. All rights reserved.`}</span>
      </div>
    </footer>
  );
};
