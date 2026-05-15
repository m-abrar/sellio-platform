'use client';
import React from 'react';
import { ExpertCard, CategoryCard } from './components';

export default function Page() {
  const experts = [
    { name: "Marcus Thorne", category: "LEGAL_ADVISORY", rating: "4.9", jobs: "124", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000" },
    { name: "Elena Rodriguez", category: "DIGITAL_STRATEGY", rating: "5.0", jobs: "89", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2000" },
    { name: "David Chen", category: "FINANCIAL_CONSULTING", rating: "4.8", jobs: "210", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2000" },
  ];

  const categories = [
    { icon: '⚖️', label: 'Legal' },
    { icon: '📈', label: 'Finance' },
    { icon: '💻', label: 'Tech' },
    { icon: '🎨', label: 'Design' },
    { icon: '🏥', label: 'Health' },
    { icon: '🛠️', label: 'Home' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="sm-hero">
        <div>
          <div className="sm-mono" style={{ marginBottom: '2rem' }}>PROJECT_NODE_AUTHORIZED</div>
          <h1 className="sm-heading-xl">
            Human Talent. <br/>
            <span style={{ color: 'var(--sm-clay)' }}>Engineered</span> for <br/>
            Results.
          </h1>
          <p style={{ marginTop: '3rem', fontSize: '1.25rem', color: 'var(--sm-text-muted)', lineHeight: 1.8, maxWidth: '500px' }}>
            Access a curated registry of high-fidelity professionals. Our bio-centric matching protocol ensures the perfect node for your next strategic project.
          </p>
          
          <div className="sm-search-container">
              <input type="text" className="sm-search-input" placeholder="Search for experts, services, or verticals..." />
              <button className="sm-btn-primary">SEARCH_TALENT</button>
          </div>
        </div>

        <div className="sm-hero-image-frame">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000" alt="Collaboration" />
          <div style={{ 
              position: 'absolute', 
              bottom: '4rem', 
              left: '4rem', 
              background: 'white', 
              padding: '2.5rem', 
              borderRadius: '32px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.1)'
          }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }}></div>
                  <div className="sm-mono" style={{ fontSize: '0.6rem' }}>842_EXPERTS_ONLINE</div>
              </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="sm-section">
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <div className="sm-mono">VERTICAL_DISTRIBUTION</div>
            <h2 style={{ fontFamily: 'var(--sm-font-heading)', fontSize: '4rem', fontWeight: 800, marginTop: '1.5rem' }}>Browse Verticals</h2>
        </div>
        
        <div className="sm-cat-grid">
          {categories.map((c, i) => (
            <CategoryCard key={i} {...c} />
          ))}
        </div>
      </section>

      {/* Featured Experts Section */}
      <section className="sm-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem' }}>
            <div>
                <div className="sm-mono">HIGH_FIDELITY_NODES</div>
                <h2 style={{ fontFamily: 'var(--sm-font-heading)', fontSize: '4rem', fontWeight: 800, marginTop: '1.5rem' }}>Featured Experts</h2>
            </div>
            <button className="sm-btn-primary" style={{ background: 'transparent', border: '1px solid var(--sm-forest)', color: 'var(--sm-forest)' }}>
                VIEW_ALL_TALENT
            </button>
        </div>

        <div className="sm-expert-grid">
          {experts.map((e, i) => (
            <ExpertCard key={i} {...e} />
          ))}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="sm-section" style={{ textAlign: 'center' }}>
          <div style={{ 
              background: 'var(--sm-sage)', 
              padding: '10rem 10%', 
              borderRadius: 'var(--sm-radius)',
              position: 'relative'
          }}>
              <div style={{ fontSize: '8rem', fontFamily: 'var(--sm-font-heading)', color: 'var(--sm-clay)', opacity: 0.2, position: 'absolute', top: '4rem', left: '50%', transform: 'translateX(-50%)' }}>“</div>
              <p style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--sm-font-heading)', lineHeight: 1.4, marginBottom: '4rem', position: 'relative', zIndex: 1 }}>
                  The quality of professionals on this platform is unmatched. We found a strategic team in under 24 hours.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div className="sm-mono">SARAH_JENKINS</div>
                  <div style={{ color: 'var(--sm-text-muted)', fontSize: '0.9rem' }}>FOUNDER @ MODERN_FLOW</div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section className="sm-section" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--sm-font-heading)', fontSize: '5rem', fontWeight: 800, letterSpacing: '-3px', marginBottom: '4rem' }}>
              Ready to Scale <br/>
              <span style={{ color: 'var(--sm-clay)' }}>Your Next Project?</span>
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 6rem', color: 'var(--sm-text-muted)', fontSize: '1.5rem', lineHeight: 1.6 }}>
              Join the world's most advanced service marketplace and connect with high-fidelity talent today.
          </p>
          <button className="sm-btn-primary" style={{ padding: '2.5rem 8rem', fontSize: '1.5rem' }}>
              AUTHORIZE_NEW_PROJECT
          </button>
      </section>
    </div>
  );
}
