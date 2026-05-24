
'use client';
import React from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';

export const EliteHeader = () => (
    <header className="elite-header">
        <div className="elite-logo">SELLIO_ELITE</div>
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
                onAction={() => alert('Member login portal initializing...')}
            />
        </div>
    </header>
);
