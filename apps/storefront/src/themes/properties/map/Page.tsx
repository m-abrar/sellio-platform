'use client';
import React from 'react';
import { MapListCard, MapPriceMarker, MapHUD } from './components';

export default function Page() {
  const listings = [
    { price: "$1,250,000", address: "142 E 16th St, New York, NY", beds: 2, baths: 1, sqft: "1,150", image: "/themes/properties/map/1.webp" },
    { price: "$2,800,000", address: "55 Water St, New York, NY", beds: 3, baths: 2, sqft: "2,200", image: "/themes/properties/map/2.webp" },
    { price: "$950,000", address: "300 Albany St, New York, NY", beds: 1, baths: 1, sqft: "850", image: "/themes/properties/map/3.webp" },
    { price: "$4,500,000", address: "10 CPW, New York, NY", beds: 4, baths: 3, sqft: "3,100", image: "/themes/properties/map/4.webp" },
    { price: "$1,100,000", address: "88 Greenwich St, New York, NY", beds: 2, baths: 2, sqft: "1,200", image: "/themes/properties/map/5.webp" },
    { price: "$1,850,000", address: "420 West End Ave, NY", beds: 2, baths: 2, sqft: "1,450", image: "/themes/properties/map/6.webp" },
  ];

  return (
    <>
      <aside className="pm-sidebar">
        <div className="pm-sidebar-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Registry Nodes</h2>
                <span className="pm-marker" style={{ position: 'relative', top: 0, left: 0, padding: '0.25rem 0.75rem', fontSize: '0.65rem' }}>{listings.length} UNITS</span>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                {['FILTER', 'PRICE', 'TYPE'].map(btn => (
                    <button key={btn} style={{ 
                        flex: 1, 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '1px solid var(--pm-border)', 
                        color: 'white', 
                        padding: '0.5rem', 
                        fontSize: '0.6rem', 
                        fontWeight: 800, 
                        borderRadius: '4px',
                        letterSpacing: '1px'
                    }}>
                        {btn}
                    </button>
                ))}
            </div>
        </div>
        
        <div className="pm-results-list">
          {listings.map((item, i) => (
            <MapListCard key={i} {...item} />
          ))}
          <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.2 }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⌬</div>
              <div className="pm-hud-label">END_OF_REGISTRY</div>
          </div>
        </div>
      </aside>

      <main className="pm-map-canvas">
        <div className="pm-map-mock"></div>
        
        {/* Simulated Interactive Map with Markers */}
        <MapPriceMarker price="$1.25M" top="20%" left="30%" />
        <MapPriceMarker price="$2.8M" top="45%" left="60%" />
        <MapPriceMarker price="$950K" top="70%" left="40%" />
        <MapPriceMarker price="$4.5M" top="30%" left="80%" />
        <MapPriceMarker price="$1.1M" top="65%" left="20%" />
        <MapPriceMarker price="$1.85M" top="15%" left="75%" />

        <MapHUD />

        {/* Map UI Overlays */}
        <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {['+', '−', '⌖'].map(icon => (
                <button key={icon} style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'var(--pm-glass)', 
                    border: '1px solid var(--pm-border)', 
                    color: 'white', 
                    borderRadius: '8px', 
                    fontSize: '1.25rem', 
                    cursor: 'pointer' 
                }}>
                    {icon}
                </button>
            ))}
        </div>
      </main>
    </>
  );
}
