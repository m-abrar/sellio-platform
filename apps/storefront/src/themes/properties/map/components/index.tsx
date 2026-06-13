'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

export const MapHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const themeLink = usePropertyThemeLink();

  return (
    <header className="pm-header" style={{
      height: '80px',
      background: 'var(--pm-obsidian)',
      borderBottom: '1px solid var(--pm-border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 2rem'
    }}>
      <a href={themeLink('/')} style={{ fontFamily: 'var(--pm-font-heading)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-1px', zIndex: 1100, textDecoration: 'none', color: 'inherit' }}>
        MAP<span style={{ color: 'var(--pm-gold)' }}>NEXUS</span>
      </a>
      
      <button 
          className={`pm-hamburger ${isOpen ? 'pm-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
      >
          <span className="pm-hamburger-bar"></span>
          <span className="pm-hamburger-bar"></span>
          <span className="pm-hamburger-bar"></span>
      </button>

      <div className={`pm-nav-panel ${isOpen ? 'pm-nav-open' : ''}`}>
        <MenuNav
          location="main_header"
          flat
          className="pm-nav"
          linkClassName="pm-nav-link"
          onNavigate={() => setIsOpen(false)}
          renderItem={defaultNavItemRenderer}
        />

        <MenuActionButtons
          as="button"
          buttonClassName="pm-mobile-auth-btn"
          onNavigate={() => setIsOpen(false)}
          renderItem={(item, { className, onNavigate }) => (
            <button type="button" className={className} style={{ 
                background: 'var(--pm-gold)', 
                color: 'var(--pm-obsidian)', 
                padding: '0.8rem 2rem', 
                borderRadius: '100px', 
                border: 'none', 
                fontWeight: 800, 
                fontSize: '0.75rem',
                marginTop: '2rem'
            }} onClick={onNavigate}>
              {item.title}
            </button>
          )}
        />
      </div>

      <MenuActionButtons
        as="button"
        buttonClassName="pm-desktop-auth-btn"
        renderItem={(item, { className, onNavigate }) => (
          <button type="button" className={className} style={{ 
              background: 'var(--pm-gold)', 
              color: 'var(--pm-obsidian)', 
              padding: '0.6rem 1.5rem', 
              borderRadius: '100px', 
              border: 'none', 
              fontWeight: 800, 
              fontSize: '0.75rem' 
          }} onClick={onNavigate}>
            {item.title}
          </button>
        )}
      />
    </header>
  );
};

export const MapListCard = ({ price, address, beds, baths, sqft, image }: any) => (
  <div className="pm-list-card">
    <img src={image} alt={address} className="pm-card-image" />
    <div className="pm-card-info">
        <div className="pm-price">{price}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--pm-text-muted)', margin: '0.5rem 0' }}>{address}</div>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', fontWeight: 700 }}>
            <span>{beds} BD</span>
            <span>{baths} BA</span>
            <span>{sqft} SQFT</span>
        </div>
    </div>
  </div>
);

export const MapPriceMarker = ({ price, top, left }: any) => (
  <div className="pm-marker" style={{ top, left }}>
    {price}
  </div>
);

export const MapHUD = () => (
    <div className="pm-map-hud">
        <div className="pm-hud-label">Location</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>40.7128° N, 74.0060° W</div>

        <div className="pm-hud-label">Coverage</div>
        <div style={{ display: 'flex', gap: '4px', height: '4px' }}>
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
                <div key={i} style={{ flex: 1, background: i < 8 ? 'var(--pm-gold)' : 'rgba(255,255,255,0.1)' }}></div>
            ))}
        </div>
    </div>
);
