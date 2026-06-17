'use client';
import React from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

const PinIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const CameraIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/>
    <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
  </svg>
);

const ShieldCheckIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
  </svg>
);

const MailIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

interface HeaderProps {
  onPostClick: () => void;
  onLocationClick: () => void;
  locationName: string;
  homeHref?: string;
}

export const LocalHeader = ({ onPostClick, onLocationClick, locationName, homeHref = '/' }: HeaderProps) => {
  const brandName = useThemeContent('brand.name', 'NeighborHood');
  const postLabel = useThemeContent('header.post_cta', 'Post an Item');

  return (
    <header className="cl-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <a href={homeHref} className="cl-logo">
          <span className="cl-logo-icon" style={{ color: 'var(--cl-primary-blue)', animation: 'none' }}>
            <PinIcon size={22} />
          </span>
          {brandName}
        </a>
        <button type="button" className="cl-location-picker" onClick={onLocationClick} aria-label="Change location radius">
          <PinIcon size={13} />
          <span>{locationName}</span>
        </button>
      </div>

      <div className="cl-nav-panel">
        <MenuNav
          location="main_header"
          flat
          className="cl-nav"
          linkClassName="cl-nav-link d-none d-md-block"
          renderItem={defaultNavItemRenderer}
        />
        <MenuActionButtons
          buttonClassName="cl-btn-post"
          as="button"
          onAction={onPostClick}
          renderItem={(item, { className, onNavigate }) => (
            <button type="button" className={className} onClick={() => { onPostClick(); onNavigate?.(); }}>
              <CameraIcon /> {item.title || postLabel}
            </button>
          )}
        />
      </div>
    </header>
  );
};

interface LocalCardProps {
  title: string;
  price: string;
  distance: string;
  neighborhood: string;
  image: string;
  sellerInitials: string;
  sellerAvatar?: string | null;
  conditionLabel: string;
  isFocused: boolean;
  onClick: () => void;
  onMessageClick: () => void;
}

export const LocalCard = ({ title, price, distance, neighborhood, image, sellerInitials, sellerAvatar, conditionLabel, isFocused, onClick, onMessageClick }: LocalCardProps) => (
  <div className={`cl-card-listing ${isFocused ? 'cl-focused' : ''}`} onClick={onClick}>
    <div className="cl-card-img-wrap">
      <img src={image} className="cl-card-img" alt={title} />
    </div>

    <div className="cl-card-info">
      <h6 className="cl-card-title">{title}</h6>
      <div className="cl-price-row">
        <span className="cl-price">{price}</span>
        <span className="cl-badge">{conditionLabel}</span>
      </div>
      <div className="cl-geo-text">
        <PinIcon size={11} />
        {distance} mi · {neighborhood}
      </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'center' }}>
      {sellerAvatar ? (
        <img src={sellerAvatar} alt={sellerInitials} className="cl-avatar" style={{ width: '26px', height: '26px', objectFit: 'cover' }} />
      ) : (
        <div className="cl-avatar" style={{ fontSize: '0.75rem', width: '26px', height: '26px' }}>{sellerInitials}</div>
      )}
      <button
        className="cl-action-btn"
        title="Contact Seller"
        style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '50%', cursor: 'pointer', color: 'var(--cl-primary-blue)' }}
        onClick={(e) => { e.stopPropagation(); onMessageClick(); }}
      >
        <MailIcon size={12} />
      </button>
    </div>
  </div>
);

export const LocalFooter = () => {
  const themeLink = useClassifiedsThemeLink();
  const brandName = useThemeContent('brand.name', 'NeighborHood');
  const footerDescription = useThemeContent('footer.description', 'Connect, trade, and keep your neighborhood vibrant. Verified local listings with secure neighbor-to-neighbor exchanges.');
  const year = new Date().getFullYear();
  const copyright = useThemeContent('footer.copyright', `© ${year} ${brandName}. All rights reserved.`);
  const socialFacebook = useThemeContent('social.facebook', '');
  const socialTwitter = useThemeContent('social.twitter', '');
  const socialInstagram = useThemeContent('social.instagram', '');
  const socialNextdoor = useThemeContent('social.nextdoor', '');

  return (
  <footer className="cl-footer">
    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
      <div style={{ maxWidth: '320px' }}>
        <a href={themeLink('/')} className="cl-logo" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
          <span className="cl-logo-icon" style={{ color: 'var(--cl-primary-blue)', animation: 'none' }}>
            <PinIcon size={20} />
          </span>
          {brandName}
        </a>
        <p style={{ color: 'var(--cl-text-muted)', fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.6, marginTop: '0.75rem' }}>
          {footerDescription}
        </p>
        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem' }}>
          {([
            { label: 'Facebook', href: socialFacebook, path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
            { label: 'X / Twitter', href: socialTwitter, path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
            { label: 'Instagram', href: socialInstagram, path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z' },
            { label: 'Nextdoor', href: socialNextdoor, path: 'M12 0a12 12 0 1 0 0 24A12 12 0 0 0 12 0zm1 17H7v-2h4V9H7V7h6v10z' },
          ] as { label: string; href: string; path: string }[])
            .filter(({ href }) => href.trim() !== '')
            .map(({ label, href, path }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid var(--cl-border)', color: 'var(--cl-text-muted)', transition: 'all 0.2s', flexShrink: 0 }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'var(--cl-primary-blue)'; el.style.color = 'white'; el.style.borderColor = 'var(--cl-primary-blue)'; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ''; el.style.color = 'var(--cl-text-muted)'; el.style.borderColor = 'var(--cl-border)'; }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={path}/></svg>
              </a>
            ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
        <FooterMenuColumn
          location="footer_column_1"
          titleTag="h4"
          titleStyle={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--cl-text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          listClassName="cl-footer-links"
          linkClassName="cl-footer-link"
        />
        <FooterMenuColumn
          location="footer_column_2"
          titleTag="h4"
          titleStyle={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--cl-text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          listClassName="cl-footer-links"
          linkClassName="cl-footer-link"
        />
      </div>
    </div>
    <div style={{ borderTop: '1.5px solid var(--cl-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontWeight: 600, fontSize: '0.8rem', color: 'var(--cl-text-muted)' }}>
      <span>{copyright}</span>
      <span>Local · Trusted · Verified</span>
    </div>
  </footer>
  );
};

export { PinIcon, ShieldCheckIcon, MailIcon };
