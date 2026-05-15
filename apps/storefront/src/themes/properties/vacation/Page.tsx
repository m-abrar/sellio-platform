'use client';
import React from 'react';
import { RetreatBentoCard, ExperienceStats } from './components';

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
    <div className="pv-section">
      {/* Escape Hero */}
      <section className="pv-hero">
        <div className="pv-hero-tag">
          <div className="pv-mono" style={{ marginBottom: '2.5rem' }}>GLOBAL_ESCAPE_REGISTRY_V8</div>
          <h1 className="pv-heading-xl">
            Find Your <br/>
            Infinite <span className="pv-italic" style={{ color: 'var(--pv-azure)' }}>Horizon.</span>
          </h1>
        </div>
        <p style={{ marginTop: '5rem', fontSize: '1.5rem', color: 'var(--pv-text-muted)', lineHeight: 1.6, maxWidth: '700px', margin: '5rem auto' }}>
            A curated collection of the world's most significant vacation retreats. Authenticated by our local nodes, enjoyed by global travelers.
        </p>
        <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', marginTop: '6rem' }}>
          <button className="pv-btn-primary">Explore Destinations</button>
          <button style={{ 
              background: 'transparent', 
              border: '2px solid var(--pv-azure)', 
              color: 'var(--pv-azure)', 
              padding: '1.5rem 4.5rem', 
              borderRadius: '100px', 
              fontWeight: 800, 
              cursor: 'pointer' 
          }}>
              List Your Retreat
          </button>
        </div>
      </section>

      {/* Trust bar */}
      <div style={{ background: 'var(--pv-cloud)', padding: '4rem', borderRadius: '100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10rem 0' }}>
          {['100%_AUTHENTICATED', 'NO_PROTOCOL_FEES', 'LOCAL_NODE_SUPPORT', 'CRYPTO_SYNC_ENABLED'].map(trust => (
              <div key={trust} className="pv-mono" style={{ fontSize: '0.65rem', color: 'var(--pv-ink)', opacity: 0.6 }}>{trust}</div>
          ))}
      </div>

      {/* Retreat Grid */}
      <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="pv-mono" style={{ marginBottom: '1.5rem' }}>CURATED_COLLECTION</div>
                  <h2 style={{ fontFamily: 'var(--pv-font-serif)', fontSize: '5rem', fontWeight: 900, letterSpacing: '-2px' }}>The <span className="pv-italic">Retreats.</span></h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'var(--pv-text-muted)', lineHeight: 1.8 }}>
                  Every property in our vacation vertical is manually verified by a local node expert to validate the vibe and view.
              </div>
          </div>
          
          <div className="pv-retreat-grid">
            {retreats.map((r, i) => (
              <RetreatBentoCard key={i} {...r} />
            ))}
          </div>
      </section>

      {/* Philosophy / Value Prop */}
      <section style={{ marginTop: '20rem', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '12rem', alignItems: 'center' }}>
          <div>
              <div className="pv-mono" style={{ marginBottom: '2.5rem' }}>THE_GETAWAY_PROTOCOL</div>
              <h2 className="pv-heading-xl" style={{ fontSize: '5.5rem', marginBottom: '4rem' }}>The Art of <br/>the <span className="pv-italic">Escape.</span></h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--pv-text-muted)', lineHeight: 2, marginBottom: '6rem' }}>
                  We do not just check the amenities; we validate the architectural integrity and local significance of every vacation node.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem' }}>
                  <ExperienceStats value="1,200+" label="VERIFIED_NODES" />
                  <ExperienceStats value="48h" label="AVG_RESPONSE" />
              </div>
          </div>
          <div style={{ position: 'relative' }}>
              <div style={{ height: '800px', background: 'var(--pv-cloud)', borderRadius: 'var(--pv-radius)', overflow: 'hidden', padding: '2rem' }}>
                <img src="https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=2070" alt="Breezy Beach" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px' }} />
              </div>
              <div style={{ position: 'absolute', top: '-4rem', right: '-4rem', background: 'var(--pv-azure)', color: 'white', width: '250px', height: '250px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', fontWeight: 800, fontSize: '1.25rem' }}>
                  AUTHENTICATED_LOCAL_EXPERIENCE
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ marginTop: '20rem', padding: '15rem 0', textAlign: 'center', background: 'linear-gradient(to top, #f0f7ff, #fff)', borderRadius: 'var(--pv-radius) var(--pv-radius) 0 0', border: '1px solid var(--pv-border)' }}>
          <h2 style={{ fontFamily: 'var(--pv-font-serif)', fontSize: '6.5rem', fontWeight: 900, marginBottom: '5rem', letterSpacing: '-4px' }}>
              Your Next Escape <br/>
              is <span className="pv-italic" style={{ color: 'var(--pv-coral)' }}>One Click Away.</span>
          </h2>
          <button className="pv-btn-primary" style={{ padding: '2.5rem 8rem', fontSize: '1.5rem' }}>
              SECURE_YOUR_RETREAT
          </button>
      </section>
    </div>
  );
}
