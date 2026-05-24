
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
                style={{ textDecoration: 'none', fontFamily: 'var(--pc-font-serif)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--pc-teal)', letterSpacing: '-1px', cursor: 'pointer', zIndex: 1045, position: 'relative' }}
            >
                {brandSecondary ? (
                    <>
                        {brandPrimary} <span style={{ fontWeight: 400, opacity: scrolled ? 0.3 : 0.6 }}>&</span> {brandSecondary}
                    </>
                ) : brandLabel}
            </a>
            
            <button 
                className={`pc-hamburger ${isOpen ? 'pc-hamburger-open' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation"
            >
                <span className="pc-hamburger-bar"></span>
                <span className="pc-hamburger-bar"></span>
                <span className="pc-hamburger-bar"></span>
            </button>

            <MenuNav
                location="main_header"
                flat
                className={`pc-nav ${isOpen ? 'pc-nav-open' : ''}`}
                linkClassName="pc-nav-link"
                onNavigate={() => setIsOpen(false)}
                renderItem={defaultNavItemRenderer}
            />

            {isOpen && (
                <div className="pc-mobile-header-right" style={{ marginTop: '2rem' }}>
                    <MenuUtilityNav
                        linkClassName="pc-nav-link"
                        onNavigate={() => setIsOpen(false)}
                        className=""
                    />
                    <MenuActionButtons
                        linkClassName="pc-btn-primary"
                        onNavigate={() => setIsOpen(false)}
                        renderItem={(item, { href, className, onNavigate }) => (
                            <a href={href} className={className} style={{ padding: '0.8rem 2.5rem', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-block', marginTop: '1.5rem' }} onClick={onNavigate}>{item.title}</a>
                        )}
                    />
                </div>
            )}

            <div className="pc-header-right">
                <MenuUtilityNav
                    linkClassName="pc-nav-link"
                    className=""
                />
                <MenuActionButtons
                    linkClassName="pc-btn-primary"
                    renderItem={(item, { href, className, onNavigate }) => (
                        <a href={href} className={className} style={{ padding: '0.8rem 2.5rem', fontSize: '0.85rem', textDecoration: 'none' }} onClick={onNavigate}>{item.title}</a>
                    )}
                />
            </div>
        </header>
    );
};
