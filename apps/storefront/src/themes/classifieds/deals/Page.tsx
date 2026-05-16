
'use client';
import React from 'react';
import { BargainCard } from './components';

export default function Page() {
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
      {/* High-Urgency Hero */}
      <section style={{ padding: '6rem 5% 4rem', background: 'white', borderBottom: '1px solid #e5e5ea' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ background: 'var(--color-deal-red)', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', display: 'inline-block', marginBottom: '1.5rem' }}>
              LIVE_BARGAIN_FEED
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1 }}>
              Prices Drop. <br/>
              <span style={{ color: 'var(--color-deal-red)' }}>Speed Wins.</span>
            </h1>
          </div>
          <div style={{ textAlign: 'right', maxWidth: '400px' }}>
            <p style={{ fontSize: '1.1rem', color: '#8e8e93', fontWeight: 500, lineHeight: 1.6, marginBottom: '2rem' }}>
              The high-velocity node for local classifieds. Verified deals distributed in real-time across the Sellio network.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <div style={{ padding: '1rem 2rem', background: '#f2f2f7', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-deal-red)' }}>12s</div>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#8e8e93' }}>AVG_SYNC_SPEED</div>
              </div>
              <div style={{ padding: '1rem 2rem', background: '#f2f2f7', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-deal-red)' }}>42%</div>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#8e8e93' }}>AVG_SAVINGS</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="compact-deals-grid">
        {deals.map((deal, i) => (
          <BargainCard key={i} {...deal} />
        ))}
      </div>

      {/* Value Prop Section */}
      <section style={{ padding: '10rem 5%', background: '#000', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,59,48,0.15) 0%, transparent 70%)', filter: 'blur(100px)' }}></div>
        
        <div style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 800, marginBottom: '3rem', letterSpacing: '-2px' }}>
            Engineered for <br/><span style={{ color: 'var(--color-deal-red)' }}>Maximum Velocity.</span>
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem' }}>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-deal-red)', letterSpacing: '2px', marginBottom: '1.5rem' }}>PROTOCOL_01</div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>VERIFIED_NODES</h4>
              <p style={{ color: '#8e8e93', fontSize: '0.9rem', lineHeight: 1.6 }}>Every high-value deal is verified via the Sellio trust protocol before listing.</p>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-deal-red)', letterSpacing: '2px', marginBottom: '1.5rem' }}>PROTOCOL_02</div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>INSTANT_SYNC</h4>
              <p style={{ color: '#8e8e93', fontSize: '0.9rem', lineHeight: 1.6 }}>Real-time messaging nodes allow for instant negotiation and transaction settlement.</p>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-deal-red)', letterSpacing: '2px', marginBottom: '1.5rem' }}>PROTOCOL_03</div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>SECURE_EXIT</h4>
              <p style={{ color: '#8e8e93', fontSize: '0.9rem', lineHeight: 1.6 }}>Algorithmically suggested safe-zones for local pickups and node-to-node handovers.</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '8rem', textAlign: 'center' }}>
          <button style={{ padding: '2rem 6rem', background: 'var(--color-deal-red)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 20px 40px rgba(255, 59, 48, 0.3)' }}>
            INITIALIZE_FAST_SALE
          </button>
        </div>
      </section>
    </div>
  );
}
