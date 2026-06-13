'use client';
import React, { useState } from 'react';
import { EventListing } from '@sellio/types';
import Link from 'next/link';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { hashAwareNavItemRenderer } from '@/components/menu/menu-renderers';
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
  const brandLabel = useThemeContent('header.brand_label', 'FORUM26');
  const brandHighlight = useThemeContent('header.brand_highlight', '26');
  const brandPrefix = brandLabel.endsWith(brandHighlight)
    ? brandLabel.slice(0, -brandHighlight.length)
    : brandLabel;

  return (
    <header className="ecc-header">
      <div className="ecc-header-container">
        <Link href={themeLink('')} style={{ textDecoration: 'none' }}>
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

export const Footer = () => {
  const brandLabel = useThemeContent('header.brand_label', 'FORUM26');
  const description = useThemeContent(
    'footer.description',
    'The premier global assembly for architectural engineering and distributed systems. Shaping the future of technical infrastructure.'
  );
  const email = useThemeContent('footer.email', 'support@forum26.com');
  const location = useThemeContent('footer.location', 'San Francisco, CA');
  const copyright = useThemeContent('footer.copyright', '© 2026 Sellio. All rights reserved.');

  return (
  <footer className="ecc-footer">
    <div className="ecc-footer-grid">
      <div>
        <div style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--ecc-obsidian)' }}>{brandLabel}</div>
        <p style={{ color: 'var(--ecc-text-muted)', lineHeight: 1.8, maxWidth: '400px' }}>
          {description}
        </p>
      </div>
      
      <FooterMenuColumn
        location="footer_column_1"
        renderTitle={(title) => (
          <div className="ecc-mono" style={{ marginBottom: '2rem', color: 'var(--ecc-text-main)' }}>{title}</div>
        )}
        listClassName="ecc-footer-link-group"
        linkClassName="ecc-footer-link"
      />

      <div>
          <div className="ecc-mono" style={{ marginBottom: '2rem', color: 'var(--ecc-text-main)' }}>CONTACT</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ color: 'var(--ecc-text-muted)', fontSize: '0.95rem' }}>{email}</span>
              <span style={{ color: 'var(--ecc-text-muted)', fontSize: '0.95rem' }}>{location}</span>
          </div>
      </div>
    </div>
    
    <div className="ecc-footer-bottom">
        <div style={{ color: 'var(--ecc-text-muted)', fontSize: '0.85rem' }}>{copyright}</div>
        <MenuNav
          location="footer_bottom_bar"
          flat
          className="ecc-footer-socials"
          linkClassName="ecc-mono"
          renderItem={(item, { href, className, onNavigate }) => (
            <span className={className} style={{ fontSize: '0.65rem', cursor: 'pointer' }}>
              <a href={href} onClick={onNavigate} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
            </span>
          )}
        />
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
