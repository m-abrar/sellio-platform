
'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

export const PlatinumHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    const themeLink = usePropertyThemeLink();

    return (
        <header className="platinum-header">
            <a href={themeLink('/')} className="platinum-logo">PLATINUM.</a>

            <button
                className={`luxury-hamburger ${isOpen ? 'luxury-hamburger-open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation"
            >
                <span className="luxury-hamburger-bar"></span>
                <span className="luxury-hamburger-bar"></span>
                <span className="luxury-hamburger-bar"></span>
            </button>

            <div className={`platinum-nav-panel ${isOpen ? 'platinum-nav-open' : ''}`}>
                <MenuNav
                    location="main_header"
                    flat
                    className="platinum-nav"
                    linkClassName="platinum-nav-link"
                    onNavigate={() => setIsOpen(false)}
                    renderItem={defaultNavItemRenderer}
                />

                <MenuActionButtons
                    as="button"
                    buttonClassName="luxury-mobile-inquire-btn"
                    onNavigate={() => setIsOpen(false)}
                    renderItem={(item, { className, onNavigate }) => (
                        <button type="button" className={className} style={{
                            background: 'none',
                            border: '1px solid #000',
                            padding: '0.8rem 2.5rem',
                            fontFamily: 'var(--font-serif)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            marginTop: '2rem'
                        }} onClick={onNavigate}>{item.title}</button>
                    )}
                />
            </div>

            <MenuActionButtons
                as="button"
                buttonClassName="luxury-desktop-inquire-btn"
                renderItem={(item, { className, onNavigate }) => (
                    <button type="button" className={className} style={{
                        background: 'none',
                        border: '1px solid #000',
                        padding: '0.8rem 2.5rem',
                        fontFamily: 'var(--font-serif)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                    }} onClick={onNavigate}>{item.title}</button>
                )}
            />
        </header>
    );
};
