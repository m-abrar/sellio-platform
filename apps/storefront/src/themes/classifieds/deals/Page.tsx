import React from 'react';
import { BargainCard } from './components';

export default function DealsPage() {
  const deals = [
    { title: "iPhone 15 Pro Max - Unlocked 256GB", price: "$850", oldPrice: "$1199", location: "Brooklyn, NY", time: "2m ago", image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=2070", isHot: true },
    { title: "Herman Miller Aeron Chair - Size B", price: "$450", oldPrice: "$1200", location: "Manhattan, NY", time: "15m ago", image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=2070", isHot: true },
    { title: "Sony PS5 Console + 2 Controllers", price: "$350", oldPrice: "$499", location: "Queens, NY", time: "45m ago", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=2070" },
    { title: "Cannondale Road Bike - Carbon Frame", price: "$900", oldPrice: "$1800", location: "Jersey City, NJ", time: "1h ago", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2070", isHot: true },
    { title: "Vintage Film Camera - Nikon F3", price: "$200", oldPrice: "$450", location: "Bronx, NY", time: "2h ago", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2070" },
    { title: "Mid-Century Modern Sofa - Velvet", price: "$300", oldPrice: "$950", location: "Staten Island, NY", time: "3h ago", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070" },
    { title: "Dyson V15 Detect Vacuum", price: "$380", oldPrice: "$750", location: "Yonkers, NY", time: "5h ago", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=2070" },
    { title: "Electric Scooter - Ninebot", price: "$250", oldPrice: "$599", location: "Newark, NJ", time: "6h ago", image: "https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=2070" },
  ];

  return (
    <div>
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>LIVE_DEALS_IN_YOUR_AREA</h1>
        <div style={{ color: 'var(--color-deal-blue)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 'bold' }}>
          VIEW_MAP_MODE
        </div>
      </div>

      <div className="compact-deals-grid">
        {deals.map((deal, i) => (
          <BargainCard key={i} {...deal} />
        ))}
      </div>

      <section style={{ padding: '4rem 2rem', background: 'white', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--color-deal-red)' }}>
          WHY_USE_SELLIO_DEALS?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          <div>
            <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>01_VERIFIED_SELLERS</span>
            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>We use AI to verify all high-value items before listing.</p>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>02_INSTANT_CHAT</span>
            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Connect with sellers in real-time with our built-in messenger.</p>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>03_SECURE_MEETUP</span>
            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Safe-zone location suggestions for local pickups.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
