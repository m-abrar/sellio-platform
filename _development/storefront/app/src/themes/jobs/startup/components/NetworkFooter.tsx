'use client';
import React from 'react';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

export const NetworkFooter = () => {
    const brandLabel = useThemeContent('header.brand_label', 'GROWTH_NODE.');
    const footerDescription = useThemeContent(
      'footer.description',
      "The world's most advanced high-fidelity startup distribution node. Synchronizing talent with high-growth capital."
    );
    const footerCopyright = useThemeContent('footer.copyright', '(c) 2026 GROWTH_NODE_SYSTEMS. ALL_SYSTEMS_GO.');
    const footerVersion = useThemeContent('footer.version_label', 'v.4.2_ELITE_VC');

    return (
        <footer className="network-footer">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
                <div>
                    <div className="growth-logo" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
                        {brandLabel.endsWith('.') ? brandLabel.slice(0, -1) : brandLabel}<span>.</span>
                    </div>
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
                <span>{footerVersion}</span>
            </div>
        </footer>
    );
};
