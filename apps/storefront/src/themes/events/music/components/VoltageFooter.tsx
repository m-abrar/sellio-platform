'use client';
import React from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';

export const VoltageFooter = () => {
    const themeLink = useEventsThemeLink();
    const brandLabel = useThemeContent('header.brand_label', 'PULSE');
    const footerDescription = useThemeContent(
      'footer.description',
      "The heartbeat of live music. Discover and book the best events in your city and beyond.",
    );
    const footerCopyright = useThemeContent('footer.copyright', '');

    return (
    <footer className="voltage-footer">
        <div className="voltage-footer-grid">
            <div>
                <a href={themeLink('/')} className="sonic-logo voltage-footer-brand-link">{brandLabel}</a>
                <p className="voltage-footer-desc">{footerDescription}</p>
            </div>
            <FooterMenuColumn
              location="footer_column_1"
              renderTitle={(title) => <div className="voltage-footer-col-title">{title}</div>}
              listClassName="voltage-footer-links"
              linkClassName="footer-link"
            />
            <FooterMenuColumn
              location="footer_column_2"
              renderTitle={(title) => <div className="voltage-footer-col-title">{title}</div>}
              listClassName="voltage-footer-links"
              linkClassName="footer-link"
            />
            <FooterMenuColumn
              location="footer_column_3"
              renderTitle={(title) => <div className="voltage-footer-col-title">{title}</div>}
              listClassName="voltage-footer-links"
              linkClassName="footer-link"
            />
        </div>
        <div className="voltage-footer-bottom">
            <div className="voltage-footer-copyright">
              {footerCopyright || `© ${new Date().getFullYear()}. All rights reserved.`}
            </div>
            <MenuNav
              location="social_footer"
              flat
              className="voltage-footer-socials"
              linkClassName=""
              renderItem={(item, { href, className, onNavigate }) => (
                <span key={item.title} className="voltage-footer-social-item">
                  <a href={href} className={className} onClick={onNavigate}>{item.title}</a>
                </span>
              )}
            />
        </div>
    </footer>
    );
};
