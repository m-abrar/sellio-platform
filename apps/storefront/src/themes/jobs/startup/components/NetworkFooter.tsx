'use client';
import React from 'react';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';

export const NetworkFooter = () => (
    <footer className="network-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <div className="growth-logo" style={{ fontSize: '2rem', marginBottom: '2rem' }}>GROWTH_NODE<span>.</span></div>
                <p style={{ color: 'var(--growth-dim)', lineHeight: 2, fontSize: '1rem' }}>
                    The world's most advanced high-fidelity startup distribution node. Synchronizing talent with high-growth capital.
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
            <span>© 2026 GROWTH_NODE_SYSTEMS. ALL_SYSTEMS_GO.</span>
            <span>v.4.2_ELITE_VC</span>
        </div>
    </footer>
);
