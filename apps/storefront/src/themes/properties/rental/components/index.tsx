'use client';

export { PageNav } from './PageNav';
export type { PageNavCrumb } from './PageNav';

import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { useRentalThemeLink } from '../hooks/useRentalThemeLink';

export const RentalHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const themeLink = useRentalThemeLink();

  return (
    <header className="pr-header">
      <a href={themeLink('/')} className="pr-logo" aria-label="RentEase home">
        Rent<span className="pr-logo__mark">Ease</span>
      </a>

      <button
        className={`pr-hamburger ${isOpen ? 'pr-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
        id="pr-hamburger-toggle"
        type="button"
      >
        <span className="pr-hamburger-bar" />
        <span className="pr-hamburger-bar" />
        <span className="pr-hamburger-bar" />
      </button>

      <div className={`pr-nav-panel ${isOpen ? 'pr-nav-open' : ''}`}>
        <MenuNav
          location="main_header"
          flat
          className="pr-nav"
          linkClassName="pr-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={defaultNavItemRenderer}
        />
        <MenuActionButtons
          as="button"
          buttonClassName="pr-btn-primary pr-mobile-auth-btn"
          onNavigate={() => setIsOpen(false)}
          renderItem={(item, { className, onNavigate }) => (
            <button type="button" className={className} onClick={onNavigate}>
              {item.title}
            </button>
          )}
        />
      </div>

      <MenuActionButtons
        as="button"
        buttonClassName="pr-btn-primary pr-desktop-auth-btn"
        renderItem={(item, { className, onNavigate }) => (
          <button type="button" className={className} onClick={onNavigate}>
            {item.title}
          </button>
        )}
      />
    </header>
  );
};

function StarRating({ rating }: { rating: number }) {
  const filled = Math.floor(rating);
  return (
    <span className="pr-rent-card__rating" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={index < filled ? 'var(--pr-coral)' : 'var(--pr-border)'}
          aria-hidden="true"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </span>
  );
}

export const LeaseUnitCard = ({
  title,
  price,
  type,
  location,
  beds,
  baths,
  sqft,
  rating = 4.8,
  reviews = 0,
  image,
  scarcityLabel,
  onClick,
}: {
  title: string;
  price: string;
  type: string;
  location: string;
  beds: string;
  baths: string;
  sqft: string;
  rating?: number;
  reviews?: number;
  image: string;
  scarcityLabel?: string | null;
  onClick?: () => void;
}) => (
  <article
    className={`pr-rent-card ${onClick ? 'pr-rent-card--clickable' : ''}`}
    onClick={onClick}
    onKeyDown={
      onClick
        ? (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onClick();
            }
          }
        : undefined
    }
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
  >
    <div className="pr-card-img-wrapper">
      <img src={image} alt={title} className="pr-card-img" loading="lazy" />
      <span className="pr-card-type-badge">{type}</span>
      {scarcityLabel && <span className="pr-scarcity-badge">{scarcityLabel}</span>}
      <span className="pr-card-rating-pill">{rating.toFixed(1)} â˜…</span>
    </div>
    <div className="pr-rent-card__body">
      <div className="pr-rent-card__top">
        <p className="pr-rent-card__price">
          {price}
          <span> /mo</span>
        </p>
        <div>
          <StarRating rating={rating} />
          {reviews > 0 && <span className="pr-rent-card__reviews">({reviews})</span>}
        </div>
      </div>
      <h3 className="pr-rent-card__title">{title}</h3>
      <p className="pr-rent-card__location">{location}</p>
      <div className="pr-rent-card__footer">
        <ul className="pr-rent-card__stats">
          <li className="pr-rent-card__stat">{beds} bed</li>
          <li className="pr-rent-card__stat">{baths} bath</li>
          <li className="pr-rent-card__stat">{sqft}</li>
        </ul>
        <span className="pr-rent-card__verified">Verified listing</span>
      </div>
    </div>
  </article>
);

export const TrustMetrics = ({ value, label }: { value: string; label: string }) => (
  <div className="pr-trust-metric">
    <div className="pr-trust-metric__value">{value}</div>
    <div className="pr-trust-metric__label">{label}</div>
  </div>
);

export const TenantFooter = () => {
  const themeLink = useRentalThemeLink();
  return (
  <footer className="pr-footer">
    <div className="pr-footer-grid">
      <div>
        <a href={themeLink('/')} className="pr-logo pr-logo--footer">
          Rent<span className="pr-logo__mark">Ease</span>
        </a>
        <p className="pr-footer__tagline">
          Monthly rentals made simple â€” verified listings, transparent pricing, and digital lease
          tools built for tenants and landlords who lease month to month.
        </p>
      </div>
      <FooterMenuColumn
        location="footer_column_1"
        renderTitle={(title) => <div className="pr-footer__title">{title}</div>}
        linkClassName="pr-footer-link"
      />
      <FooterMenuColumn
        location="footer_column_2"
        renderTitle={(title) => <div className="pr-footer__title">{title}</div>}
        linkClassName="pr-footer-link"
      />
      <FooterMenuColumn
        location="footer_column_3"
        renderTitle={(title) => <div className="pr-footer__title">{title}</div>}
        linkClassName="pr-footer-link"
      />
    </div>
    <div className="pr-footer-bottom">
      <div className="pr-footer__copyright">© 2026 Sellio. All rights reserved.</div>
      <div className="pr-footer-social">
        <MenuNav
          location="social_footer"
          flat
          linkClassName="pr-footer-social__link"
          renderItem={(item, { href, className, onNavigate }) => (
            <a href={href} className={className} onClick={onNavigate}>
              {item.title}
            </a>
          )}
        />
      </div>
    </div>
  </footer>
  );
};
