
'use client';
import React from 'react';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

export const DiamondFooter = () => {
    const themeLink = useClassifiedsThemeLink();
    const siteName = useThemeContent('site_name', 'Sellio Elite');
    return (
    <footer className="diamond-footer">
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem' }}>
            <div>
                <a href={themeLink('/')} className="elite-logo" style={{ marginBottom: '2rem', textDecoration: 'none', color: 'inherit' }}>SELLIO<span>_ELITE</span></a>
                <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.8 }}>
                    A boutique marketplace for high-value curated assets, verified by expert appraisers and trusted by collectors worldwide.
                </p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                className="footer-col"
                titleTag="h4"
                titleStyle={{ fontWeight: 900, fontSize: '0.8rem', color: '#d4af37', marginBottom: '2rem', letterSpacing: '2px' }}
                listClassName="footer-nav-list"
                linkClassName="footer-nav-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                className="footer-col"
                titleTag="h4"
                titleStyle={{ fontWeight: 900, fontSize: '0.8rem', color: '#d4af37', marginBottom: '2rem', letterSpacing: '2px' }}
                listClassName="footer-nav-list"
                linkClassName="footer-nav-link"
            />
            <FooterMenuColumn
                location="footer_column_3"
                className="footer-col"
                titleTag="h4"
                titleStyle={{ fontWeight: 900, fontSize: '0.8rem', color: '#d4af37', marginBottom: '2rem', letterSpacing: '2px' }}
                listClassName="footer-nav-list"
                linkClassName="footer-nav-link"
            />
        </div>
        <div style={{ maxWidth: '1400px', margin: '8rem auto 0 auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#333' }}>
            <span>© {new Date().getFullYear()} {siteName}. All rights reserved.</span>
            <span>Secure &amp; Verified Marketplace</span>
        </div>
    </footer>
    );
};
