'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import type { VacationRetreatCard } from '../vacation-utils';

export const VacationHeader = () => {
  const themeLink = usePropertyThemeLink();
  const [isOpen, setIsOpen] = useState(false);
  const brandMain = useThemeContent('header.brand_name', 'ESCAPE');
  const brandAccent = useThemeContent('header.brand_accent', 'Node');

  return (
    <header className="pv-header">
      <a href={themeLink('/')} className="pv-logo">
        {brandMain}<span className="pv-logo-accent">{brandAccent}</span>
      </a>

      <button
        className={`pv-hamburger ${isOpen ? 'pv-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        aria-expanded={isOpen}
        id="pv-hamburger-toggle"
      >
        <span className="pv-hamburger-bar" />
        <span className="pv-hamburger-bar" />
        <span className="pv-hamburger-bar" />
      </button>

      <div className={`pv-nav-panel ${isOpen ? 'pv-nav-open' : ''}`}>
        <MenuNav
          location="main_header"
          flat
          className="pv-nav"
          linkClassName="pv-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={defaultNavItemRenderer}
        />
        <MenuActionButtons
          as="button"
          buttonClassName="pv-btn-primary pv-mobile-btn"
          onNavigate={() => setIsOpen(false)}
          renderItem={(item, { className, onNavigate }) => (
            <button type="button" className={`${className} pv-btn-primary--mobile`} onClick={onNavigate}>
              {item.title}
            </button>
          )}
        />
      </div>

      <MenuActionButtons
        as="button"
        buttonClassName="pv-btn-primary pv-desktop-btn"
        renderItem={(item, { className, onNavigate }) => (
          <button type="button" className={`${className} pv-btn-primary--desktop`} onClick={onNavigate} id="pv-btn-header-book">
            {item.title}
          </button>
        )}
      />
    </header>
  );
};

type RetreatCardProps = Pick<VacationRetreatCard, 'title' | 'location' | 'price' | 'rating' | 'image'>;

export function RetreatBentoCard({ title, location, price, rating, image }: RetreatCardProps) {
  const verifiedLabel = useThemeContent('card.verified_label', 'Verified Retreat');
  const ctaLabel = useThemeContent('card.cta_label', 'Book Now →');
  const pricePeriod = useThemeContent('card.price_period', '/night');

  return (
    <div className="pv-retreat-card">
      <div className="pv-card-img-wrapper">
        <img src={image} alt={title} className="pv-card-img" />
        <div className="pv-card-rating">
          <span aria-hidden="true">★</span> {rating}
        </div>
      </div>
      <div className="pv-card-body">
        <div className="pv-mono pv-card-verified-label">{verifiedLabel}</div>
        <h3 className="pv-card-title">{title}</h3>
        <div className="pv-card-location">{location}</div>
        <div className="pv-card-footer-row">
          <div className="pv-card-price">
            {price}<span className="pv-card-price-period">{pricePeriod}</span>
          </div>
          <div className="pv-card-cta pv-mono">{ctaLabel}</div>
        </div>
      </div>
    </div>
  );
}

export const ExperienceStats = ({ value, label }: { value: string; label: string }) => (
  <div className="pv-stat-item">
    <div className="pv-stat-value">{value}</div>
    <div className="pv-mono pv-stat-label">{label}</div>
  </div>
);

export const EscapeFooter = () => {
  const themeLink = usePropertyThemeLink();
  const copyright = useThemeContent('footer.copyright', '');
  const year = new Date().getFullYear();

  return (
    <footer className="pv-footer">
      <div className="pv-footer-grid">
        <div>
          <a href={themeLink('/')} className="pv-logo pv-footer-logo">ESCAPENODE</a>
          <p className="pv-footer-desc">
            Discover the world's finest vacation retreats, verified by local experts and curated for discerning travelers.
          </p>
        </div>
        <FooterMenuColumn
          location="footer_column_1"
          renderTitle={(title) => <div className="pv-mono pv-footer-col-title">{title}</div>}
          listClassName="pv-footer-link-group"
          linkClassName="pv-footer-link"
        />
        <FooterMenuColumn
          location="footer_column_2"
          renderTitle={(title) => <div className="pv-mono pv-footer-col-title">{title}</div>}
          listClassName="pv-footer-link-group"
          linkClassName="pv-footer-link"
        />
        <FooterMenuColumn
          location="footer_column_3"
          renderTitle={(title) => <div className="pv-mono pv-footer-col-title">{title}</div>}
          listClassName="pv-footer-link-group"
          linkClassName="pv-footer-link"
        />
      </div>
      <div className="pv-footer-bottom">
        <div className="pv-mono pv-footer-copyright">
          {copyright || `© ${year} Sellio. All rights reserved.`}
        </div>
        <div className="pv-footer-socials">
          <MenuNav
            location="social_footer"
            flat
            linkClassName="pv-mono"
            renderItem={(item, { href, className, onNavigate }) => (
              <span className={`${className} pv-social-link`}>
                <a href={href} onClick={onNavigate}>{item.title}</a>
              </span>
            )}
          />
        </div>
      </div>
    </footer>
  );
};
