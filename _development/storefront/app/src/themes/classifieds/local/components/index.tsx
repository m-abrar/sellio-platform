'use client';
import React from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';

interface HeaderProps {
  onPostClick: () => void;
  onLocationClick: () => void;
  locationName: string;
}

export const LocalHeader = ({ onPostClick, onLocationClick, locationName }: HeaderProps) => (
  <header className="cl-header">
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
      <a href="#" className="cl-logo" onClick={(e) => { e.preventDefault(); window.location.reload(); }}>
        <span className="cl-logo-icon">🌿</span> NeighborHood
      </a>
      <div className="cl-location-picker" onClick={onLocationClick}>
        📍 <span>{locationName}</span>
      </div>
    </div>
    
    <div className="cl-nav-panel">
      <MenuNav
        location="main_header"
        flat
        className="cl-nav"
        linkClassName="cl-nav-link d-none d-md-block"
        renderItem={(item, { href, className, onNavigate }) => (
          <a
            href={href}
            className={`${className} d-none d-md-block`}
            onClick={(e) => {
              e.preventDefault();
              if (item.title === 'Messages') {
                alert("Opening neighbors messaging panel...");
              } else {
                alert("Viewing local community board posts...");
              }
              onNavigate?.();
            }}
          >
            {item.title}
            {item.title === 'Messages' && (
              <span style={{ backgroundColor: 'var(--cl-primary-green)', color: 'white', borderRadius: '50px', padding: '0.1rem 0.4rem', fontSize: '0.7rem', fontWeight: 800 }}>3</span>
            )}
          </a>
        )}
      />
      <MenuActionButtons
        buttonClassName="cl-btn-post"
        as="button"
        onAction={onPostClick}
        renderItem={(item, { className, onNavigate }) => (
          <button type="button" className={className} onClick={() => { onPostClick(); onNavigate?.(); }}>
            📸 {item.title}
          </button>
        )}
      />
    </div>
  </header>
);

interface LocalCardProps {
  title: string;
  price: string;
  distance: string;
  neighborhood: string;
  image: string;
  sellerInitials: string;
  conditionLabel: string;
  isFocused: boolean;
  onClick: () => void;
  onMessageClick: () => void;
}

export const LocalCard = ({ title, price, distance, neighborhood, image, sellerInitials, conditionLabel, isFocused, onClick, onMessageClick }: LocalCardProps) => (
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
        <span>📍</span> {distance} mi away &bull; {neighborhood}
      </div>
    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'center' }}>
      <div className="cl-avatar" style={{ fontSize: '0.75rem', width: '26px', height: '26px' }}>{sellerInitials}</div>
      <button 
        className="cl-action-btn" 
        title="Message Neighbor" 
        style={{ width: '26px', height: '26px', fontSize: '0.75rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '50%', cursor: 'pointer' }}
        onClick={(e) => { e.stopPropagation(); onMessageClick(); }}
      >
        ✉️
      </button>
    </div>
  </div>
);

export const LocalFooter = () => (
  <footer className="cl-footer">
    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
      <div style={{ maxWidth: '320px' }}>
        <a href="#" className="cl-logo" style={{ marginBottom: '1rem' }} onClick={(e) => e.preventDefault()}>
          <span className="cl-logo-icon">🌿</span> NeighborHood
        </a>
        <p style={{ color: 'var(--cl-text-muted)', fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.6 }}>
          Connect, trade, and keep your neighborhoods vibrant. 100% verified addresses and secure neighbor-to-neighbor listings.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
        <FooterMenuColumn
          location="footer_column_1"
          titleTag="h4"
          titleStyle={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--cl-primary-blue)', textTransform: 'uppercase' }}
          listClassName="cl-footer-links"
          linkClassName="cl-footer-link"
        />
        <FooterMenuColumn
          location="footer_column_2"
          titleTag="h4"
          titleStyle={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--cl-primary-blue)', textTransform: 'uppercase' }}
          listClassName="cl-footer-links"
          linkClassName="cl-footer-link"
        />
      </div>
    </div>
    <div style={{ borderTop: '2px dashed var(--cl-border)', paddingTop: '1.5rem', textAlign: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--cl-text-muted)' }}>
      &copy; 2026 NeighborHood Network. Built for Envato Elite Standards.
    </div>
  </footer>
);
