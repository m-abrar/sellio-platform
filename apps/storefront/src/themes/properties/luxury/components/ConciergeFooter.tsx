'use client';

import React from 'react';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';

export const ConciergeFooter = () => (
    <footer className="concierge-footer">
        <div className="concierge-footer-grid">
            <div>
                <div className="platinum-logo" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>PLATINUM.</div>
                <p style={{ color: '#888', lineHeight: 2 }}>
                    The world's most exclusive high-fidelity luxury distribution network. Tailored for the discerning estate holder.
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
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid var(--luxury-border)', fontSize: '0.8rem', color: '#aaa', fontWeight: 600, letterSpacing: '2px' }}>
            <span>© 2026 Platinum Estate Group. All rights reserved.</span>
        </div>
    </footer>
);
