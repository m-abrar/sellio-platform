'use client';
import React, { useState, useEffect } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import { isCartMenuItem } from '@/themes/unifieds/shared/menu-utils';
import { useUnifiedCartCount } from '@/themes/unifieds/shared/useUnifiedCartCount';
import type { ExploreListing, Vertical, VerticalDescriptor } from '@/themes/unifieds/shared/multiVertical';
import type { Category } from '@sellio/types';

const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

const LogoMarkSvg = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <rect x="0" y="0" width="7.5" height="7.5" rx="2" fill="white" />
    <rect x="10.5" y="0" width="7.5" height="7.5" rx="2" fill="white" fillOpacity="0.7" />
    <rect x="0" y="10.5" width="7.5" height="7.5" rx="2" fill="white" fillOpacity="0.7" />
    <rect x="10.5" y="10.5" width="7.5" height="7.5" rx="2" fill="white" fillOpacity="0.4" />
  </svg>
);

const AnnounceCloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const OriginHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const cartCount = useUnifiedCartCount();
  const themeLink = useUnifiedThemeLink();
  const siteName = useThemeContent('site_name', 'Sellio');
  const announcementText = useThemeContent('announcement.text', '');
  const announcementCta = useThemeContent('announcement.cta', '');
  const announcementHref = useThemeContent('announcement.href', '');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showAnnouncement = Boolean(announcementText) && announcementVisible;

  return (
    <>
      {showAnnouncement && (
        <div className="ud-announcement-bar" role="note">
          <div className="ud-announcement-inner">
            <span className="ud-announcement-dot" aria-hidden="true" />
            <span className="ud-announcement-text">{announcementText}</span>
            {announcementCta && announcementHref && (
              <a href={themeLink(announcementHref)} className="ud-announcement-cta">
                {announcementCta}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </a>
            )}
          </div>
          <button
            type="button"
            className="ud-announcement-close"
            aria-label="Dismiss announcement"
            onClick={() => setAnnouncementVisible(false)}
          >
            <AnnounceCloseIcon />
          </button>
        </div>
      )}

      <header className={`ud-header${scrolled ? ' ud-header--scrolled' : ''}`}>
        <a href={themeLink('/')} className="ud-logo ud-logo-mark" style={{ textDecoration: 'none' }}>
          <span className="ud-logo-icon" aria-hidden="true"><LogoMarkSvg /></span>
          <span className="ud-logo-text">{siteName}</span>
        </a>

        <button
            className={`ud-hamburger ${isOpen ? 'ud-hamburger-open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation"
            aria-expanded={isOpen}
            id="ud-hamburger-toggle"
        >
            <span className="ud-hamburger-bar"></span>
            <span className="ud-hamburger-bar"></span>
            <span className="ud-hamburger-bar"></span>
        </button>

        {isOpen && <div className="ud-nav-backdrop" onClick={() => setIsOpen(false)} aria-hidden="true" />}

        <MenuNav
          location="main_header"
          flat
          className={`ud-nav ${isOpen ? 'ud-nav-open' : ''}`}
          linkClassName="ud-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={(item, { href, className, onNavigate }) => (
            <a href={href} className={className} onClick={onNavigate}>
              {isCartMenuItem(item) && <CartIcon />}
              {item.title}
              {isCartMenuItem(item) && cartCount > 0 && (
                <span className="ud-cart-badge">{cartCount}</span>
              )}
            </a>
          )}
        />

        <MenuActionButtons
          as="button"
          buttonClassName="core-btn-primary ud-btn-header ud-mobile-btn"
          onNavigate={() => setIsOpen(false)}
          renderItem={(item, { className, onNavigate }) => (
            <button type="button" className={className} style={{ marginTop: '2rem', width: '100%' }} onClick={onNavigate}>{item.title}</button>
          )}
        />

        <MenuActionButtons
          as="button"
          buttonClassName="core-btn-primary ud-btn-header ud-desktop-btn"
          renderItem={(item, { className, onNavigate }) => (
            <button type="button" className={className} onClick={onNavigate} id="ud-btn-header-access">
              {item.title}
              <ArrowIcon />
            </button>
          )}
        />
      </header>
    </>
  );
};

export const CoreFeatures = () => {
  const kicker = useThemeContent('features.kicker', 'Why choose us');
  const heading = useThemeContent('features.heading', 'Built for buyers and sellers.');
  const f1Title = useThemeContent('features.f1_title', 'Multi-Vertical Commerce');
  const f1Desc = useThemeContent('features.f1_desc', 'Sell products, properties, services, jobs, autos, events, and classifieds — all from one unified platform.');
  const f2Title = useThemeContent('features.f2_title', 'Fast & Responsive');
  const f2Desc = useThemeContent('features.f2_desc', 'Optimized for speed with smooth browsing, lazy-loaded images, and a mobile-first layout on every device.');
  const f3Title = useThemeContent('features.f3_title', 'Seller Analytics');
  const f3Desc = useThemeContent('features.f3_desc', 'Built-in insights to help sellers track performance, manage inventory, and grow their business over time.');

  const features = [
    { icon: <ShoppingBagIcon />, title: f1Title, description: f1Desc },
    { icon: <LightningIcon />,   title: f2Title, description: f2Desc },
    { icon: <BarChartIcon />,    title: f3Title, description: f3Desc },
  ];

  return (
    <section className="ud-features" id="ud-features-section">
      <div className="ud-features-header">
        <div className="ud-mono ud-section-eyebrow">{kicker}</div>
        <h2 className="ud-features-title">{heading}</h2>
      </div>
      <div className="ud-feature-grid">
        {features.map((f, i) => (
          <div key={i} className="ud-feature-card-premium">
            <div className="ud-feature-icon-wrap">{f.icon}</div>
            <h3 className="ud-feature-card-title">{f.title}</h3>
            <p className="ud-feature-card-desc">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export const GlobalTrust = () => {
  const t1 = useThemeContent('trust.t1', 'Secure Payments');
  const t2 = useThemeContent('trust.t2', 'Verified Sellers');
  const t3 = useThemeContent('trust.t3', 'Buyer Protection');
  const t4 = useThemeContent('trust.t4', 'Multi-Vertical Platform');

  return (
    <section className="ud-trust-bar" aria-label="Trust signals">
      <div className="ud-trust-container">
        {[
          { label: t1, icon: <LockIcon /> },
          { label: t2, icon: <CheckIcon /> },
          { label: t3, icon: <ShieldIcon /> },
          { label: t4, icon: <EyeIcon /> },
        ].map(({ label, icon }) => (
          <div key={label} className="ud-trust-item">
            <span className="ud-trust-icon">{icon}</span>
            <span className="ud-mono ud-trust-label">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  linkedin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  twitter: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  ),
};

export const InstitutionalFooter = () => {
  const themeLink = useUnifiedThemeLink();
  const siteName = useThemeContent('site_name', 'Sellio');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="ud-institutional-footer">
        <div className="ud-footer-grid">
            <div>
                <a href={themeLink('/')} className="ud-footer-brand">
                  <span className="ud-footer-brand-icon" aria-hidden="true"><LogoMarkSvg /></span>
                  {siteName}
                </a>
                <p className="ud-footer-tagline">
                    A multi-vertical marketplace for products, properties, services, and more — all in one place.
                </p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                renderTitle={(title) => <div className="ud-mono ud-footer-col-title">{title}</div>}
                listClassName="ud-footer-link-group"
                linkClassName="ud-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                renderTitle={(title) => <div className="ud-mono ud-footer-col-title">{title}</div>}
                listClassName="ud-footer-link-group"
                linkClassName="ud-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_3"
                renderTitle={(title) => <div className="ud-mono ud-footer-col-title">{title}</div>}
                listClassName="ud-footer-link-group"
                linkClassName="ud-footer-link"
            />
        </div>
        <div className="ud-footer-bottom">
            <div className="ud-mono ud-footer-copyright">© {currentYear} {siteName}. All rights reserved.</div>
            <MenuNav
                location="social_footer"
                flat
                className="ud-footer-socials"
                linkClassName="ud-footer-social-link"
                renderItem={(item, { href, className, onNavigate }) => (
                    <a href={href} onClick={onNavigate} className={className} aria-label={item.title} title={item.title}>
                        {SOCIAL_ICONS[item.title.toLowerCase()] ?? item.title}
                    </a>
                )}
            />
        </div>
    </footer>
  );
};

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const BuildingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 22V12h6v10M9 7h1M14 7h1M9 11h1M14 11h1"/></svg>
);
const CarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14l4 4v4a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
);
const BagIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);
const WrenchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
);
const BriefcaseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);
const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const TagIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
);
const GeoIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
);
const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const ChatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const StarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
);
const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const BarChartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
);
const LightningIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const ShoppingBagIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);

const VERTICAL_ICONS: Record<Vertical, React.ReactNode> = {
  properties: <BuildingIcon />,
  autos: <CarIcon />,
  products: <BagIcon />,
  services: <WrenchIcon />,
  jobs: <BriefcaseIcon />,
  events: <CalendarIcon />,
  classifieds: <TagIcon />,
};

// ─── Vertical Module Cards ────────────────────────────────────────────────────

interface VerticalModuleCardsProps {
  verticals: VerticalDescriptor[];
  totals: Partial<Record<Vertical, number>>;
  themeLink: (path: string) => string;
  isLoading?: boolean;
}

export const VerticalModuleCards = ({ verticals, totals, themeLink, isLoading }: VerticalModuleCardsProps) => {
  const eyebrow = useThemeContent('discovery.eyebrow', 'Browse Categories');
  const heading = useThemeContent('discovery.heading', 'Explore the Marketplace');
  const description = useThemeContent('discovery.description', 'Start with any category, then filter into the exact listing you need.');
  const postLabel = useThemeContent('discovery.post_label', 'Post a Listing');

  return (
    <section className="ud-discovery-section">
      <div className="ud-discovery-header">
        <div>
          <div className="ud-discovery-kicker">{eyebrow}</div>
          <h2 className="ud-discovery-title">{heading}</h2>
          <p className="ud-discovery-description">{description}</p>
        </div>
        <a href={themeLink('/listing')} className="ud-discovery-post-btn">
          {postLabel}
          <ArrowIcon />
        </a>
      </div>
      <div className="ud-module-grid">
        {verticals.map((v) => {
          const count = totals[v.key] ?? 0;
          return (
            <a key={v.key} href={themeLink(`/explore?vertical=${v.key}`)} className="ud-module-card" data-vertical={v.key}>
              <span className="ud-module-icon" aria-hidden="true">
                {VERTICAL_ICONS[v.key]}
              </span>
              {isLoading ? (
                <div className="ud-module-count--skeleton" aria-hidden="true" />
              ) : (
                <span className="ud-module-count">{count.toLocaleString()}</span>
              )}
              <span className="ud-module-label">{v.label}</span>
              <span className="ud-module-stat">{count === 1 ? 'listing' : 'listings'}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
};

// ─── Property Card ────────────────────────────────────────────────────────────

interface PropertyCardProps {
  listing: ExploreListing;
  themeLink: (path: string) => string;
}

export const PropertyCard = ({ listing, themeLink }: PropertyCardProps) => (
  <a href={themeLink(listing.href)} className="ud-property-card">
    <div className="ud-property-card__img-wrap">
      <img src={listing.image} alt={listing.title} loading="lazy" className="ud-property-card__img" />
      {listing.listingType && (
        <span className={`ud-property-card__badge${listing.listingType === 'For Rent' ? ' ud-property-card__badge--rent' : ''}`}>
          {listing.listingType}
        </span>
      )}
    </div>
    <div className="ud-property-card__body">
      <div className="ud-property-card__price">{listing.price}</div>
      <h3 className="ud-property-card__title">{listing.title}</h3>
      {listing.specs && (
        <div className="ud-property-card__specs">
          {listing.specs.beds && <span>{listing.specs.beds} bd</span>}
          {listing.specs.baths && <span>{listing.specs.baths} ba</span>}
          {listing.specs.area && <span>{listing.specs.area}</span>}
        </div>
      )}
      {listing.specs?.location && (
        <div className="ud-property-card__location">
          <GeoIcon /> {listing.specs.location}
        </div>
      )}
    </div>
  </a>
);

// ─── Auto Card ────────────────────────────────────────────────────────────────

export const AutoCard = ({ listing, themeLink }: PropertyCardProps) => (
  <a href={themeLink(listing.href)} className="ud-auto-card">
    <div className="ud-auto-card__img-wrap">
      <img src={listing.image} alt={listing.title} loading="lazy" className="ud-auto-card__img" />
    </div>
    <div className="ud-auto-card__body">
      <div className="ud-mono ud-auto-card__category">{listing.category}</div>
      <h3 className="ud-auto-card__title">{listing.title}</h3>
      <div className="ud-auto-card__price">{listing.price}</div>
      {listing.specs && (
        <div className="ud-auto-card__badges">
          {listing.specs.mileage && <span className="ud-auto-badge">{listing.specs.mileage}</span>}
          {listing.specs.transmission && <span className="ud-auto-badge">{listing.specs.transmission}</span>}
        </div>
      )}
    </div>
  </a>
);

// ─── Event Card ───────────────────────────────────────────────────────────────

function formatEventDate(dateStr?: string): { month: string; day: string } | null {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    return {
      month: d.toLocaleString('en', { month: 'short' }).toUpperCase(),
      day: String(d.getDate()),
    };
  } catch {
    return null;
  }
}

export const EventCard = ({ listing, themeLink }: PropertyCardProps) => {
  const dateParts = formatEventDate(listing.date);
  return (
    <a href={themeLink(listing.href)} className="ud-event-card">
      <div className="ud-event-card__img-wrap">
        <img src={listing.image} alt={listing.title} loading="lazy" className="ud-event-card__img" />
        {dateParts && (
          <div className="ud-event-card__date-badge" aria-label={listing.date}>
            <span className="ud-event-card__date-month">{dateParts.month}</span>
            <span className="ud-event-card__date-day">{dateParts.day}</span>
          </div>
        )}
      </div>
      <div className="ud-event-card__body">
        <div className="ud-mono ud-event-card__category">{listing.category}</div>
        <h3 className="ud-event-card__title">{listing.title}</h3>
        <div className="ud-event-card__meta">
          {listing.specs?.location && (
            <span className="ud-event-card__location"><GeoIcon /> {listing.specs.location}</span>
          )}
          <span className="ud-event-card__price">{listing.price}</span>
        </div>
        {listing.specs?.ticketsLeft && (
          <span className="ud-event-card__tickets">{listing.specs.ticketsLeft} tickets left</span>
        )}
      </div>
    </a>
  );
};

// ─── Job List Item ────────────────────────────────────────────────────────────

export const JobListItem = ({ listing, themeLink }: PropertyCardProps) => (
  <a href={themeLink(listing.href)} className="ud-job-list-item">
    <div className="ud-job-list-item__logo">
      {listing.specs?.companyLogo ? (
        <img src={listing.specs.companyLogo} alt={listing.specs.company || ''} loading="lazy" />
      ) : (
        <span aria-hidden="true">{(listing.specs?.company || listing.title).charAt(0)}</span>
      )}
    </div>
    <div className="ud-job-list-item__body">
      <h3 className="ud-job-list-item__title">{listing.title}</h3>
      <div className="ud-job-list-item__meta">
        {listing.specs?.company && <span>{listing.specs.company}</span>}
        {listing.specs?.location && <span><GeoIcon /> {listing.specs.location}</span>}
      </div>
    </div>
    <div className="ud-job-list-item__right">
      {listing.specs?.salary && <span className="ud-job-list-item__salary">{listing.specs.salary}</span>}
      {listing.listingType && <span className="ud-job-badge">{listing.listingType}</span>}
    </div>
  </a>
);

// ─── Classified Mini Card ─────────────────────────────────────────────────────

export const ClassifiedMiniCard = ({ listing, themeLink }: PropertyCardProps) => (
  <a href={themeLink(listing.href)} className="ud-classified-list-item">
    <div className="ud-classified-list-item__img-wrap">
      <img src={listing.image} alt={listing.title} loading="lazy" className="ud-classified-list-item__img" />
    </div>
    <div className="ud-classified-list-item__body">
      <h3 className="ud-classified-list-item__title">{listing.title}</h3>
      {listing.category && <span className="ud-classified-list-item__cat">{listing.category}</span>}
    </div>
    <span className="ud-classified-list-item__price">{listing.price}</span>
  </a>
);

// ─── Service Category Card ────────────────────────────────────────────────────

interface ServiceCategoryCardProps {
  category: Category;
  themeLink: (path: string) => string;
}

export const ServiceCategoryCard = ({ category, themeLink }: ServiceCategoryCardProps) => (
  <a href={themeLink(`/explore?vertical=services&category=${category.slug}`)} className="ud-svc-card">
    <div className="ud-svc-card__icon-wrap">
      <WrenchIcon />
    </div>
    <h3 className="ud-svc-card__title">{category.title}</h3>
    <p className="ud-svc-card__description">{category.description || 'Find verified experts.'}</p>
  </a>
);

// ─── Jobs + Classifieds Split Panel ──────────────────────────────────────────

interface SplitPanelProps {
  jobs: ExploreListing[];
  classifieds: ExploreListing[];
  themeLink: (path: string) => string;
}

export const JobsClassifiedsSplitPanel = ({ jobs, classifieds, themeLink }: SplitPanelProps) => {
  const jobsTitle = useThemeContent('jobs_panel.title', 'Careers');
  const jobsCta = useThemeContent('jobs_panel.cta', 'Search all');
  const classifiedsTitle = useThemeContent('classifieds_panel.title', 'Top Deals');
  const classifiedsCta = useThemeContent('classifieds_panel.cta', 'Browse all');

  return (
    <section className="ud-split-section">
      <div className="ud-split-panel-grid">
        {jobs.length > 0 && (
          <div className="ud-split-panel">
            <div className="ud-split-panel__head">
              <h2 className="ud-split-panel__title">{jobsTitle}</h2>
              <a href={themeLink('/explore?vertical=jobs')} className="ud-split-panel__link">{jobsCta}</a>
            </div>
            <div className="ud-jobs-list">
              {jobs.slice(0, 4).map((job) => (
                <JobListItem key={job.id} listing={job} themeLink={themeLink} />
              ))}
            </div>
          </div>
        )}
        {classifieds.length > 0 && (
          <div className="ud-split-panel">
            <div className="ud-split-panel__head">
              <h2 className="ud-split-panel__title">{classifiedsTitle}</h2>
              <a href={themeLink('/explore?vertical=classifieds')} className="ud-split-panel__link">{classifiedsCta}</a>
            </div>
            <div className="ud-classifieds-list">
              {classifieds.slice(0, 4).map((item) => (
                <ClassifiedMiniCard key={item.id} listing={item} themeLink={themeLink} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// ─── Popular Categories Section ───────────────────────────────────────────────

interface PopularCategoriesProps {
  categories: Category[];
  themeLink: (path: string) => string;
}

export const PopularCategoriesSection = ({ categories, themeLink }: PopularCategoriesProps) => {
  const eyebrow = useThemeContent('categories.eyebrow', 'Top Categories');
  const heading = useThemeContent('categories.heading', 'Popular Categories');
  const subheading = useThemeContent('categories.subheading', 'Jump into curated marketplace lanes.');
  const top = categories.slice(0, 8);
  if (top.length === 0) return null;

  return (
    <section className="ud-taxonomy-section">
      <div className="ud-taxonomy-header">
        <div>
          <div className="ud-discovery-kicker">{eyebrow}</div>
          <h2 className="ud-taxonomy-title">{heading}</h2>
          <p className="ud-taxonomy-sub">{subheading}</p>
        </div>
      </div>
      <div className="ud-taxonomy-grid">
        {top.map((cat) => (
          <a key={cat.id} href={themeLink(`/explore?category=${cat.slug}`)} className="ud-taxonomy-chip">
            {cat.title}
          </a>
        ))}
      </div>
    </section>
  );
};

// ─── How It Works ─────────────────────────────────────────────────────────────

export const HowItWorks = () => {
  const kicker = useThemeContent('hiw.kicker', 'Simple process');
  const heading = useThemeContent('hiw.heading', 'How the marketplace works');
  const description = useThemeContent('hiw.description', 'Buying and selling is simple, safe, and free to start.');
  const step1Title = useThemeContent('hiw.step_1_title', 'Browse');
  const step1Desc = useThemeContent('hiw.step_1_desc', 'Search thousands of verified listings across every category.');
  const step2Title = useThemeContent('hiw.step_2_title', 'Connect');
  const step2Desc = useThemeContent('hiw.step_2_desc', 'Message sellers directly, ask questions, and negotiate terms.');
  const step3Title = useThemeContent('hiw.step_3_title', 'Transact');
  const step3Desc = useThemeContent('hiw.step_3_desc', 'Complete your purchase securely through our trusted checkout.');
  const step4Title = useThemeContent('hiw.step_4_title', 'Review');
  const step4Desc = useThemeContent('hiw.step_4_desc', 'Leave feedback to help other buyers and reward great sellers.');

  const steps = [
    { step: '01', icon: <SearchIcon />, title: step1Title, desc: step1Desc },
    { step: '02', icon: <ChatIcon />,   title: step2Title, desc: step2Desc },
    { step: '03', icon: <ShieldIcon />, title: step3Title, desc: step3Desc },
    { step: '04', icon: <StarIcon />,   title: step4Title, desc: step4Desc },
  ];

  return (
    <section className="ud-hiw-section" id="ud-hiw-section">
      <div className="ud-hiw-header">
        <div>
          <div className="ud-hiw-kicker">{kicker}</div>
          <h2 className="ud-hiw-title">{heading}</h2>
        </div>
        <p className="ud-hiw-description">{description}</p>
      </div>
      <div className="ud-hiw-grid">
        {steps.map((s) => (
          <div key={s.step} className="ud-hiw-card">
            <span className="ud-hiw-step" aria-hidden="true">{s.step}</span>
            <span className="ud-hiw-icon" aria-hidden="true">{s.icon}</span>
            <h3 className="ud-hiw-card-title">{s.title}</h3>
            <p className="ud-hiw-card-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── Hero Mosaic ──────────────────────────────────────────────────────────────

interface HeroMosaicProps {
  listings: ExploreListing[];
}

const MOSAIC_VERTICAL_LABELS: Record<string, string> = {
  properties: 'Property', autos: 'Auto', jobs: 'Job',
  events: 'Event', products: 'Product', services: 'Service', classifieds: 'Classified',
};

export const HeroMosaic = ({ listings }: HeroMosaicProps) => {
  const images = listings
    .filter((l) => l.image && !l.image.includes('placeholder'))
    .slice(0, 4);

  const slots = [0, 1, 2, 3].map((i) => images[i] || null);

  const renderSlot = (idx: number, size: 'lg' | 'sm') => (
    <div key={idx} className={`ud-hero-mosaic__item ud-hero-mosaic__item--${size}`}>
      {slots[idx] ? (
        <>
          <img src={slots[idx]!.image} alt="" className="ud-hero-mosaic__img" loading={idx === 0 ? 'eager' : 'lazy'} />
          <div className="ud-hero-mosaic__overlay">
            <div className="ud-hero-mosaic__meta">
              <span className="ud-hero-mosaic__title">{slots[idx]!.title}</span>
              <div className="ud-hero-mosaic__footer">
                <span className="ud-hero-mosaic__badge">
                  {MOSAIC_VERTICAL_LABELS[slots[idx]!.vertical] ?? slots[idx]!.vertical}
                </span>
                {slots[idx]!.price && (
                  <span className="ud-hero-mosaic__price">{slots[idx]!.price}</span>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="ud-hero-mosaic__placeholder" />
      )}
    </div>
  );

  return (
    <div className="ud-hero-mosaic" aria-hidden="true">
      <div className="ud-hero-mosaic__col">
        {renderSlot(0, 'lg')}
        {renderSlot(1, 'sm')}
      </div>
      <div className="ud-hero-mosaic__col ud-hero-mosaic__col--offset">
        {renderSlot(2, 'sm')}
        {renderSlot(3, 'lg')}
      </div>
    </div>
  );
};

// ─── Explore Loading Shell ────────────────────────────────────────────────────

export const ExploreLoadingShell = () => (
  <main className="ud-explore-page" aria-busy="true">
    <div className="ud-explore-header">
      <div className="ud-skeleton ud-skeleton--eyebrow" />
      <div className="ud-skeleton ud-skeleton--title" />
      <div className="ud-skeleton ud-skeleton--body" />
    </div>
    <div className="ud-explore-verticals">
      {[1, 2, 3, 4, 5].map((i) => <div key={i} className="ud-skeleton ud-skeleton--chip" />)}
    </div>
    <div className="ud-listings-grid" aria-label="Loading listings">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="ud-listing-card ud-listing-skeleton">
          <div className="ud-listing-image-wrap" />
          <div className="ud-listing-body">
            <span /><strong /><em />
          </div>
        </div>
      ))}
    </div>
  </main>
);

export { HeroSearchModule } from './HeroSearchModule';
export type { HeroSearchModuleProps } from './HeroSearchModule';
