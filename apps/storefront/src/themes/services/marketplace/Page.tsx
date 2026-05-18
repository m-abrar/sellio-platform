'use client';
import React from 'react';
import { MarketplaceHeader, SmCategoryCard, SmProviderCard, MarketplaceFooter } from './components';

export default function Page() {
  const categories = [
    { title: "Home Repair", icon: "🛠️" },
    { title: "Design", icon: "🎨" },
    { title: "Education", icon: "🎓" },
    { title: "Health", icon: "❤️" },
    { title: "Events", icon: "📅" },
    { title: "Tech Support", icon: "💻" }
  ];

  const providers = [
    { name: "Anna J.", title: "Professional Designer", rating: "4.9", image: "/themes/services/marketplace/15.webp" },
    { name: "Mark T.", title: "24/7 Plumber Expert", rating: "4.7", image: "/themes/services/marketplace/16.webp" },
    { name: "Ben L.", title: "Advanced Math Tutor", rating: "5.0", image: "/themes/services/marketplace/17.webp" },
    { name: "Laura S.", title: "Certified Electrician", rating: "4.8", image: "/themes/services/marketplace/18.webp" }
  ];

  return (
    <div className="services-marketplace-theme">
      <MarketplaceHeader />

      {/* Hero Section */}
      <section className="sm-hero" id="sm-hero-section" aria-labelledby="sm-hero-title">
        <div className="sm-hero-content">
          <h1 id="sm-hero-title">Find Trusted Services Near You</h1>
          <p>Connecting you with skilled professionals, fast and reliably.</p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '3rem' }}>
            <button 
              className="sm-btn sm-btn-primary"
              onClick={() => document.getElementById('sm-categories-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Browse Services
            </button>
            <button 
              className="sm-btn sm-btn-secondary"
              onClick={() => alert('Becoming a provider flow starting...')}
            >
              Become a Provider
            </button>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sm-filter-bar" aria-label="Search Filter Bar">
        <input type="search" placeholder="Search for services..." className="sm-filter-input" aria-label="Service Search Input" />
        <select className="sm-filter-select" aria-label="Category Select"><option>Category</option></select>
        <select className="sm-filter-select" aria-label="Location Select"><option>Location</option></select>
        <select className="sm-filter-select" aria-label="Price Select"><option>Price Range</option></select>
        <select className="sm-filter-select" aria-label="Rating Select"><option>Ratings</option></select>
        <button className="sm-btn sm-btn-primary" style={{ flex: 1, minWidth: '150px' }} onClick={() => alert('Searching providers...')}>Search</button>
      </section>

      {/* Categories */}
      <section className="sm-section" id="sm-categories-section" aria-labelledby="sm-categories-title" style={{ paddingTop: '2rem' }}>
        <h2 className="sm-section-title" id="sm-categories-title">Popular Categories</h2>
        <div className="sm-category-grid">
          {categories.map((c, i) => (
            <SmCategoryCard key={i} {...c} />
          ))}
        </div>
      </section>

      {/* Providers */}
      <section className="sm-section" id="sm-providers-section" aria-labelledby="sm-providers-title">
        <h2 className="sm-section-title" id="sm-providers-title">Top Rated Professionals</h2>
        <div className="sm-provider-grid">
          {providers.map((p, i) => (
            <SmProviderCard key={i} {...p} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="sm-section" id="sm-how-it-works" aria-labelledby="sm-how-title">
        <h2 className="sm-section-title" id="sm-how-title">How It Works</h2>
        <div className="sm-step-grid">
            <div className="sm-step-card">
                <div className="sm-step-icon">🔍</div>
                <h4 style={{ fontWeight: 800, marginBottom: '1rem', fontSize: '1.25rem' }}>1. Search Services</h4>
                <p style={{ color: 'var(--sm-text-muted)', lineHeight: 1.6 }}>Easily search through thousands of verified local professionals.</p>
            </div>
            <div className="sm-step-arrow" style={{ fontSize: '2.5rem', color: 'var(--sm-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➔</div>
            <div className="sm-step-card">
                <div className="sm-step-icon">👥</div>
                <h4 style={{ fontWeight: 800, marginBottom: '1rem', fontSize: '1.25rem' }}>2. Compare Options</h4>
                <p style={{ color: 'var(--sm-text-muted)', lineHeight: 1.6 }}>Read reviews, compare prices, and check provider portfolios.</p>
            </div>
            <div className="sm-step-arrow" style={{ fontSize: '2.5rem', color: 'var(--sm-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➔</div>
            <div className="sm-step-card">
                <div className="sm-step-icon">🔒</div>
                <h4 style={{ fontWeight: 800, marginBottom: '1rem', fontSize: '1.25rem' }}>3. Hire Securely</h4>
                <p style={{ color: 'var(--sm-text-muted)', lineHeight: 1.6 }}>Book and pay securely through our trusted platform.</p>
            </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="sm-section" id="sm-testimonials-section" style={{ background: 'white' }} aria-labelledby="sm-testimonials-title">
        <h2 className="sm-section-title" id="sm-testimonials-title">What Our Clients Say</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', background: 'var(--sm-surface)', padding: '4rem', borderRadius: '16px', border: '1px solid var(--sm-border)' }}>
            <p style={{ fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--sm-text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
                "Hiring a plumber was seamless and fast! Mark T. fixed our leak within an hour. Highly recommend this platform for reliable services."
            </p>
            <p style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--sm-primary)' }}>Client: John D. <span style={{ color: 'var(--sm-text-muted)', fontWeight: 400 }}>for Plumbing Repairs</span></p>
        </div>
      </section>

      {/* CTA */}
      <section className="sm-cta-section">
        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem' }}>Ready to Hire or Offer Services?</h2>
        <p style={{ fontSize: '1.25rem', marginBottom: '3.5rem', color: 'rgba(255,255,255,0.9)', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Join our growing community today and connect with thousands of users.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="sm-btn sm-btn-primary" onClick={() => document.getElementById('sm-categories-section')?.scrollIntoView({ behavior: 'smooth' })}>Find Services</button>
            <button className="sm-btn sm-btn-secondary" onClick={() => alert('Provider signup wizard opened.')}>Offer Your Services</button>
        </div>
      </section>

      <MarketplaceFooter />
    </div>
  );
}
