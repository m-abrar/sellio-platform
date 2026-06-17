'use client';
import React, { useState } from 'react';
import { EventListing } from '@sellio/types';
import Link from 'next/link';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { MenuLink } from '@/components/menu/MenuLink';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';
import { useMenu, useMenuTitle, useMenuContext } from '@/components/menu/MenuProvider';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';
import {
  formatEventDateShort,
  formatEventPrice,
  getCorporateEventImage,
  getEventLocationLabel,
} from '@/themes/events/shared/event-utils';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const themeLink = useEventsThemeLink();
  const brandLabel = useThemeContent('header.brand_label', 'SummitPro');
  const brandHighlight = useThemeContent('header.brand_highlight', 'Pro');
  const brandPrefix = brandLabel.endsWith(brandHighlight)
    ? brandLabel.slice(0, -brandHighlight.length)
    : brandLabel;

  return (
    <header className="ecc-header">
      <div className="ecc-header-container">
        <Link href={themeLink('/')} style={{ textDecoration: 'none' }}>
          <div className="ecc-logo">
            {brandPrefix}<span>{brandHighlight}</span>
          </div>
        </Link>
        
        <button 
            className={`ecc-hamburger ${isOpen ? 'ecc-hamburger-open' : ''}`} 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation"
            id="ecc-hamburger-toggle"
        >
            <span className="ecc-hamburger-bar"></span>
            <span className="ecc-hamburger-bar"></span>
            <span className="ecc-hamburger-bar"></span>
        </button>

        <MenuNav
          location="main_header"
          flat
          className={`ecc-nav ${isOpen ? 'ecc-nav-open' : ''}`}
          linkClassName="ecc-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={hashAwareNavItemRenderer}
        />

        <MenuActionButtons
          location="action_buttons"
          className="ecc-mobile-btn"
          linkClassName="ecc-btn-primary ecc-mobile-btn"
          onNavigate={() => setIsOpen(false)}
          renderItem={(item, { href, className, onNavigate }) => (
            <Link href={href} style={{ width: '100%', textDecoration: 'none' }} onClick={onNavigate}>
              <button className={className} style={{ width: '100%', borderRadius: '100px', padding: '1rem 3rem', marginTop: '2rem' }}>
                {item.title}
              </button>
            </Link>
          )}
        />

        <MenuActionButtons
          location="action_buttons"
          className="ecc-desktop-btn"
          linkClassName="ecc-btn-primary"
          renderItem={(item, { href, className, onNavigate }) => (
            <Link href={href} style={{ textDecoration: 'none' }} className="ecc-desktop-btn" onClick={onNavigate}>
              <button className={className} id="ecc-btn-header-register">
                {item.title}
              </button>
            </Link>
          )}
        />
      </div>
    </header>
  );
};

const FOOTER_FALLBACK_NAV = [
  { label: 'Browse Events', href: '/explore' },
  { label: 'Conferences', href: '/explore?category=conference' },
  { label: 'Summits', href: '/explore?category=summit' },
  { label: 'Workshops', href: '/explore?category=workshop' },
  { label: 'About', href: '/#about' },
];

const FOOTER_SOCIAL = [
  { label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  { label: 'X / Twitter', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z' },
  { label: 'YouTube', path: 'M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z' },
];

function FooterNavColumn() {
  const items = useMenu('footer_column_1');
  const menuTitle = useMenuTitle('footer_column_1');
  const { themeKey } = useMenuContext();
  const title = menuTitle || 'NAVIGATE';

  return (
    <div>
      <div className="ecc-mono" style={{ marginBottom: '2rem', color: 'var(--ecc-text-main)' }}>{title}</div>
      <div className="ecc-footer-link-group">
        {items.length > 0
          ? items.map((item) => (
              <MenuLink key={`${item.id ?? item.title}-${item.url}`} item={item} themeKey={themeKey} className="ecc-footer-link" />
            ))
          : FOOTER_FALLBACK_NAV.map((link) => (
              <a key={link.label} href={link.href} className="ecc-footer-link">{link.label}</a>
            ))}
      </div>
    </div>
  );
}

export const Footer = () => {
  const brandLabel = useThemeContent('header.brand_label', 'SummitPro');
  const description = useThemeContent(
    'footer.description',
    'The premier global platform for corporate summits, technical conferences, and executive forums. Shaping the future of professional events.'
  );
  const email = useThemeContent('footer.email', 'events@summitpro.com');
  const location = useThemeContent('footer.location', 'San Francisco, CA');
  const copyright = useThemeContent('footer.copyright', '© 2026 SummitPro. All rights reserved.');
  const socialLinkedin = useThemeContent('social.linkedin', 'https://linkedin.com/company/summitpro');
  const socialTwitter = useThemeContent('social.twitter', 'https://x.com/summitpro');
  const socialInstagram = useThemeContent('social.instagram', 'https://instagram.com/summitpro');
  const socialYoutube = useThemeContent('social.youtube', 'https://youtube.com/@summitpro');

  const socialLinks = [
    { ...FOOTER_SOCIAL[0], href: socialLinkedin },
    { ...FOOTER_SOCIAL[1], href: socialTwitter },
    { ...FOOTER_SOCIAL[2], href: socialInstagram },
    { ...FOOTER_SOCIAL[3], href: socialYoutube },
  ].filter(({ href }) => href.trim() !== '');

  return (
  <footer className="ecc-footer">
    <div className="ecc-footer-grid">
      <div>
        <div style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--ecc-obsidian)' }}>{brandLabel}</div>
        <p style={{ color: 'var(--ecc-text-muted)', lineHeight: 1.8, maxWidth: '400px' }}>
          {description}
        </p>
        {socialLinks.length > 0 && (
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
            {socialLinks.map(({ label, path, href }) => (
              <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '50%', border: '1px solid var(--ecc-border)', color: 'var(--ecc-text-muted)', transition: 'all 0.2s', flexShrink: 0 }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'var(--ecc-blue)'; el.style.color = 'white'; el.style.borderColor = 'var(--ecc-blue)'; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ''; el.style.color = 'var(--ecc-text-muted)'; el.style.borderColor = 'var(--ecc-border)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={path}/></svg>
              </a>
            ))}
          </div>
        )}
      </div>

      <FooterNavColumn />

      <div>
          <div className="ecc-mono" style={{ marginBottom: '2rem', color: 'var(--ecc-text-main)' }}>CONTACT</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a href={`mailto:${email}`} className="ecc-footer-link">{email}</a>
              <span style={{ color: 'var(--ecc-text-muted)', fontSize: '0.95rem' }}>{location}</span>
          </div>
      </div>
    </div>

    <div className="ecc-footer-bottom" style={{ alignItems: 'center' }}>
        <div style={{ color: 'var(--ecc-text-muted)', fontSize: '0.85rem' }}>{copyright}</div>
        <span style={{ color: 'var(--ecc-text-muted)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.05em' }}>Built on Sellio</span>
    </div>
  </footer>
  );
};

type SpeakerCardProps = {
  name: string;
  role: string;
  company: string;
  image: string;
};

export const SpeakerCard = ({ name, role, company, image }: SpeakerCardProps) => (
  <div className="ecc-speaker-card">
    <img src={image} alt={name} className="ecc-speaker-image" />
    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--ecc-obsidian)' }}>{name}</h3>
    <div style={{ color: 'var(--ecc-blue)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.2rem' }}>{company}</div>
    <div style={{ color: 'var(--ecc-text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>{role}</div>
  </div>
);

type AgendaItemProps = {
  time: string;
  title: string;
  speaker: string;
  track: string;
};

export const AgendaItem = ({ time, title, speaker, track }: AgendaItemProps) => (
  <div className="ecc-agenda-item">
    <div className="ecc-mono" style={{ fontSize: '0.85rem' }}>{time}</div>
    <div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ 
                background: 'var(--ecc-bone)', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '4px', 
                fontSize: '0.65rem', 
                fontWeight: 800, 
                color: 'var(--ecc-text-muted)',
                letterSpacing: '1px'
             }}>{track}</span>
        </div>
        <h4 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.5px', color: 'var(--ecc-obsidian)' }}>{title}</h4>
        <div style={{ color: 'var(--ecc-text-muted)', fontWeight: 500 }}>Presented by <span style={{ color: 'var(--ecc-text-main)', fontWeight: 700 }}>{speaker}</span></div>
    </div>
  </div>
);

export const EventCard = ({ event }: { event: EventListing }) => {
  const themeLink = useEventsThemeLink();
  const poster = getCorporateEventImage(event);
  const priceLabel = formatEventPrice(event);

  return (
    <Link href={themeLink(`/product/${event.slug}`)} style={{ textDecoration: 'none' }}>
      <div className="ecc-event-card">
        <div className="ecc-event-poster-wrapper">
          <img src={poster} alt={event.title} className="ecc-event-poster" />
        </div>
        <div className="ecc-event-card-body">
          <span className="ecc-event-card-tag">{event.specs?.category || 'Summit'}</span>
          <h3 className="ecc-event-card-title">{event.title}</h3>
          
          <div className="ecc-event-card-meta">
            <div className="ecc-event-card-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ecc-blue)' }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>{formatEventDateShort(event)}</span>
            </div>
            <div className="ecc-event-card-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ecc-blue)' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>{getEventLocationLabel(event)}</span>
            </div>
          </div>
          
          <div className="ecc-event-card-footer">
            <span className="ecc-event-card-price">{priceLabel}</span>
            <span className="ecc-mono" style={{ fontSize: '0.65rem', borderBottom: '1px solid var(--ecc-blue)', paddingBottom: '2px', textDecoration: 'none' }}>VIEW DETAILS</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ShimmerCard = () => (
  <div className="ecc-shimmer-card">
    <div className="ecc-shimmer ecc-shimmer-image"></div>
    <div className="ecc-shimmer ecc-shimmer-title" style={{ marginTop: '1.5rem' }}></div>
    <div className="ecc-shimmer ecc-shimmer-meta" style={{ marginTop: '0.75rem' }}></div>
    <div className="ecc-shimmer ecc-shimmer-text" style={{ marginTop: '2rem' }}></div>
    <div className="ecc-shimmer ecc-shimmer-text" style={{ marginTop: '0.5rem', width: '70%' }}></div>
  </div>
);
