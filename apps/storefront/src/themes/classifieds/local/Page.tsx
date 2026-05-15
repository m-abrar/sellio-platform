
import React from 'react';
import { LocalAdCard } from './components';

export default function Page() {
  const ads = [
    { title: "Gently Used Coffee Table", price: "$45", location: "Maplewood", category: "Furniture", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2070" },
    { title: "Bicycle Maintenance Workshop", price: "Free", location: "Community Center", category: "Events", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2070" },
    { title: "Moving Sale - Books & Kitchen", price: "Varies", location: "Highland Park", category: "For Sale", image: "https://images.unsplash.com/photo-1530018607912-eff2df114fbe?q=80&w=2070" },
    { title: "Lost Golden Retriever - 'Buddy'", price: "Reward", location: "Riverside", category: "Lost & Found", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=2000" },
    { title: "Organic Garden Veggies", price: "$5 / lb", location: "Green Valley", category: "Food", image: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=2000" },
    { title: "Babysitting Services", price: "$20 / hr", location: "Downtown", category: "Wanted", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070" },
    { title: "Vintage Record Player", price: "$120", location: "West Side", category: "Electronics", image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=2070" },
    { title: "Garage Sale - This Saturday", price: "Multi", location: "East End", category: "Events", image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="local-hero">
          <div style={{ flex: 1.2 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--local-orange)', letterSpacing: '2px', display: 'block', marginBottom: '1.5rem' }}>COMMUNITY_DISTRIBUTION_NODE</span>
              <h1>Your neighborhood, <br/>connected.</h1>
              <p style={{ fontSize: '1.25rem', color: '#64748b', lineHeight: 1.6, marginBottom: '3.5rem', maxWidth: '500px' }}>
                  The high-fidelity hub for everything happening in your community. Sell your items, find local events, and connect with your neighbors.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <button style={{ padding: '1.25rem 3.5rem', background: 'var(--local-orange)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>POST_AN_AD</button>
                  <button style={{ padding: '1.25rem 3.5rem', background: 'white', color: '#1e293b', border: '1px solid #ddd', borderRadius: '50px', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>BROWSE_MAP</button>
              </div>
          </div>
          <div style={{ flex: 1 }}>
              <img src="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?q=80&w=2070" alt="Neighborhood Street" style={{ width: '100%', borderRadius: '24px', boxShadow: '40px 40px 80px rgba(0,0,0,0.05)' }} />
          </div>
      </section>

      {/* Community Bar */}
      <section style={{ padding: '2.5rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid var(--local-border)' }}>
          <div style={{ display: 'flex', gap: '3rem' }}>
              {['Maplewood', 'Highland Park', 'Riverside', 'Green Valley', 'Downtown'].map(area => (
                  <span key={area} style={{ fontSize: '0.9rem', fontWeight: 800, color: '#94a3b8', cursor: 'pointer' }}>{area.toUpperCase()}</span>
              ))}
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--local-orange)' }}>LIVE_ALERTS: 12_NEW_ADS</div>
      </section>

      {/* Ad Grid */}
      <section className="ad-grid">
          {ads.map((ad, i) => (
              <LocalAdCard key={i} {...ad} />
          ))}
      </section>

      {/* Community Story Section */}
      <section style={{ padding: '10rem 5%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'center', background: 'var(--local-cream)' }}>
          <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', fontWeight: 900, marginBottom: '2.5rem' }}>Built by the <br/>neighborhood.</h2>
              <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 2, marginBottom: '4rem' }}>
                  Our local classifieds vertical is more than just a marketplace. It is a community distribution protocol designed to strengthen local ties and promote neighborly exchange.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                  <div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--local-orange)' }}>500+</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>LOCAL_MEETUPS</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--local-orange)' }}>$0</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>PLATFORM_FEES</div>
                  </div>
              </div>
          </div>
          <div style={{ padding: '4rem', background: 'white', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem' }}>Safety first.</h3>
              <p style={{ color: '#94a3b8', lineHeight: 2, marginBottom: '3rem' }}>
                  We use verified neighbor nodes to ensure every listing and interaction is safe and reliable. Join the most trusted local network today.
              </p>
              <button style={{ width: '100%', padding: '1.5rem', background: '#1e293b', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                  CREATE_COMMUNITY_ACCOUNT
              </button>
          </div>
      </section>
    </div>
  );
}
