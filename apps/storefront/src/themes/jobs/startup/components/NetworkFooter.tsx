'use client';
import React from 'react';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';

export const NetworkFooter = () => {
    const themeLink = useJobsThemeLink();
    const brandLabel = useThemeContent('header.brand_label', 'Venture Hub.');
    const footerDescription = useThemeContent(
      'footer.description',
      'A curated job platform for startup-minded talent. Discover venture-backed opportunities and equity roles at high-growth companies.'
    );
    const footerCopyright = useThemeContent('footer.copyright', '© 2026 Sellio. All rights reserved.');
    const footerVersion = useThemeContent('footer.version_label', '');

    return (
        <footer className="network-footer">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
                <div>
                    <a href={themeLink('/')} className="growth-logo" style={{ fontSize: '2rem', marginBottom: '2rem', textDecoration: 'none', color: 'inherit' }}>
                        {brandLabel.endsWith('.') ? brandLabel.slice(0, -1) : brandLabel}<span>.</span>
                    </a>
                    <p style={{ color: 'var(--growth-dim)', lineHeight: 2, fontSize: '1rem' }}>
                        {footerDescription}
                    </p>
                </div>
                <FooterMenuColumn
                  location="footer_column_1"
                  titleTag="h4"
                  linkClassName="footer-link"
                />
                <FooterMenuColumn
                  location="footer_column_2"
                  titleTag="h4"
                  linkClassName="footer-link"
                />
                <FooterMenuColumn
                  location="footer_column_3"
                  titleTag="h4"
                  linkClassName="footer-link"
                />
            </div>
            <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid var(--growth-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#334155', fontWeight: 700, letterSpacing: '2px' }}>
                <span>{footerCopyright}</span>
                {footerVersion ? <span>{footerVersion}</span> : null}
            </div>
        </footer>
    );
};
