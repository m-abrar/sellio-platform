
'use client';
import React from 'react';
import { ExpertCard, CategoryCard, MarketplaceHeader, MarketplaceFooter } from './components';

export default function Page() {
  const experts = [
    { name: "Marcus Thorne", category: "Legal Strategy", rating: "4.9", jobs: "124", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000" },
    { name: "Elena Rodriguez", category: "Digital Growth", rating: "5.0", jobs: "89", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2000" },
    { name: "David Chen", category: "Financial Systems", rating: "4.8", jobs: "210", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2000" },
  ];

  const categories = [
    { icon: '⚖️', label: 'Legal Architecture' },
    { icon: '📈', label: 'Financial Strategy' },
    { icon: '💻', label: 'Software Engineering' },
    { icon: '🎨', label: 'Brand Experience' },
    { icon: '🏥', label: 'Health Innovation' },
    { icon: '🛠️', label: 'Infrastructure' },
  ];

  return (
    <div className="services-marketplace-theme">
      {/* High-Velocity Hero */}
      <section className="sm-hero">
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="sm-subheading" style={{ marginBottom: '2rem' }}>CURATED TALENT NETWORK</div>
          <h1 className="sm-heading-xl">
            The Global <br/>
            Engine for <br/>
            <span style={{ color: 'var(--sm-accent)' }}>Elite Talent.</span>
          </h1>
          <p style={{ marginTop: '3rem', fontSize: '1.25rem', color: 'var(--sm-text-dim)', lineHeight: 1.8, maxWidth: '550px', fontWeight: 300 }}>
            Access a vetted registry of world-class professionals. Our algorithmic matching ensures you find the perfect partner for your most critical projects.
          </p>
          
          <div className="sm-search-container">
              <input type="text" className="sm-search-input" placeholder="Search by skill, vertical, or location..." />
              <button className="sm-btn-primary">SEARCH HUB</button>
          </div>
        </div>

        <div className="sm-hero-image-frame" style={{ border: '1px solid var(--sm-border)', padding: '0.75rem', background: 'var(--sm-surface)' }}>
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000" alt="Talent Collaboration" style={{ opacity: 0.9 }} />
          <div style={{ 
              position: 'absolute', 
              bottom: '3rem', 
              left: '3rem', 
              background: 'var(--sm-accent)', 
              color: 'white',
              padding: '2rem 3rem', 
              borderRadius: '8px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
              fontWeight: 800,
              fontSize: '1.1rem'
          }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 10px #4ADE80' }}></div>
                  842 EXPERTS ONLINE
              </div>
          </div>
        </div>
      </section>

      {/* Talent Verticals */}
      <section className="sm-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem', flexWrap: 'wrap', gap: '3rem' }}>
            <div>
                <div className="sm-subheading" style={{ marginBottom: '1.5rem' }}>INDUSTRY VERTICALS</div>
                <h2 style={{ fontFamily: 'var(--sm-font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, letterSpacing: '-2px' }}>Explore Domains</h2>
            </div>
            <p style={{ maxWidth: '400px', color: 'var(--sm-text-dim)', fontSize: '1.1rem', fontWeight: 300, lineHeight: 1.6 }}>
                Our network spans across every major industrial vertical, providing specialized expertise at scale.
            </p>
        </div>
        
        <div className="sm-cat-grid">
          {categories.map((c, i) => (
            <CategoryCard key={i} {...c} />
          ))}
        </div>
      </section>

      {/* Verified Experts Section */}
      <section className="sm-section" style={{ borderTop: '1px solid var(--sm-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem', flexWrap: 'wrap', gap: '3rem' }}>
            <div>
                <div className="sm-subheading" style={{ marginBottom: '1.5rem' }}>VERIFIED PROFESSIONALS</div>
                <h2 style={{ fontFamily: 'var(--sm-font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, letterSpacing: '-2px' }}>Top-Tier Talent</h2>
            </div>
            <button style={{ background: 'transparent', border: '1px solid var(--sm-accent)', color: 'var(--sm-accent)', padding: '1.2rem 3rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '2px', cursor: 'pointer' }}>
                VIEW ALL EXPERTS
            </button>
        </div>

        <div className="sm-expert-grid">
          {experts.map((e, i) => (
            <ExpertCard key={i} {...e} />
          ))}
        </div>
      </section>

      {/* Testimonial Spotlight */}
      <section className="sm-section">
          <div style={{ 
              background: 'var(--sm-surface)', 
              padding: '12rem 10%', 
              borderRadius: 'var(--sm-radius)',
              position: 'relative',
              textAlign: 'center',
              border: '1px solid var(--sm-border)'
          }}>
              <div style={{ fontSize: '12rem', fontFamily: 'var(--sm-font-heading)', color: 'var(--sm-accent)', opacity: 0.1, position: 'absolute', top: '2rem', left: '50%', transform: 'translateX(-50%)' }}>“</div>
              <p style={{ fontSize: 'clamp(1.5rem, 4vw, 2.8rem)', fontWeight: 800, fontFamily: 'var(--sm-font-heading)', lineHeight: 1.3, marginBottom: '5rem', position: 'relative', zIndex: 1 }}>
                  The caliber of talent on the Sellio network is unprecedented. We scaled our engineering team within 48 hours.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', zIndex: 1 }}>
                  <div style={{ fontWeight: 800, color: 'white', letterSpacing: '2px', fontSize: '1.1rem' }}>SARAH JENKINS</div>
                  <div style={{ color: 'var(--sm-accent)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '3px' }}>CEO @ NEURAL_FLOW</div>
              </div>
          </div>
      </section>

      {/* Engagement CTA */}
      <section className="sm-section" style={{ textAlign: 'center', padding: '12rem 6%' }}>
          <h2 style={{ fontFamily: 'var(--sm-font-heading)', fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 900, letterSpacing: '-3px', marginBottom: '4rem' }}>
              Launch Your <br/>
              <span style={{ color: 'var(--sm-accent)' }}>Next Milestone.</span>
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 6rem', color: 'var(--sm-text-dim)', fontSize: '1.4rem', lineHeight: 1.6, fontWeight: 300 }}>
              Join the future of work and connect with the world's most capable independent professionals.
          </p>
          <button className="sm-btn-primary" style={{ padding: '2.5rem 10rem', fontSize: '1.2rem' }}>
              GET STARTED NOW
          </button>
      </section>
    </div>
  );
}
