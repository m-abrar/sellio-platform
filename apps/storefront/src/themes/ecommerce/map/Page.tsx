import React from 'react';
import { BoutiqueProductCard, BoutiqueMarker } from './components';

export default function BoutiqueMapPage() {
  const products = [
    { title: "Limited Edition Leather Tote", price: "$340", brand: "MAISON_NYC", image: "https://images.unsplash.com/photo-1584917033904-74116fe46a27?q=80&w=2070" },
    { title: "Pure Wool Minimal Scarf", price: "$120", brand: "NORDIC_HUES", image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=2070" },
    { title: "Oversized Canvas Parka", price: "$285", brand: "UTILITY_LAB", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2070" },
    { title: "Hand-Crafted Ceramic Set", price: "$165", brand: "STUDIO_VUE", image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=2070" },
    { title: "Minimalist Watch No. 4", price: "$450", brand: "CHRONO_MODERN", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2070" },
  ];

  return (
    <>
      <div className="boutique-inventory-feed">
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800 }}>{products.length} ITEMS_IN_SOHO</span>
          <select style={{ border: 'none', background: 'none', fontWeight: 700, fontSize: '0.85rem' }}>
            <option>Sort: Distance</option>
          </select>
        </div>
        {products.map((item, i) => (
          <BoutiqueProductCard key={i} {...item} />
        ))}
        <div style={{ padding: '2rem 0', textAlign: 'center', opacity: 0.4, fontSize: '0.75rem' }}>
          Updated for your current location
        </div>
      </div>

      <div className="boutique-map-canvas">
        <div style={{ width: '100%', height: '100%', backgroundImage: 'radial-gradient(#fda4af 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
          {/* Simulated Boutique Map */}
          <BoutiqueMarker top="20%" left="40%" />
          <BoutiqueMarker top="55%" left="25%" />
          <BoutiqueMarker top="45%" left="65%" />
          <BoutiqueMarker top="75%" left="50%" />
          <BoutiqueMarker top="15%" left="70%" />
          
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'white', padding: '1.2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(225, 29, 72, 0.1)', borderRight: '4px solid #e11d48' }}>
            <div style={{ fontWeight: 900, fontSize: '0.85rem', color: '#e11d48' }}>Boutique Spotlight</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>MAISON_NYC • Mercer St</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e11d48', marginTop: '0.5rem' }}>READY_FOR_PICKUP_IN_2H</div>
          </div>
        </div>
      </div>
    </>
  );
}
