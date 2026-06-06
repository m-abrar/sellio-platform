
'use client';
import React from 'react';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';

export const DiamondFooter = () => (
    <footer className="diamond-footer">
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem' }}>
            <div>
                <div className="elite-logo" style={{ marginBottom: '2rem' }}>SELLIO_ELITE</div>
                <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.8 }}>
                    The world's most exclusive marketplace for high-value assets. Curated by experts, trusted by collectors.
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
            <span>© 2026 SELLIO_ELITE_HOLDINGS. ALL RIGHTS RESERVED.</span>
            <span>PRIVACY_PROTECTED_NODE</span>
        </div>
    </footer>
);
