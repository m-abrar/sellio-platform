
'use client';
import React, { useEffect, useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';
import { useModernThemeLink } from '../hooks/useModernThemeLink';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

export const UrbanHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    const themeLink = useModernThemeLink();
    const brandLabel = useThemeContent('brand.name', 'URBAN.');

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <header className="urban-header">
            <a href={themeLink('/')} className="urban-logo">{brandLabel.slice(0, -1)}<span>{brandLabel.slice(-1)}</span></a>

            {isOpen && (
                <button
                    type="button"
                    className="urban-nav-backdrop"
                    aria-label="Close navigation menu"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <button
                type="button"
                className={`urban-hamburger ${isOpen ? 'urban-hamburger-open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation"
                aria-expanded={isOpen}
            >
                <span className="urban-hamburger-bar"></span>
                <span className="urban-hamburger-bar"></span>
                <span className="urban-hamburger-bar"></span>
            </button>

            <div className={`urban-nav-panel ${isOpen ? 'urban-nav-open' : ''}`}>
                <MenuNav
                    location="main_header"
                    flat
                    className="urban-nav"
                    linkClassName="urban-nav-link"
                    onNavigate={() => setIsOpen(false)}
                    renderItem={hashAwareNavItemRenderer}
                />

                <MenuActionButtons
                    linkClassName="urban-btn-primary urban-mobile-auth-btn"
                    onNavigate={() => setIsOpen(false)}
                    renderItem={(item, { className, onNavigate }) => (
                        <a href={themeLink('/explore')} className={className} onClick={onNavigate}>
                            {item.title || 'Browse listings'}
                        </a>
                    )}
                />
            </div>

            <MenuActionButtons
                linkClassName="urban-btn-primary urban-desktop-auth-btn"
                renderItem={(item, { className, onNavigate }) => (
                    <a href={themeLink('/explore')} className={className} onClick={onNavigate}>
                        {item.title || 'Browse listings'}
                    </a>
                )}
            />
        </header>
    );
};
