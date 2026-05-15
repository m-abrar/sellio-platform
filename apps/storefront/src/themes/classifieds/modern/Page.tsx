import React from 'react';
import { CategoryTile, HubListingCard } from './components';

export default function ModernHubPage() {
  const categories = [
    { label: "Electronics", icon: "💻", count: "12k+" },
    { label: "Vehicles", icon: "🚗", count: "8k+" },
    { label: "Property", icon: "🏠", count: "4k+" },
    { label: "Home/Garden", icon: "🌿", count: "15k+" },
    { label: "Jobs", icon: "💼", count: "2k+" },
    { label: "Services", icon: "🛠️", count: "6k+" },
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
      <section style={{ padding: '4rem 4rem 0', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Local Deals, Global Reach.</h1>
        <p style={{ opacity: 0.5, fontSize: '1.1rem' }}>The community-first marketplace for everything you need.</p>
      </section>

      <div className="category-tray">
        {categories.map((cat, i) => (
          <CategoryTile key={i} {...cat} />
        ))}
      </div>

      <div className="hub-layout">
        <aside style={{ height: 'fit-content', position: 'sticky', top: '120px' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #edf2f7' }}>
            <h4 style={{ fontWeight: 800, marginBottom: '1.5rem', fontSize: '0.9rem' }}>Refine Search</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, opacity: 0.5, marginBottom: '0.5rem' }}>LOCATION</label>
                <select style={{ width: '100%', padding: '0.6rem', border: '1px solid #eee', borderRadius: '8px' }}>
                  <option>Anywhere (50mi)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, opacity: 0.5, marginBottom: '0.5rem' }}>PRICE_RANGE</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" placeholder="Min" style={{ width: '50%', padding: '0.6rem', border: '1px solid #eee', borderRadius: '8px' }} />
                  <input type="text" placeholder="Max" style={{ width: '50%', padding: '0.6rem', border: '1px solid #eee', borderRadius: '8px' }} />
                </div>
              </div>
              <button style={{ width: '100%', padding: '0.8rem', background: 'var(--color-blue)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700 }}>Apply Filters</button>
            </div>
          </div>
        </aside>

        <div className="main-hub-content">
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800 }}>{items.length} RESULTS_FOUND</span>
            <select style={{ border: 'none', background: 'none', fontWeight: 700, fontSize: '0.85rem' }}>
              <option>Sort: Most Recent</option>
            </select>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {items.map((item, i) => (
              <HubListingCard key={i} {...item} />
            ))}
          </div>

          <div style={{ padding: '4rem 0', textAlign: 'center' }}>
            <button style={{ 
              background: 'white', 
              border: '1px solid var(--color-blue)', 
              color: 'var(--color-blue)', 
              padding: '1rem 3rem', 
              borderRadius: '100px', 
              fontWeight: 800,
              cursor: 'pointer'
            }}>
              Load More Listings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
