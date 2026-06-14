'use client';

import React from 'react';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { useModernThemeLink } from '../hooks/useModernThemeLink';

export const CivicFooter = () => {
    const themeLink = useModernThemeLink();

    return (
    <footer className="civic-footer">
        <div className="civic-footer-grid">
            <div>
                <a className="urban-logo civic-footer-logo" href={themeLink('/')}>URBAN.</a>
                <p className="civic-footer-copy">
                    Discover premium homes, apartments, and commercial spaces in cities worldwide. Browse listings, compare amenities, and contact agents or hosts directly.
                </p>
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
            <span>© 2026 Sellio. All rights reserved.</span>
        </div>
    </footer>
    );
};
