'use client';

import React, { useState } from 'react';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { MenuNav } from '@/components/menu/MenuNav';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useClassicThemeLink } from '../hooks/useClassicThemeLink';

function FooterColumnLabel({ children }: { children: string }) {
    return <p className="pc-footer-label">{children}</p>;
}

export const Footer = () => {
    const themeLink = useClassicThemeLink();
    const brandLabel = useThemeContent('header.brand_label', 'ESTATE & HERITAGE');
    const footerEyebrow = useThemeContent('footer.eyebrow', 'Heritage Collection');
    const footerDescription = useThemeContent(
        'footer.description',
        "A curated collection of the world's most distinguished historic properties, verified for architectural provenance and heritage value.",
    );
    const subscribeText = useThemeContent(
        'footer.subscribe_text',
        'Subscribe to receive updates on the latest heritage property listings.',
    );
    const copyright = useThemeContent('footer.copyright', '');
    const year = new Date().getFullYear();
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [brandPrimary, brandSecondary] = brandLabel.split('&').map((part) => part.trim());

    const handleNewsletterSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setSubscribed(true);
        setEmail('');
    };

    const columnTitle = (title: string) => <FooterColumnLabel>{title}</FooterColumnLabel>;

    return (
        <footer className="pc-footer">
            <div className="pc-footer-inner">
                <div className="pc-footer-main">
                    <section className="pc-footer-brand" aria-label="Brand">
                        <div className="pc-footer-brand-header">
                            <FooterColumnLabel>{footerEyebrow}</FooterColumnLabel>
                            <p className="pc-footer-brand-name">
                                {brandSecondary ? (
                                    <>
                                        {brandPrimary} <span className="pc-italic">&</span> {brandSecondary}
                                    </>
                                ) : (
                                    brandLabel
                                )}
                            </p>
                        </div>
                        <p className="pc-footer-text">{footerDescription}</p>
                        <MenuNav
                            location="social_footer"
                            flat
                            className="pc-footer-social"
                            linkClassName="pc-footer-social-link"
                        />
                    </section>

                    <FooterMenuColumn
                        location="footer_column_1"
                        className="pc-footer-col"
                        renderTitle={columnTitle}
                        listClassName="pc-footer-nav"
                        linkClassName="pc-footer-item"
                    />

                    <FooterMenuColumn
                        location="footer_column_2"
                        className="pc-footer-col"
                        renderTitle={columnTitle}
                        listClassName="pc-footer-nav"
                        linkClassName="pc-footer-item"
                    />

                    <section className="pc-footer-col pc-footer-col-register">
                        <FooterMenuColumn
                            location="footer_column_3"
                            renderTitle={columnTitle}
                            listClassName="pc-footer-nav"
                            linkClassName="pc-footer-item"
                        />
                        <div className="pc-footer-register">
                            <p className="pc-footer-text pc-footer-text--compact">{subscribeText}</p>
                            {subscribed ? (
                                <p role="status" className="pc-footer-subscribe-success">Thank you for subscribing!</p>
                            ) : (
                                <form className="pc-footer-form" onSubmit={handleNewsletterSubmit} aria-label="Newsletter">
                                    <div className="pc-footer-form-field">
                                        <label className="pc-footer-form-label" htmlFor="pc-footer-email">
                                            Email address
                                        </label>
                                        <input
                                            id="pc-footer-email"
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                            autoComplete="email"
                                            placeholder="Email address"
                                            className="pc-footer-form-input"
                                        />
                                    </div>
                                    <button type="submit" className="pc-btn-primary pc-footer-form-btn">
                                        JOIN
                                    </button>
                                </form>
                            )}
                        </div>
                    </section>
                </div>

                <div className="pc-footer-bar">
                    <p className="pc-footer-meta">{copyright || `© ${year} Sellio. All rights reserved.`}</p>
                    <MenuNav
                        location="footer_bottom_bar"
                        flat
                        className="pc-footer-legal"
                        linkClassName="pc-footer-legal-link"
                    />
                </div>
            </div>
        </footer>
    );
};
