'use client';
import React from 'react';

export const MapHeader = () => (
  <header style={{ 
    height: '80px', 
    background: 'var(--pm-obsidian)', 
    borderBottom: '1px solid var(--pm-border)', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '0 2rem' 
  }}>
    <div style={{ fontFamily: 'var(--pm-font-heading)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-1px' }}>
      MAP<span style={{ color: 'var(--pm-gold)' }}>NEXUS</span>
    </div>
    
    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '100px', padding: '0.5rem 2rem', display: 'flex', gap: '2rem' }}>
        {['SATELLITE', 'TERRAIN', 'INFRASTRUCTURE'].map(mode => (
            <span key={mode} style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '2px', cursor: 'pointer', opacity: mode === 'SATELLITE' ? 1 : 0.4 }}>
                {mode}
            </span>
        ))}
    </div>

    <button style={{ 
        background: 'var(--pm-gold)', 
        color: 'var(--pm-obsidian)', 
        padding: '0.6rem 1.5rem', 
        borderRadius: '100px', 
        border: 'none', 
        fontWeight: 800, 
        fontSize: '0.75rem' 
    }}>
      ACCESS_REGISTRY
    </button>
  </header>
);

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
        <div className="pm-hud-label">SPATIAL_COORDINATES</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>40.7128° N, 74.0060° W</div>
        
        <div className="pm-hud-label">DISTRICT_INTEGRITY</div>
        <div style={{ display: 'flex', gap: '4px', height: '4px' }}>
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
                <div key={i} style={{ flex: 1, background: i < 8 ? 'var(--pm-gold)' : 'rgba(255,255,255,0.1)' }}></div>
            ))}
        </div>
    </div>
);
