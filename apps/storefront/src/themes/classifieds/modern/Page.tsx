
'use client';
import React, { useState } from 'react';
import { CategoryTile, HubListingCard } from './components';

export default function Page() {
  const [quickViewItem, setQuickViewItem] = useState<any>(null);

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

  const pulseItems = [
    { text: "NEW LISTING: TESLA MODEL 3", price: "$32,000", time: "2m ago" },
    { text: "OFFER ACCEPTED: VINTAGE LEICA", price: "$4,200", time: "5m ago" },
    { text: "TRENDING: HERMAN MILLER AERON", price: "$650", time: "Hot" },
    { text: "NEW LISTING: RTX 4090 TI", price: "$1,899", time: "Just now" },
  ];

  return (
    <div>
      <section className="cm-hero">
          <div style={{ display: 'inline-block', background: 'rgba(255, 103, 0, 0.1)', color: 'var(--cm-orange)', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '2.5rem', textTransform: 'uppercase' }}>
            The Global Listing Protocol
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', lineHeight: 1.1 }}>Market Access, <br/><span style={{ color: 'var(--cm-orange)' }}>Direct Velocity.</span></h1>
          <p style={{ maxWidth: '600px', margin: '4rem auto 0', fontSize: '1.25rem', color: 'var(--cm-text-dim)', lineHeight: 1.8, fontWeight: 400 }}>
            Discover and acquire verified listings from a decentralized network of premium community nodes. High-fidelity marketplace commerce.
          </p>
      </section>

      {/* Market Pulse Ticker */}
      <div className="cm-pulse-ticker">
          <div className="cm-pulse-track">
              {[...pulseItems, ...pulseItems].map((pulse, i) => (
                  <div key={i} className="cm-pulse-item">
                      <span style={{ color: 'var(--cm-orange)' }}>◈</span>
                      <span>{pulse.text}</span>
                      <span style={{ color: 'var(--cm-cyan)', fontWeight: 900 }}>{pulse.price}</span>
                      <span style={{ opacity: 0.4 }}>[{pulse.time}]</span>
                  </div>
              ))}
          </div>
      </div>

      <section className="cm-bento-categories" style={{ marginTop: '8rem' }}>
        <style dangerouslySetInnerHTML={{ __html: `
            @media (max-width: 1024px) {
                .cm-bento-categories { grid-template-columns: repeat(3, 1fr) !important; }
            }
            @media (max-width: 640px) {
                .cm-bento-categories { grid-template-columns: repeat(2, 1fr) !important; }
            }
        ` }} />
        {categories.map((cat, i) => (
          <CategoryTile key={i} {...cat} />
        ))}
      </section>

      <section className="cm-main-grid">
        <aside className="cm-sidebar">
          <div style={{ background: 'white', padding: '3rem', borderRadius: 'var(--cm-radius)', border: '1px solid var(--cm-border)', boxShadow: 'var(--cm-shadow)' }}>
            <h4 style={{ fontWeight: 900, marginBottom: '2.5rem', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Refine Marketplace</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--cm-text-dim)', marginBottom: '1rem', textTransform: 'uppercase' }}>Location Sync</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f4f6f9', padding: '1rem', borderRadius: '8px', border: '1px solid var(--cm-border)' }}>
                  <span style={{ fontSize: '1.2rem' }}>📍</span>
                  <input type="text" placeholder="San Francisco, CA" style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontWeight: 700, fontSize: '0.9rem', color: 'var(--cm-text)' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--cm-text-dim)', marginBottom: '1rem', textTransform: 'uppercase' }}>Price Range</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input type="text" placeholder="Min" style={{ width: '50%', background: '#f4f6f9', padding: '1rem', borderRadius: '8px', border: '1px solid var(--cm-border)', fontWeight: 700 }} />
                  <input type="text" placeholder="Max" style={{ width: '50%', background: '#f4f6f9', padding: '1rem', borderRadius: '8px', border: '1px solid var(--cm-border)', fontWeight: 700 }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--cm-text-dim)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Condition Protocol</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {['Factory New', 'Certified Pre-Owned', 'Verified Used', 'Legacy / Rare'].map(opt => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', color: 'var(--cm-text)' }}>
                      <input type="checkbox" style={{ accentColor: 'var(--cm-orange)', width: '18px', height: '18px' }} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <button className="cm-btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Update Feed</button>
            </div>
          </div>
        </aside>

        <div className="cm-feed">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--cm-text-dim)' }}>
                <span style={{ color: 'var(--cm-orange)' }}>{items.length}</span> Verified Units Available
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--cm-orange)', borderBottom: '2px solid var(--cm-orange)', paddingBottom: '0.5rem', cursor: 'pointer' }}>Latest</span>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--cm-text-dim)', cursor: 'pointer' }}>Price: Low</span>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--cm-text-dim)', cursor: 'pointer' }}>Nearby</span>
            </div>
          </div>

          <div className="cm-listing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2.5rem' }}>
            <style dangerouslySetInnerHTML={{ __html: `
                @media (max-width: 640px) {
                    .cm-listing-grid { grid-template-columns: 1fr !important; }
                }
            ` }} />
            {items.map((item, i) => (
              <HubListingCard key={i} {...item} onQuickView={() => setQuickViewItem(item)} />
            ))}
          </div>

          <div style={{ marginTop: '8rem', textAlign: 'center' }}>
            <button style={{ background: 'white', border: '1px solid var(--cm-border)', color: 'var(--cm-text)', padding: '1.5rem 6rem', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: 'var(--cm-shadow)' }} onMouseOver={(e:any) => { e.target.style.borderColor = 'var(--cm-orange)'; e.target.style.color = 'var(--cm-orange)'; }} onMouseOut={(e:any) => { e.target.style.borderColor = 'var(--cm-border)'; e.target.style.color = 'var(--cm-text)'; }}>
              Initialize Further Nodes
            </button>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setQuickViewItem(null)}>
            <div style={{ background: 'white', maxWidth: '800px', width: '100%', borderRadius: '24px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
                <img src={quickViewItem.image} alt={quickViewItem.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ padding: '4rem', position: 'relative' }}>
                    <button style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setQuickViewItem(null)}>✕</button>
                    <div className="el-label" style={{ marginBottom: '1.5rem', color: 'var(--cm-orange)', fontSize: '0.7rem' }}>Verified Marketplace Node</div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem', lineHeight: 1.2 }}>{quickViewItem.title}</h2>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--cm-orange)', marginBottom: '3rem' }}>{quickViewItem.price}</div>
                    <p style={{ color: 'var(--cm-text-dim)', lineHeight: 1.8, marginBottom: '4rem' }}>
                        High-fidelity asset verified for quality and community standards. Direct peer-to-peer transaction protocol active.
                    </p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <button className="cm-btn-primary" style={{ flex: 1 }}>Acquire Unit</button>
                        <button style={{ flex: 1, background: 'none', border: '1px solid var(--cm-border)', fontWeight: 800, borderRadius: '8px', cursor: 'pointer' }}>Save Node</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
