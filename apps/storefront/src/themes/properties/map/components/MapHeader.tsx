'use client';

import React from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';

export const MapHeader = () => (
    <header className="map-header">
        <div className="map-logo">MAP<span>_</span>NODE</div>
        <MenuNav
            location="main_header"
            flat
            className="map-nav"
            linkClassName="map-nav-link"
            renderItem={defaultNavItemRenderer}
        />
        <MenuActionButtons
            as="button"
            buttonClassName="map-btn-primary"
            renderItem={(item, { className, onNavigate }) => (
                <button type="button" className={className} style={{ padding: '0.8rem 2.5rem', fontSize: '0.8rem' }} onClick={onNavigate}>{item.title}</button>
            )}
        />
    </header>
);

export const GeographicFooter = () => (
    <footer className="geographic-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <div className="map-logo" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>MAP.</div>
                <p style={{ color: '#64748b', lineHeight: 2, fontSize: '1rem' }}>
                    The world's most precise high-fidelity geographical distribution node. Mapping the global property registry with spatial logic.
                </p>
            </div>
            <FooterMenuColumn location="footer_column_1" titleTag="h4" linkClassName="footer-link" />
            <FooterMenuColumn location="footer_column_2" titleTag="h4" linkClassName="footer-link" />
            <FooterMenuColumn location="footer_column_3" titleTag="h4" linkClassName="footer-link" />
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid var(--map-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 800, letterSpacing: '4px' }}>
            <span>© 2026 MAP_NODE_SYSTEMS. SPATIAL_INTEGRITY_VERIFIED.</span>
            <span>v.4.0_CARTOGRAPHIC</span>
        </div>
    </footer>
);
