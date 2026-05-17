
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
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.85rem', color: 'var(--local-green)', letterSpacing: '2px', display: 'block', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Verified Local Experts</span>
              <h1>Quality service, <br/>just around the corner.</h1>
              <p style={{ fontSize: '1.25rem', color: 'var(--local-text)', lineHeight: 1.8, marginBottom: '3.5rem', maxWidth: '500px', fontWeight: 500, opacity: 0.8 }}>
                  Connecting your neighborhood with verified local professionals for everything from cleaning to consulting. 100% satisfaction guaranteed.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <button style={{ padding: '1.25rem 3.5rem', background: 'var(--local-green)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', transition: 'var(--local-transition)' }}>Find a Pro</button>
                  <button style={{ padding: '1.25rem 3.5rem', background: 'transparent', color: 'var(--local-navy)', border: '2px solid var(--local-border)', borderRadius: '50px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', transition: 'var(--local-transition)' }}>Join as a Pro</button>
              </div>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '100%', height: '100%', background: 'var(--local-green-light)', borderRadius: '24px', zIndex: 0 }}></div>
              <img src="https://images.unsplash.com/photo-1521791136368-79c11d73f8f3?q=80&w=2070" alt="Local Professional" style={{ width: '100%', borderRadius: '24px', position: 'relative', zIndex: 1, boxShadow: '0 40px 80px rgba(15, 23, 42, 0.1)' }} />
          </div>
      </section>

      {/* Trust bar */}
      <section style={{ padding: '2rem 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--local-navy)', color: 'white', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--local-green)' }}>✓</span> 100% Verified Professionals</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--local-green)' }}>✓</span> Secure Local Payments</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--local-yellow)' }}>★</span> Neighborhood Trust Score: 4.9/5.0</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--local-green)' }}>✓</span> Instant Booking Ready</div>
      </section>

      {/* Pro Grid */}
      <section className="pro-grid">
          {pros.map((pro, i) => (
              <ProServiceCard key={i} {...pro} />
          ))}
      </section>

      {/* Philosophy Section */}
      <section style={{ padding: '10rem 6%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'center', background: 'var(--local-surface)' }}>
          <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', fontWeight: 900, marginBottom: '2.5rem', color: 'var(--local-navy)', letterSpacing: '-1px' }}>Neighbors helping <br/>neighbors.</h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--local-text)', lineHeight: 1.8, marginBottom: '4rem', fontWeight: 500, opacity: 0.8 }}>
                  Our local services vertical is built on a foundation of community trust. Every professional is manually verified, ensuring the highest standards of service for your home and family.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                  <div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 900, color: 'var(--local-green)', letterSpacing: '-1px' }}>1.2k+</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--local-text)', opacity: 0.6, letterSpacing: '1px' }}>VERIFIED PROS</div>
                  </div>
                  <div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 900, color: 'var(--local-green)', letterSpacing: '-1px' }}>30min</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--local-text)', opacity: 0.6, letterSpacing: '1px' }}>AVG RESPONSE TIME</div>
                  </div>
              </div>
          </div>
          <div style={{ padding: '5rem', background: 'var(--local-navy)', borderRadius: '24px', position: 'relative', color: 'white' }}>
              <div style={{ position: 'absolute', top: '-1.5rem', left: '-1.5rem', width: '80px', height: '80px', background: 'var(--local-yellow)', borderRadius: '20px', zIndex: 0 }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.5px' }}>Are you a local expert?</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: '3rem', fontSize: '1.05rem', fontWeight: 500 }}>
                      Grow your business by joining the Pro Local network. Reach thousands of potential clients right in your neighborhood.
                  </p>
                  <button style={{ width: '100%', padding: '1.25rem', background: 'var(--local-green)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', transition: 'var(--local-transition)' }}>
                      Apply as a Pro
                  </button>
              </div>
          </div>
      </section>
    </div>
  );
}
