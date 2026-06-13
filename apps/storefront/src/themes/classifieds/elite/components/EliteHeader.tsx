
'use client';
import React from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';

const scrollToCatalog = () => {
    document.getElementById('ce-catalog')?.scrollIntoView({ behavior: 'smooth' });
};

export const EliteHeader = () => {
    const themeLink = useClassifiedsThemeLink();
    return (
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
    </header>
    );
};
