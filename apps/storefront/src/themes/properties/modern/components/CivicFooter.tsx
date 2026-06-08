'use client';

import React from 'react';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';

export const CivicFooter = () => (
    <footer className="civic-footer">
        <div className="civic-footer-grid">
            <div>
                <div className="urban-logo civic-footer-logo">URBAN.</div>
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
            <span>© 2026 Urban Properties. All rights reserved.</span>
        </div>
    </footer>
);
