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

    return (
    <footer className="voltage-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '6rem' }}>
            <div>
                <a href={themeLink('/')} className="sonic-logo" style={{ fontSize: '3rem', marginBottom: '3rem', display: 'block', textDecoration: 'none', color: 'inherit' }}>{brandLabel}</a>
                <p style={{ color: '#666', lineHeight: 2, fontSize: '0.95rem' }}>
                    {footerDescription}
                </p>
            </div>
            <FooterMenuColumn
              location="footer_column_1"
              renderTitle={(title) => (
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem', fontWeight: 900, marginBottom: '3rem', color: 'var(--neon-pink)', letterSpacing: '3px' }}>{title}</div>
              )}
              listClassName="voltage-footer-links"
              linkClassName="footer-link"
            />
            <FooterMenuColumn
              location="footer_column_2"
              renderTitle={(title) => (
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem', fontWeight: 900, marginBottom: '3rem', color: 'var(--neon-pink)', letterSpacing: '3px' }}>{title}</div>
              )}
              listClassName="voltage-footer-links"
              linkClassName="footer-link"
            />
            <FooterMenuColumn
              location="footer_column_3"
              renderTitle={(title) => (
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem', fontWeight: 900, marginBottom: '3rem', color: 'var(--neon-pink)', letterSpacing: '3px' }}>{title}</div>
              )}
              listClassName="voltage-footer-links"
              linkClassName="footer-link"
            />
        </div>
        <div style={{ marginTop: '10rem', paddingTop: '4rem', borderTop: '1px solid var(--sonic-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '3rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#444', fontWeight: 900, letterSpacing: '2px' }}>© 2026 PULSE. All rights reserved.</div>
            <MenuNav
              location="social_footer"
              flat
              className="voltage-footer-socials"
              linkClassName=""
              renderItem={(item, { href, className, onNavigate }) => (
                <span key={item.title} style={{ fontSize: '0.7rem', color: '#444', fontWeight: 900, letterSpacing: '2px', cursor: 'pointer' }}>
                  <a href={href} className={className} onClick={onNavigate} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
                </span>
              )}
            />
        </div>
    </footer>
    );
};
