'use client';
import React, { useState } from 'react';
import { EventListing } from '@sellio/types';
import Link from 'next/link';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="ecc-header">
      <div className="ecc-header-container">
        <Link href="/preview/events_corporate" style={{ textDecoration: 'none' }}>
          <div className="ecc-logo">
            FORUM<span>26</span>
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

        <nav className={`ecc-nav ${isOpen ? 'ecc-nav-open' : ''}`}>
          {['SPEAKERS', 'SCHEDULE', 'EXPLORE'].map(item => {
            if (item === 'EXPLORE') {
              return (
                <Link 
                  key={item} 
                  href="/preview/events_corporate/explore" 
                  className="ecc-nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              );
            }
            return (
              <span 
                  key={item} 
                  className="ecc-nav-link" 
                  onClick={() => {
                    setIsOpen(false);
                    if (item === 'SPEAKERS') document.getElementById('ecc-speakers-section')?.scrollIntoView({ behavior: 'smooth' });
                    if (item === 'SCHEDULE') document.getElementById('ecc-agenda-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
              >
                {item}
              </span>
            );
          })}
          <Link href="/preview/events_corporate/explore" style={{ width: '100%', textDecoration: 'none' }}>
            <button className="ecc-btn-primary ecc-mobile-btn" style={{ width: '100%', borderRadius: '100px', padding: '1rem 3rem', marginTop: '2rem' }}>
              REGISTER NOW
            </button>
          </Link>
        </nav>

        <Link href="/preview/events_corporate/explore" style={{ textDecoration: 'none' }} className="ecc-desktop-btn">
          <button className="ecc-btn-primary" id="ecc-btn-header-register">
            REGISTER NOW
          </button>
        </Link>
      </div>
    </header>
  );
};

export const Footer = () => (
  <footer className="ecc-footer">
    <div className="ecc-footer-grid">
      <div>
        <div style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--ecc-obsidian)' }}>FORUM26</div>
        <p style={{ color: 'var(--ecc-text-muted)', lineHeight: 1.8, maxWidth: '400px' }}>
          The premier global assembly for architectural engineering and distributed systems. Shaping the future of technical infrastructure.
        </p>
      </div>
      
      <div>
          <div className="ecc-mono" style={{ marginBottom: '2rem', color: 'var(--ecc-text-main)' }}>EXPLORE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="ecc-footer-link-group">
            <Link href="/preview/events_corporate/explore" style={{ color: 'var(--ecc-text-muted)', fontSize: '0.95rem', cursor: 'pointer', textDecoration: 'none' }} className="ecc-footer-link">
              Search Events
            </Link>
            <span style={{ color: 'var(--ecc-text-muted)', fontSize: '0.95rem', cursor: 'pointer' }} className="ecc-footer-link" onClick={() => document.getElementById('ecc-speakers-section')?.scrollIntoView({ behavior: 'smooth' })}>
              Speakers
            </span>
            <span style={{ color: 'var(--ecc-text-muted)', fontSize: '0.95rem', cursor: 'pointer' }} className="ecc-footer-link" onClick={() => document.getElementById('ecc-agenda-section')?.scrollIntoView({ behavior: 'smooth' })}>
              Curated Agenda
            </span>
          </div>
      </div>

      <div>
          <div className="ecc-mono" style={{ marginBottom: '2rem', color: 'var(--ecc-text-main)' }}>CONTACT</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ color: 'var(--ecc-text-muted)', fontSize: '0.95rem' }}>support@forum26.com</span>
              <span style={{ color: 'var(--ecc-text-muted)', fontSize: '0.95rem' }}>San Francisco, CA</span>
          </div>
      </div>
    </div>
    
    <div className="ecc-footer-bottom">
        <div style={{ color: 'var(--ecc-text-muted)', fontSize: '0.85rem' }}>© 2026 SELLIO_EVENTS_GRP</div>
        <div style={{ display: 'flex', gap: '3rem' }} className="ecc-footer-socials">
            {['PRIVACY', 'TERMS', 'CODE_OF_CONDUCT'].map(item => (
                <span key={item} className="ecc-mono" style={{ fontSize: '0.65rem', cursor: 'pointer' }} onClick={() => alert(`Reviewing: ${item}`)}>{item}</span>
            ))}
        </div>
    </div>
  </footer>
);

export const SpeakerCard = ({ name, role, company, image }: any) => (
  <div className="ecc-speaker-card" onClick={() => alert(`Speaker bio loaded: ${name}`)}>
    <img src={image} alt={name} className="ecc-speaker-image" />
    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--ecc-obsidian)' }}>{name}</h3>
    <div style={{ color: 'var(--ecc-blue)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.2rem' }}>{company}</div>
    <div style={{ color: 'var(--ecc-text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>{role}</div>
  </div>
);

export const AgendaItem = ({ time, title, speaker, track }: any) => (
  <div className="ecc-agenda-item" onClick={() => alert(`Agenda Details for: ${title}`)}>
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
  const poster = event.media?.poster || '/themes/events/corporate/1.webp';
  const priceLabel = event.ticketing?.is_free 
    ? 'Free' 
    : event.ticketing?.price_formatted || `$${event.ticketing?.base_price}`;
  
  return (
    <Link href={`/preview/events_corporate/product/${event.slug}`} style={{ textDecoration: 'none' }}>
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
              <span>{event.schedule?.start_at ? new Date(event.schedule.start_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'October 14-16, 2026'}</span>
            </div>
            <div className="ecc-event-card-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ecc-blue)' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>{event.location?.city ? `${event.location.city}, ${event.location.state || ''}` : 'San Francisco, CA'}</span>
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
