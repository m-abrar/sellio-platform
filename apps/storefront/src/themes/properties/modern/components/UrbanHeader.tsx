
'use client';
import React, { useEffect, useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';

export const UrbanHeader = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <header className="urban-header">
            <div className="urban-logo">URBAN<span>_</span>NODE</div>

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
                    renderItem={(item, props) => hashAwareNavItemRenderer(item, { ...props, isActive: false })}
                />
            </div>

            <MenuActionButtons
                linkClassName="urban-btn-primary urban-desktop-auth-btn"
                renderItem={(item, props) => hashAwareNavItemRenderer(item, { ...props, isActive: false })}
            />
        </header>
    );
};
