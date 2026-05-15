
import React from 'react';
import { ProServiceCard } from './components';

export default function Page() {
  const pros = [
    { title: "Deep Home Cleaning", rating: "4.9", reviews: "128", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=2070", starting: "$80" },
    { title: "Master Plumbing Node", rating: "4.8", reviews: "256", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070", starting: "$120" },
    { title: "Precision Gardening", rating: "5.0", reviews: "64", image: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=2000", starting: "$60" },
    { title: "Elite Math Tutoring", rating: "4.9", reviews: "92", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070", starting: "$45" },
    { title: "Smart Home Setup", rating: "4.7", reviews: "42", image: "https://images.unsplash.com/photo-1558002038-103792e01081?q=80&w=2070", starting: "$150" },
    { title: "Pet Grooming Hub", rating: "4.9", reviews: "184", image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=2071", starting: "$55" },
    { title: "Local Logistics Node", rating: "4.6", reviews: "310", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070", starting: "$40" },
    { title: "Interior Design Consult", rating: "5.0", reviews: "15", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000", starting: "$200" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="local-hero">
          <div style={{ flex: 1.2 }}>
              <span style={{ fontFamily: 'var(--font-friendly)', fontWeight: 900, fontSize: '0.85rem', color: 'var(--local-green)', letterSpacing: '2px', display: 'block', marginBottom: '1.5rem' }}>TRUSTED_LOCAL_PROS</span>
              <h1>Quality service, <br/>just around the corner.</h1>
              <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: 1.6, marginBottom: '3.5rem', maxWidth: '500px' }}>
                  Connecting your neighborhood with verified local professionals for everything from cleaning to consulting. 100% satisfaction guaranteed.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <button style={{ padding: '1.25rem 3.5rem', background: 'var(--local-green)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 700 }}>FIND_A_PRO</button>
                  <button style={{ padding: '1.25rem 3.5rem', background: 'none', color: 'var(--local-green)', border: '2px solid var(--local-green)', borderRadius: '50px', fontWeight: 700 }}>LIST_YOUR_SERVICE</button>
              </div>
          </div>
          <div style={{ flex: 1 }}>
              <img src="https://images.unsplash.com/photo-1521791136368-79c11d73f8f3?q=80&w=2070" alt="Local Professional" style={{ width: '100%', borderRadius: '24px', boxShadow: '40px 40px 80px rgba(16, 185, 129, 0.05)' }} />
          </div>
      </section>

      {/* Trust bar */}
      <section style={{ padding: '2rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fdf6e3', color: '#92400e', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px' }}>
          <span>100%_VERIFIED_PROFESSIONALS</span>
          <span>SECURE_LOCAL_PAYMENTS</span>
          <span>NEIGHBORHOOD_TRUST_SCORE: 4.9/5.0</span>
          <span>INSTANT_BOOKING_READY</span>
      </section>

      {/* Pro Grid */}
      <section className="pro-grid">
          {pros.map((pro, i) => (
              <ProServiceCard key={i} {...pro} />
          ))}
      </section>

      {/* Philosophy Section */}
      <section style={{ padding: '10rem 5%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'center', background: '#fff' }}>
          <div>
              <h2 style={{ fontFamily: 'var(--font-friendly)', fontSize: '3.5rem', fontWeight: 900, marginBottom: '2.5rem' }}>Neighbors helping <br/>neighbors.</h2>
              <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 2, marginBottom: '4rem' }}>
                  Our local services vertical is built on a foundation of community trust. Every professional is manually verified by a local node, ensuring the highest standards of service for your home and family.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                  <div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--local-green)' }}>1.2k+</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>VERIFIED_PROS</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--local-green)' }}>30min</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>AVG_RESPONSE_TIME</div>
                  </div>
              </div>
          </div>
          <div style={{ padding: '5rem', background: '#f8fafc', borderRadius: '24px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-1rem', left: '-1rem', width: '60px', height: '60px', background: 'var(--local-yellow)', borderRadius: '12px' }}></div>
              <h3 style={{ fontFamily: 'var(--font-friendly)', fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem' }}>Are you a local expert?</h3>
              <p style={{ color: '#94a3b8', lineHeight: 2, marginBottom: '3rem' }}>
                  Grow your business by joining the Sellio Local network. Reach thousands of potential clients in your neighborhood.
              </p>
              <button style={{ width: '100%', padding: '1.5rem', background: 'var(--local-green)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 900 }}>
                  APPLY_AS_A_PRO
              </button>
          </div>
      </section>
    </div>
  );
}
