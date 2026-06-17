'use client';
import React, { useState } from 'react';
import type { ServiceListing } from '@sellio/types';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { useMenu, useMenuTitle } from '@/components/menu/MenuProvider';
import { MenuLink } from '@/components/menu/MenuLink';
import { useMenuContext } from '@/components/menu/MenuProvider';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useServicesThemeLink } from '@/themes/services/shared/useServicesThemeLink';
import {
  getProviderRating,
  getServiceCategoryLabel,
  getServiceImage,
  getServicePriceLabel,
} from '@/themes/services/shared/service-utils';

export { getServiceCategoryLabel };

export const MarketplaceHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const themeLink = useServicesThemeLink();
  const brandLabel = useThemeContent('header.brand_label', 'ServiceConnect');
  const connectIndex = brandLabel.toLowerCase().indexOf('connect');
  const brandPrimary = connectIndex >= 0 ? brandLabel.slice(0, connectIndex) : brandLabel;
  const brandSecondary = connectIndex >= 0 ? brandLabel.slice(connectIndex) : '';

  return (
    <header className="sm-header">
      <div className="sm-logo">
        <a href={themeLink('/')} style={{ color: 'inherit', textDecoration: 'none' }}>
          {brandPrimary}<span>{brandSecondary}</span>
        </a>
      </div>
      
      {/* Mobile Hamburger Trigger */}
      <button 
        className={`sm-hamburger ${isOpen ? 'sm-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        id="sm-hamburger-toggle"
      >
        <span className="sm-hamburger-bar"></span>
        <span className="sm-hamburger-bar"></span>
        <span className="sm-hamburger-bar"></span>
      </button>
      

      <div className={`sm-nav-panel ${isOpen ? 'sm-nav-open' : ''}`}>
        <MenuNav
          location="main_header"
          flat
          className="sm-nav"
          linkClassName="sm-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={hashAwareNavItemRenderer}
        />
        <MenuActionButtons
          linkClassName="sm-btn sm-btn-primary sm-mobile-btn"
          as="button"
          onAction={() => document.getElementById('sm-providers-section')?.scrollIntoView({ behavior: 'smooth' })}
          onNavigate={() => setIsOpen(false)}
        />
      </div>

      <div className="sm-desktop-btn-container">
        <MenuActionButtons
          linkClassName="sm-btn sm-btn-primary sm-desktop-btn"
          as="button"
          onAction={() => document.getElementById('sm-providers-section')?.scrollIntoView({ behavior: 'smooth' })}
        />
      </div>
    </header>
  );
};

export const SmCategoryCard = ({ title, icon, onClick, active }: { title: string; icon: string; onClick?: () => void; active?: boolean }) => (
    <div
      className="sm-category-card"
      onClick={onClick}
      style={active ? { borderColor: 'var(--sm-primary)', background: 'var(--sm-primary-light)' } : {}}
    >
        <div className="sm-category-icon">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={icon} />
          </svg>
        </div>
        <h5 style={{ fontWeight: 700, margin: 0, fontSize: '1.05rem' }}>{title}</h5>
    </div>
);

interface SmProviderCardProps {
  name?: string;
  title?: string;
  rating?: string | number;
  image?: string;
  service?: ServiceListing;
  onHire?: (service: ServiceListing) => void;
}

export const SmProviderCard = ({ name, title, rating, image, service, onHire }: SmProviderCardProps) => {
  const themeLink = useServicesThemeLink();
  const isDynamic = !!service;
  const displayName = isDynamic ? service.title : name;
  const displayTitle = isDynamic
    ? getServiceCategoryLabel(service.professional?.category)
    : title;
  const displayRating = isDynamic ? getProviderRating(service) : rating;
  const displayImage = isDynamic ? getServiceImage(service) : image;
  const isTopPro = isDynamic ? service.status?.is_featured : true;
  const priceLabel = isDynamic ? getServicePriceLabel(service) : null;
  const productHref = isDynamic && service.slug ? themeLink(`/product/${service.slug}`) : null;

  const imageBlock = (
    <>
      <img src={displayImage} alt={displayName || 'Provider'} className="sm-provider-img" />
      {isTopPro && <div className="sm-provider-badge">TOP PRO</div>}
    </>
  );

  const titleBlock = (
    <h5 style={{ fontWeight: 800, marginBottom: '0.25rem', fontSize: '1.25rem', lineClamp: 1, WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', display: '-webkit-box', overflow: 'hidden' }}>{displayName}</h5>
  );

  return (
    <div className="sm-provider-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
            {productHref ? (
              <a href={productHref} className="sm-provider-link" aria-label={`View profile for ${displayName}`}>
                {imageBlock}
              </a>
            ) : imageBlock}
        </div>
        <div style={{ padding: '2rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            {productHref ? (
              <a href={productHref} className="sm-provider-link" aria-label={`View profile for ${displayName}`}>
                {titleBlock}
              </a>
            ) : titleBlock}
            <p style={{ color: 'var(--sm-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>{displayTitle}</p>
            {priceLabel && (
              <p style={{ color: 'var(--sm-primary)', fontWeight: 800, fontSize: '1.1rem', margin: '0.25rem 0' }}>
                {priceLabel} <span style={{ color: 'var(--sm-text-muted)', fontSize: '0.8rem', fontWeight: 400 }}>{service?.pricing?.billing_type?.is_project_based ? '/ project' : '/ hr'}</span>
              </p>
            )}
            <p style={{ color: '#ffc107', fontWeight: 700, marginBottom: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', marginTop: 'auto' }}>
                ★ {displayRating} <span style={{ color: 'var(--sm-text-muted)', fontWeight: 400, fontSize: '0.8rem' }}>(120 reviews)</span>
            </p>
            {productHref && (
              <a href={productHref} className="sm-view-profile">View Profile</a>
            )}
            <button
              type="button"
              className="sm-btn sm-btn-primary hire-btn"
              style={{ width: '100%', marginTop: productHref ? 0 : 'auto' }}
              onClick={() => {
                if (isDynamic && onHire && service) {
                  onHire(service);
                }
              }}
            >
              Hire Now
            </button>
        </div>
    </div>
  );
};

export const SmCategorySkeleton = () => (
  <div className="sm-category-card sm-skeleton" style={{ height: '140px', border: '1px solid var(--sm-border)' }}>
    <div className="sm-skeleton-circle sm-skeleton" style={{ width: '60px', height: '60px', margin: '0 auto 1rem' }}></div>
    <div className="sm-skeleton-text sm-skeleton" style={{ width: '60%', margin: '0 auto' }}></div>
  </div>
);

export const SmProviderSkeleton = () => (
  <div className="sm-provider-card" style={{ height: '420px', border: '1px solid var(--sm-border)', display: 'flex', flexDirection: 'column' }}>
    <div className="sm-skeleton-rect sm-skeleton" style={{ height: '220px', width: '100%' }}></div>
    <div style={{ padding: '2rem 1.5rem', textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div className="sm-skeleton-text sm-skeleton" style={{ width: '75%', margin: '0 auto 0.75rem', height: '1.25rem' }}></div>
      <div className="sm-skeleton-text sm-skeleton" style={{ width: '50%', margin: '0 auto 1.5rem' }}></div>
      <div className="sm-skeleton-text sm-skeleton" style={{ width: '40%', margin: '0 auto 1.5rem' }}></div>
      <div className="sm-skeleton-text sm-skeleton" style={{ width: '100%', margin: '0 auto', height: '2.5rem', borderRadius: '50px' }}></div>
    </div>
  </div>
);

const FOOTER_SOCIAL_ICONS: Record<string, string> = {
  LinkedIn: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  Twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  Instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
  Facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
};

const FOOTER_FALLBACK_COLS = [
  {
    location: 'footer_column_1' as const,
    title: 'Services',
    links: [
      { label: 'Home Repair', href: '/explore?category=home-repair' },
      { label: 'Cleaning', href: '/explore?category=cleaning' },
      { label: 'Plumbing', href: '/explore?category=plumbing' },
      { label: 'Electrical', href: '/explore?category=electrical' },
    ],
  },
  {
    location: 'footer_column_2' as const,
    title: 'Company',
    links: [
      { label: 'About Us', href: '/#about' },
      { label: 'How It Works', href: '/#sm-how-it-works' },
      { label: 'Become a Provider', href: '/explore' },
      { label: 'Contact Us', href: '/#contact' },
    ],
  },
  {
    location: 'footer_column_3' as const,
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/#help' },
      { label: 'Terms of Service', href: '/#terms' },
      { label: 'Privacy Policy', href: '/#privacy' },
      { label: 'Safety Guidelines', href: '/#safety' },
    ],
  },
];

function FooterCol({ location, fallbackTitle, fallbackLinks, themeLink: tl }: {
  location: typeof FOOTER_FALLBACK_COLS[number]['location'];
  fallbackTitle: string;
  fallbackLinks: { label: string; href: string }[];
  themeLink: (path: string) => string;
}) {
  const items = useMenu(location);
  const cmsTitle = useMenuTitle(location);
  const { themeKey } = useMenuContext();
  const title = cmsTitle || fallbackTitle;

  return (
    <div>
      <h6 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h6>
      <nav aria-label={title} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {items.length > 0
          ? items.map((item) => (
              <MenuLink key={`${item.id ?? item.title}-${item.url}`} item={item} themeKey={themeKey} className="sm-footer-link" />
            ))
          : fallbackLinks.map((l) => (
              <a key={l.label} href={tl(l.href)} className="sm-footer-link">{l.label}</a>
            ))
        }
      </nav>
    </div>
  );
}

export const MarketplaceFooter = () => {
    const themeLink = useServicesThemeLink();
    const brandLabel = useThemeContent('header.brand_label', 'ServiceConnect');
    const footerDescription = useThemeContent(
      'footer.description',
      'Your trusted marketplace for local services. Connecting quality professionals with clients who need them.',
    );
    const footerEmail = useThemeContent('footer.email', 'support@serviceconnect.com');
    const socialLinkedIn = useThemeContent('social.linkedin', '');
    const socialTwitter = useThemeContent('social.twitter', '');
    const socialInstagram = useThemeContent('social.instagram', '');
    const socialFacebook = useThemeContent('social.facebook', '');
    const year = new Date().getFullYear();
    const connectIndex = brandLabel.toLowerCase().indexOf('connect');
    const brandPrimary = connectIndex >= 0 ? brandLabel.slice(0, connectIndex) : brandLabel;
    const brandSecondary = connectIndex >= 0 ? brandLabel.slice(connectIndex) : '';

    const socialLinks = [
      { label: 'LinkedIn', href: socialLinkedIn, icon: FOOTER_SOCIAL_ICONS.LinkedIn },
      { label: 'X / Twitter', href: socialTwitter, icon: FOOTER_SOCIAL_ICONS.Twitter },
      { label: 'Instagram', href: socialInstagram, icon: FOOTER_SOCIAL_ICONS.Instagram },
      { label: 'Facebook', href: socialFacebook, icon: FOOTER_SOCIAL_ICONS.Facebook },
    ].filter(({ href }) => href.trim() !== '');

    return (
    <footer className="sm-footer">
        <div className="sm-footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <a href={themeLink('/')} style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '1.25rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--sm-primary)', fontSize: '1.5rem' }}>{brandPrimary}</span>
                  <span style={{ fontWeight: 800, color: 'var(--sm-secondary)', fontSize: '1.5rem' }}>{brandSecondary}</span>
                </a>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                    {footerDescription}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{footerEmail}</p>
                {socialLinks.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    {socialLinks.map(({ label, href, icon }) => (
                      <a key={label} href={href} aria-label={label} className="sm-footer-social" target="_blank" rel="noopener noreferrer">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={icon}/></svg>
                      </a>
                    ))}
                  </div>
                )}
            </div>
            {FOOTER_FALLBACK_COLS.map((col) => (
              <FooterCol
                key={col.location}
                location={col.location}
                fallbackTitle={col.title}
                fallbackLinks={col.links}
                themeLink={themeLink}
              />
            ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
            <span>&copy; {year} {brandLabel}. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <a href={themeLink('/#terms')} className="sm-footer-link" style={{ fontSize: '0.85rem' }}>Terms</a>
              <a href={themeLink('/#privacy')} className="sm-footer-link" style={{ fontSize: '0.85rem' }}>Privacy</a>
            </div>
        </div>
    </footer>
    );
};
