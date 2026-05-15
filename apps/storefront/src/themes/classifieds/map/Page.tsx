import React from 'react';
import { LocalListingCard, PriceBubble } from './components';

export default function CommunityMapPage() {
  const items = [
    { price: "$120", title: "Mid-Century Modern Desk", location: "Williamsburg, BK", date: "2h ago", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=2070" },
    { price: "$45", title: "Vintage Film Camera", location: "Bushwick, BK", date: "4h ago", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2070" },
    { price: "$280", title: "Road Bike (Shimano Gears)", location: "Park Slope, BK", date: "1d ago", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2070" },
    { price: "Free", title: "Potted Snake Plant", location: "Fort Greene, BK", date: "5h ago", image: "https://images.unsplash.com/photo-1512428813833-df4d24752827?q=80&w=2070" },
    { price: "$850", title: "Leather Tufted Sofa", location: "DUMBO, BK", date: "3h ago", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070" },
  ];

  return (
    <>
      <div className="marketplace-map-canvas">
        <div style={{ width: '100%', height: '100%', backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          {/* Simulated Local Marketplace Map */}
          <PriceBubble price="$120" top="30%" left="40%" />
          <PriceBubble price="$45" top="55%" left="25%" />
          <PriceBubble price="$280" top="45%" left="65%" />
          <PriceBubble price="FREE" top="75%" left="50%" />
          <PriceBubble price="$850" top="20%" left="70%" />
          
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'white', padding: '0.8rem 1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontSize: '0.85rem', fontWeight: 700 }}>
            Showing items within 5 miles
          </div>
        </div>
      </div>

      <div className="side-listing-feed">
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800 }}>{items.length} LOCAL_DEALS</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#3b82f6' }}>REFINE_</span>
        </div>
        {items.map((item, i) => (
          <LocalListingCard key={i} {...item} />
        ))}
        <div style={{ padding: '2rem 0', textAlign: 'center', opacity: 0.4, fontSize: '0.75rem' }}>
          Refresh for newer listings
        </div>
      </div>
    </>
  );
}
