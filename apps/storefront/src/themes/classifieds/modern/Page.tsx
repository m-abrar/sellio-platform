
'use client';
import React from 'react';
import { CategoryTile, HubListingCard } from './components';

export default function Page() {
  const categories = [
    { label: "Electronics", icon: "💻", count: "12,402" },
    { label: "Vehicles", icon: "🚗", count: "8,110" },
    { label: "Property", icon: "🏠", count: "4,293" },
    { label: "Home", icon: "🌿", count: "15,802" },
    { label: "Collectibles", icon: "💎", count: "2,105" },
    { label: "Services", icon: "🛠️", count: "6,441" },
  ];

  const items = [
    { title: "2022 MacBook Pro M2 (14-inch)", price: "$1,650", location: "San Francisco, CA", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2070", isVerified: true },
    { title: "Vintage Leather Sofa (3-Seater)", price: "$450", location: "Portland, OR", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070" },
    { title: "Mountain Bike (Carbon Frame)", price: "$1,200", location: "Seattle, WA", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2070", isVerified: true },
    { title: "Classic Film Camera (M6)", price: "$2,800", location: "Austin, TX", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2070" },
    { title: "Designer Table Lamp", price: "$180", location: "Chicago, IL", image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=2070" },
    { title: "Modern Studio Desk", price: "$320", location: "Denver, CO", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=2070", isVerified: true },
  ];

  return (
    <div>
      <section className="cm-hero">
        <div style={{ display: 'inline-block', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--cm-primary)', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '2rem' }}>
          DECENTRALIZED_LOCAL_COMMERCE
        </div>
        <h1>Local Deals, <br/><span>Global Velocity.</span></h1>
        <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem', color: 'var(--cm-text-dim)', lineHeight: 1.8 }}>
          The high-fidelity distribution hub for verified local listings. Connect directly with your community node and discover premium value.
        </p>
      </section>

      <section className="cm-bento-categories">
        {categories.map((cat, i) => (
          <CategoryTile key={i} {...cat} />
        ))}
      </section>

      <section className="cm-main-grid">
        <aside className="cm-sidebar">
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--cm-border)' }}>
            <h4 style={{ fontWeight: 900, marginBottom: '2rem', fontSize: '0.8rem', letterSpacing: '1px' }}>REFINE_SEARCH</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--cm-text-dim)', marginBottom: '0.75rem' }}>LOCATION_RADIUS</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--cm-border)' }}>
                  <span style={{ fontSize: '1rem' }}>📍</span>
                  <input type="text" placeholder="San Francisco, CA" style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontWeight: 700, fontSize: '0.85rem' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--cm-text-dim)', marginBottom: '0.75rem' }}>PRICE_RANGE</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input type="text" placeholder="Min" style={{ width: '50%', background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--cm-border)', fontWeight: 700 }} />
                  <input type="text" placeholder="Max" style={{ width: '50%', background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--cm-border)', fontWeight: 700 }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--cm-text-dim)', marginBottom: '1.5rem' }}>CONDITION</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {['New / Unused', 'Certified Refurbished', 'Premium Used', 'Classic / Vintage'].map(opt => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                      <input type="checkbox" style={{ accentColor: 'var(--cm-primary)', width: '16px', height: '16px' }} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <button className="cm-btn-primary" style={{ marginTop: '1rem' }}>UPDATE_RESULTS</button>
            </div>
          </div>
        </aside>

        <div className="cm-feed">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--cm-text-dim)' }}>{items.length} ACTIVE_LISTINGS_IN_NODE</div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--cm-primary)', borderBottom: '2px solid var(--cm-primary)' }}>LATEST</span>
              <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--cm-text-dim)' }}>PRICE_LOW</span>
              <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--cm-text-dim)' }}>DISTANCE</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {items.map((item, i) => (
              <HubListingCard key={i} {...item} />
            ))}
          </div>

          <div style={{ marginTop: '6rem', textAlign: 'center' }}>
            <button style={{ background: 'none', border: '2px solid var(--cm-border)', color: 'var(--cm-text)', padding: '1.5rem 5rem', borderRadius: '50px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseOver={(e:any) => e.target.style.borderColor = 'var(--cm-primary)'} onMouseOut={(e:any) => e.target.style.borderColor = 'var(--cm-border)'}>
              LOAD_MORE_NODES
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
