'use client';

import React from 'react';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { useModernThemeLink } from '../hooks/useModernThemeLink';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

export const CivicFooter = () => {
  const themeLink = useModernThemeLink();
  const brandName = useThemeContent('brand.name', 'URBAN.');
  const footerTagline = useThemeContent('footer.tagline', 'Discover premium homes, apartments, and commercial spaces in cities worldwide. Browse listings, compare amenities, and contact agents or hosts directly.');
  const footerCtaLabel = useThemeContent('footer.cta_label', 'Browse available properties');
  const footerCopyright = useThemeContent('footer.copyright', '');
  const footerSubTagline = useThemeContent('footer.sub_tagline', 'Verified property search for sale and rental listings.');
  const year = new Date().getFullYear();

  return (
    <footer className="civic-footer">
      <div className="civic-footer-grid">
        <div className="civic-footer-brand">
          <a className="urban-logo civic-footer-logo" href={themeLink('/')}>{brandName}</a>
          <p className="civic-footer-copy">{footerTagline}</p>
          <a href={themeLink('/explore')} className="civic-footer-cta">
            {footerCtaLabel}
          </a>
        </div>
        <FooterMenuColumn
          location="footer_column_1"
          titleTag="h4"
          titleClassName="civic-footer-heading"
          linkClassName="footer-link"
        />
        <FooterMenuColumn
          location="footer_column_2"
          titleTag="h4"
          titleClassName="civic-footer-heading"
          linkClassName="footer-link"
        />
        <FooterMenuColumn
          location="footer_column_3"
          titleTag="h4"
          titleClassName="civic-footer-heading"
          linkClassName="footer-link"
        />
      </div>
      <div className="civic-footer-bottom">
        <span>{footerCopyright || `© ${year} Sellio Urban. All rights reserved.`}</span>
        <span>{footerSubTagline}</span>
      </div>
    </footer>
  );
};
