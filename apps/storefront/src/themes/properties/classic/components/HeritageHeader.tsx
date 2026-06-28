
'use client';
import React, { useEffect, useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuUtilityNav } from '@/components/menu/MenuUtilityNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { getThemeLink } from '@/lib/links';
import { useMenuContext } from '@/components/menu/MenuProvider';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

export const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { themeKey, isPreview } = useMenuContext();
    const brandLabel = useThemeContent('header.brand_label', 'ESTATE & HERITAGE');
    const [brandPrimary, brandSecondary] = brandLabel.split('&').map((part) => part.trim());

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`pc-header ${scrolled ? 'scrolled' : ''}`}>
            <a
                href={getThemeLink('/', themeKey, isPreview)}
                className="pc-header-logo"
            >
                {brandSecondary ? (
                    <>
                        {brandPrimary} <span className={`pc-header-brand-ampersand${scrolled ? ' pc-header-brand-ampersand--scrolled' : ''}`}>&</span> {brandSecondary}
                    </>
                ) : brandLabel}
            </a>
            
            <button
                className={`pc-hamburger ${isOpen ? 'pc-hamburger-open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation"
                aria-expanded={isOpen}
            >
                <span className="pc-hamburger-bar"></span>
                <span className="pc-hamburger-bar"></span>
                <span className="pc-hamburger-bar"></span>
            </button>

            <div className={`pc-nav ${isOpen ? 'pc-nav-open' : ''}`}>
                <MenuNav
                    location="main_header"
                    flat
                    className="pc-nav-links"
                    linkClassName="pc-nav-link"
                    onNavigate={() => setIsOpen(false)}
                    renderItem={defaultNavItemRenderer}
                />

                <div className="pc-mobile-header-right">
                    <MenuUtilityNav
                        linkClassName="pc-nav-link"
                        onNavigate={() => setIsOpen(false)}
                        className=""
                    />
                    <MenuActionButtons
                        linkClassName="pc-btn-primary"
                        onNavigate={() => setIsOpen(false)}
                        renderItem={(item, { href, className, onNavigate }) => (
                            <a
                                href={href}
                                className={`${className} pc-header-action-btn pc-mobile-action-btn`}
                                onClick={onNavigate}
                            >
                                {item.title}
                            </a>
                        )}
                    />
                </div>
            </div>

            <div className="pc-header-right">
                <MenuUtilityNav
                    linkClassName="pc-nav-link"
                    className=""
                />
                <MenuActionButtons
                    linkClassName="pc-btn-primary"
                    renderItem={(item, { href, className, onNavigate }) => (
                        <a
                            href={href}
                            className={`${className} pc-header-action-btn`}
                            onClick={onNavigate}
                        >
                            {item.title}
                        </a>
                    )}
                />
            </div>
        </header>
    );
};
