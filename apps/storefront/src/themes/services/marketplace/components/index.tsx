'use client';
import React, { useState } from 'react';
import type { ServiceListing } from '@sellio/types';

function getThemeLink(path: string) {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/preview/')) {
    const themeKey = window.location.pathname.split('/')[2];
    return `/preview/${themeKey}${path}`;
  }
  return path || '/';
}

export const MarketplaceHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sm-header">
      <div className="sm-logo">
        Service<span>Connect</span>
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
      

      {/* Navigation Links */}
      <nav className={`sm-nav ${isOpen ? 'sm-nav-open' : ''}`}>
        {[
          { name: 'Home', target: 'sm-hero-section' },
          { name: 'Categories', target: 'sm-categories-section' },
          { name: 'Providers', target: 'sm-providers-section' },
          { name: 'How It Works', target: 'sm-how-it-works' },
          { name: 'Testimonials', target: 'sm-testimonials-section' }
        ].map(link => (
          <a 
            key={link.name} 
            href={`#${link.target}`} 
            className="sm-nav-link"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
              const targetId = link.target;
              document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {link.name}
          </a>
        ))}
        <button 
          className="sm-btn sm-btn-primary sm-mobile-btn" 
          onClick={() => alert('Service posting wizard starting...')}
        >
          Post a Service
        </button>
      </nav>

      {/* Desktop Actions */}
      <div className="sm-desktop-btn-container">
        <button 
          className="sm-btn sm-btn-primary sm-desktop-btn" 
          onClick={() => alert('Service posting wizard starting...')}
          id="sm-btn-vibe-status"
        >
          Post a Service
        </button>
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
        <div className="sm-category-icon">{icon}</div>
        <h5 style={{ fontWeight: 700, margin: 0, fontSize: '1.15rem' }}>{title}</h5>
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
  const isDynamic = !!service;
  const displayName = isDynamic ? service.title : name;
  const displayTitle = isDynamic ? (service.professional?.category || 'Professional Service') : title;
  const displayRating = isDynamic ? (4.6 + (service.id % 5) * 0.1).toFixed(1) : rating;
  const displayImage = isDynamic ? (service.media?.main_photo || '/themes/services/marketplace/15.webp') : image;
  const isTopPro = isDynamic ? service.status?.is_featured : true;
  const priceLabel = isDynamic ? (service.pricing?.formatted || `$${service.pricing?.base_price}`) : null;
  const productHref = isDynamic && service.slug ? getThemeLink(`/product/${service.slug}`) : null;

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
              className="sm-btn sm-btn-primary hire-btn" 
              style={{ width: '100%', marginTop: productHref ? 0 : 'auto' }} 
              onClick={() => {
                if (isDynamic && onHire && service) {
                  onHire(service);
                } else {
                  alert(`Direct hiring interface initialized for ${displayName}...`);
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

export const MarketplaceFooter = () => (
    <footer className="sm-footer">
        <div className="sm-footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <h5 style={{ fontWeight: 800, color: 'var(--sm-primary)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Service<span style={{ color: 'var(--sm-secondary)' }}>Connect</span></h5>
                <p style={{ color: 'var(--sm-text-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    Your trusted marketplace for local services. Connecting quality professionals with clients who need them.
                </p>
                <p style={{ color: 'white', fontSize: '0.95rem', marginTop: '1.5rem', fontWeight: 600 }}>support@serviceconnect.com</p>
            </div>
            <div>
                <h6 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.1rem', color: 'white' }}>Quick Links</h6>
                <a href="#" className="sm-footer-link" onClick={() => alert('About us.')}>About Us</a>
                <a href="#" className="sm-footer-link" onClick={() => alert('Careers listings.')}>Careers</a>
                <a href="#" className="sm-footer-link" onClick={() => alert('Blog portal.')}>Blog</a>
                <a href="#" className="sm-footer-link" onClick={() => alert('Press center.')}>Press</a>
            </div>
            <div>
                <h6 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.1rem', color: 'white' }}>Providers</h6>
                <a href="#" className="sm-footer-link" onClick={() => alert('Become a provider.')}>Join as Provider</a>
                <a href="#" className="sm-footer-link" onClick={() => alert('Provider login page.')}>Provider Login</a>
                <a href="#" className="sm-footer-link" onClick={() => alert('Pricing tiers.')}>Pricing Plans</a>
                <a href="#" className="sm-footer-link" onClick={() => alert('Safety portal.')}>Trust & Safety</a>
            </div>
            <div>
                <h6 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.1rem', color: 'white' }}>Support</h6>
                <a href="#" className="sm-footer-link" onClick={() => alert('Help center.')}>Help Center</a>
                <a href="#" className="sm-footer-link" onClick={() => alert('Contact portal.')}>Contact Us</a>
                <a href="#" className="sm-footer-link" onClick={() => alert('Privacy policy.')}>Privacy Policy</a>
                <a href="#" className="sm-footer-link" onClick={() => alert('Terms of Service.')}>Terms of Service</a>
            </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', textAlign: 'center', color: 'var(--sm-text-muted)', fontSize: '0.9rem' }}>
            &copy; 2026 ServiceConnect. All rights reserved.
        </div>
    </footer>
);
