'use client';

import React from 'react';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';

export const CivicFooter = () => (
    <footer className="civic-footer">
        <div className="civic-footer-grid">
            <div>
                <div className="urban-logo civic-footer-logo">URBAN.</div>
                <p className="civic-footer-copy">
                    The world's most advanced high-fidelity urban distribution node. Precision architectural engineering for the modern global skyline.
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
            <span>© 2026 URBAN_NODE_SYSTEMS. STRUCTURAL_AUTHORITY.</span>
            <span>v.8.0_SKYLINE</span>
        </div>
    </footer>
);
