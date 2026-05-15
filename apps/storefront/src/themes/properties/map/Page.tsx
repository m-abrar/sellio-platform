import React from 'react';
import { MapListCard, MapPriceMarker } from './components';

export default function MapPage() {
  const listings = [
    { price: "$1,250,000", address: "142 E 16th St, New York, NY", beds: 2, baths: 1, sqft: "1,150", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070" },
    { price: "$2,800,000", address: "55 Water St, New York, NY", beds: 3, baths: 2, sqft: "2,200", image: "https://images.unsplash.com/photo-1600607687940-c52af096999a?q=80&w=2070" },
    { price: "$950,000", address: "300 Albany St, New York, NY", beds: 1, baths: 1, sqft: "850", image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070" },
    { price: "$4,500,000", address: "10 CPW, New York, NY", beds: 4, baths: 3, sqft: "3,100", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071" },
    { price: "$1,100,000", address: "88 Greenwich St, New York, NY", beds: 2, baths: 2, sqft: "1,200", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070" },
  ];

  return (
    <>
      <div className="side-panel-listings">
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700 }}>{listings.length} Results</span>
          <select style={{ border: 'none', background: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
            <option>Sort: Newest</option>
          </select>
        </div>
        {listings.map((item, i) => (
          <MapListCard key={i} {...item} />
        ))}
        <div style={{ padding: '2rem 0', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
          End of Search Results
        </div>
      </div>

      <div className="map-canvas-wrapper">
        <div className="map-placeholder-pattern">
          {/* Simulated Interactive Map with Markers */}
          <MapPriceMarker price="$1.2M" top="20%" left="30%" />
          <MapPriceMarker price="$2.8M" top="45%" left="60%" />
          <MapPriceMarker price="$950K" top="70%" left="40%" />
          <MapPriceMarker price="$4.5M" top="30%" left="80%" />
          <MapPriceMarker price="$1.1M" top="65%" left="20%" />
          
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem' }}>Map Layers</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ width: '30px', height: '30px', background: '#ddd', borderRadius: '4px' }}></div>
              <div style={{ width: '30px', height: '30px', background: '#bbb', borderRadius: '4px' }}></div>
              <div style={{ width: '30px', height: '30px', background: '#999', borderRadius: '4px' }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
