
import React from 'react';
import { HomeCard } from './components';

export default function Page() {
  const homes = [
    { title: "Maplewood Traditional", price: "$650,000", location: "Maplewood District", status: "New", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2070" },
    { title: "Craftsman Cul-de-sac", price: "$720,000", location: "Silver Springs", status: "Active", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2074" },
    { title: "Modern Colonial Node", price: "$580,000", location: "Oak Ridge", status: "Draft", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070" },
    { title: "Green Valley Bungalow", price: "$490,000", location: "Green Valley", status: "Active", image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070" },
    { title: "Suburban Retreat", price: "$610,000", location: "Highland Park", status: "Pending", image: "https://images.unsplash.com/photo-1513584684374-8bdb7483fe8f?q=80&w=2070" },
    { title: "Heritage Brick Home", price: "$675,000", location: "Old Town Node", status: "New", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hood-hero">
          <div style={{ flex: 1.2 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--hood-green)', letterSpacing: '2px', display: 'block', marginBottom: '1.5rem' }}>COMMUNITY_RESIDENTIAL_PROTOCOL</span>
              <h1>Find your place <br/>in the community.</h1>
              <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: 1.6, marginBottom: '3.5rem', maxWidth: '500px' }}>
                  A warm, neighborly approach to property distribution. Verified family homes in high-trust neighborhood nodes.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <button style={{ padding: '1.25rem 3.5rem', background: 'var(--hood-green)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>SEARCH_HOMES</button>
                  <button style={{ padding: '1.25rem 3.5rem', background: 'none', color: 'var(--hood-green)', border: '2px solid var(--hood-green)', borderRadius: '50px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>LOCAL_GUIDES</button>
              </div>
          </div>
          <div style={{ flex: 1 }}>
              <img src="https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070" alt="Family Home" style={{ width: '100%', borderRadius: '40px', boxShadow: '40px 40px 80px rgba(22, 163, 74, 0.05)' }} />
          </div>
      </section>

      {/* Stats bar */}
      <section style={{ padding: '2.5rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid var(--hood-border)', color: '#94a3b8', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '1px' }}>
          <span>NEIGHBORHOOD_SAFETY_INDEX: 98%</span>
          <span>TOP_RATED_SCHOOL_NODES: 12</span>
          <span>AVERAGE_COMMUTE_TIME: 18min</span>
          <span>ACTIVE_COMMUNITY_EVENTS: 42</span>
      </section>

      {/* Home Grid */}
      <section className="home-grid">
          {homes.map((home, i) => (
              <HomeCard key={i} {...home} />
          ))}
      </section>

      {/* Community Section */}
      <section style={{ padding: '10rem 5%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'center', background: '#fdfcf8' }}>
          <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', fontWeight: 700, marginBottom: '2.5rem' }}>Better together.</h2>
              <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 2, marginBottom: '4rem' }}>
                  Our neighborhood vertical is designed to help you find more than just a house. We help you find a community. Every listing is integrated with local school data, safety indices, and community event nodes.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                  <div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--hood-green)', fontFamily: 'var(--font-heading)' }}>100%</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>VERIFIED_LISTINGS</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--hood-green)', fontFamily: 'var(--font-heading)' }}>24/7</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>COMMUNITY_SUPPORT</div>
                  </div>
              </div>
          </div>
          <div style={{ padding: '5rem', background: 'white', borderRadius: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Join the neighborhood.</h3>
              <p style={{ color: '#94a3b8', lineHeight: 2, marginBottom: '3rem' }}>
                  Receive local alerts and community news directly through your Sellio Hood node.
              </p>
              <button style={{ width: '100%', padding: '1.5rem', background: '#1e293b', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                  CREATE_COMMUNITY_PROFILE
              </button>
          </div>
      </section>
    </div>
  );
}
