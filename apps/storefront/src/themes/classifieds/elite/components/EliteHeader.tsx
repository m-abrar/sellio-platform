
'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';

const scrollToCatalog = () => {
    document.getElementById('ce-catalog')?.scrollIntoView({ behavior: 'smooth' });
};

export const EliteHeader = () => {
    const themeLink = useClassifiedsThemeLink();
    const [menuOpen, setMenuOpen] = useState(false);
    return (
    <>
    <header className="elite-header">
        <a href={themeLink('/')} className="elite-logo" style={{ textDecoration: 'none', color: 'inherit' }}>SELLIO<span>_ELITE</span></a>
        <div className="elite-nav-panel">
            <MenuNav
                location="main_header"
                flat
                className="elite-nav"
                linkClassName="elite-nav-link"
                renderItem={defaultNavItemRenderer}
            />
            <MenuActionButtons
                buttonClassName="elite-btn-login"
                as="button"
                onAction={scrollToCatalog}
            />
        </div>
        <button
            className="elite-hamburger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
        >
            {menuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
            )}
        </button>
    </header>
    {menuOpen && (
        <nav className="elite-mobile-drawer" aria-label="Mobile navigation">
            <MenuNav
                location="main_header"
                flat
                className="elite-mobile-nav"
                linkClassName="elite-mobile-nav-link"
                renderItem={defaultNavItemRenderer}
            />
            <MenuActionButtons
                buttonClassName="elite-btn-login"
                as="button"
                onAction={() => { setMenuOpen(false); scrollToCatalog(); }}
            />
        </nav>
    )}
    </>
    );
};
