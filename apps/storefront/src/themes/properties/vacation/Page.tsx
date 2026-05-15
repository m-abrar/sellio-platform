
import React from 'react';
import { RetreatCard } from './components';

export default function Page() {
  const retreats = [
    { title: "Azure Bay Villa", location: "Amalfi Coast, Italy", price: "$1,200", rating: "4.95", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070" },
    { title: "Nordic Glass Cabin", location: "Lofoten, Norway", price: "$850", rating: "4.88", image: "https://images.unsplash.com/photo-1449156001437-3a16d1dfda70?q=80&w=2070" },
    { title: "Santorini Heights", location: "Oia, Greece", price: "$1,500", rating: "4.99", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2000" },
    { title: "Bamboo Zen Estate", location: "Bali, Indonesia", price: "$450", rating: "4.92", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000" },
    { title: "Alpine Chalet v2", price: "$980", location: "Zermatt, Switzerland", rating: "4.85", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2000" },
    { title: "Desert Mirror House", price: "$1,100", location: "Joshua Tree, USA", rating: "4.97", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2070" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="escape-hero">
          <div style={{ maxWidth: '900px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--vacay-accent)', letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '2rem', display: 'block' }}>GLOBAL_ESCAPE_REGISTRY</span>
              <h1>Find Your <br/>Infinite Horizon.</h1>
              <p style={{ fontSize: '1.25rem', color: '#64748b', lineHeight: 1.8, marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
                  A curated collection of the world's most significant vacation retreats. Authenticated by our local nodes, enjoyed by global travelers.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                  <button style={{ padding: '1.25rem 3.5rem', background: 'var(--vacay-primary)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 700 }}>EXPLORE_DESTINATIONS</button>
                  <button style={{ padding: '1.25rem 3.5rem', background: 'none', color: 'var(--vacay-primary)', border: '2px solid var(--vacay-primary)', borderRadius: '50px', fontWeight: 700 }}>LIST_YOUR_RETREAT</button>
              </div>
          </div>
      </section>

      {/* Trust bar */}
      <section style={{ padding: '3rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fef3c7', color: '#92400e', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px' }}>
          <span>100%_AUTHENTICATED_LISTINGS</span>
          <span>NO_HIDDEN_PROTOCOL_FEES</span>
          <span>24/7_LOCAL_NODE_SUPPORT</span>
          <span>CRYPTO_PAYMENT_ENABLED</span>
      </section>

      {/* Retreat Grid */}
      <section className="retreat-grid">
          {retreats.map((retreat, i) => (
              <RetreatCard key={i} {...retreat} />
          ))}
      </section>

      {/* Philosophy / Value Prop */}
      <section style={{ padding: '12rem 5%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'center', background: '#f8fafc' }}>
          <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', fontWeight: 900, marginBottom: '3rem' }}>The Art of the <br/>Escape.</h2>
              <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 2, marginBottom: '4rem' }}>
                  Every property in our vacation vertical is manually verified by a local node expert. We do not just check the amenities; we validate the vibe, the view, and the architectural integrity.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                  <div>
                      <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--vacay-primary)' }}>1,200+</div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '2px' }}>VERIFIED_VILLAS</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--vacay-primary)' }}>48h</div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '2px' }}>AVERAGE_RESPONSE</div>
                  </div>
              </div>
          </div>
          <div style={{ position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=2070" alt="Breezy Beach" style={{ width: '100%', borderRadius: '20px', boxShadow: '40px 40px 80px rgba(0,0,0,0.05)' }} />
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '10rem 5%', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', fontWeight: 900, marginBottom: '3rem' }}>Your Next Escape <br/>is One Click Away.</h2>
              <button style={{ padding: '1.5rem 5rem', background: 'var(--vacay-accent)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '2px', boxShadow: '0 10px 30px rgba(251, 113, 133, 0.3)' }}>
                  SECURE_YOUR_RETREAT
              </button>
          </div>
      </section>
    </div>
  );
}
