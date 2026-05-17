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
    { name: "Anna J.", title: "Professional Designer", rating: "4.9", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400" },
    { name: "Mark T.", title: "24/7 Plumber Expert", rating: "4.7", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400" },
    { name: "Ben L.", title: "Advanced Math Tutor", rating: "5.0", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400" },
    { name: "Laura S.", title: "Certified Electrician", rating: "4.8", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400" }
  ];

  return (
    <div className="services-marketplace-theme">
      <MarketplaceHeader />

      {/* Hero Section */}
      <section className="sm-hero">
        <div className="sm-hero-content">
          <h1>Find Trusted Services Near You</h1>
          <p>Connecting you with skilled professionals, fast and reliably.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="sm-btn sm-btn-primary">Browse Services</button>
            <button className="sm-btn sm-btn-secondary">Become a Provider</button>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sm-filter-bar">
        <input type="search" placeholder="Search for services..." className="sm-filter-input" style={{ flex: 2 }} />
        <select className="sm-filter-select"><option>Category</option></select>
        <select className="sm-filter-select"><option>Location</option></select>
        <select className="sm-filter-select"><option>Price Range</option></select>
        <select className="sm-filter-select"><option>Ratings</option></select>
      </section>

      {/* Categories */}
      <section className="sm-section" style={{ paddingTop: '1rem' }}>
        <h2 className="sm-section-title">Popular Categories</h2>
        <div className="sm-category-grid">
          {categories.map((c, i) => (
            <SmCategoryCard key={i} {...c} />
          ))}
        </div>
      </section>

      {/* Providers */}
      <section className="sm-section">
        <h2 className="sm-section-title">Top Rated Professionals</h2>
        <div className="sm-provider-grid">
          {providers.map((p, i) => (
            <SmProviderCard key={i} {...p} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="sm-section">
        <h2 className="sm-section-title">How It Works</h2>
        <div className="sm-step-grid">
            <div>
                <div className="sm-step-icon">🔍</div>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>1. Search Services</h4>
                <p style={{ color: 'var(--sm-text-muted)' }}>Easily search through thousands of verified local professionals.</p>
            </div>
            <div style={{ fontSize: '2rem', color: 'var(--sm-border)' }}>➔</div>
            <div>
                <div className="sm-step-icon">👥</div>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>2. Compare Options</h4>
                <p style={{ color: 'var(--sm-text-muted)' }}>Read reviews, compare prices, and check provider portfolios.</p>
            </div>
            <div style={{ fontSize: '2rem', color: 'var(--sm-border)' }}>➔</div>
            <div>
                <div className="sm-step-icon">🔒</div>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>3. Hire Securely</h4>
                <p style={{ color: 'var(--sm-text-muted)' }}>Book and pay securely through our trusted platform.</p>
            </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="sm-section" style={{ background: 'white' }}>
        <h2 className="sm-section-title">What Our Clients Say</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--sm-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                "Hiring a plumber was seamless and fast! Mark T. fixed our leak within an hour. Highly recommend this platform for reliable services."
            </p>
            <p style={{ fontWeight: 700 }}>Client: John D. <span style={{ color: 'var(--sm-text-muted)', fontWeight: 400 }}>for Plumbing Repairs</span></p>
        </div>
      </section>

      {/* CTA */}
      <section className="sm-cta-section">
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to Hire or Offer Services?</h2>
        <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', color: 'rgba(255,255,255,0.9)' }}>
            Join our growing community today and connect with thousands of users.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="sm-btn sm-btn-primary">Find Services</button>
            <button className="sm-btn sm-btn-secondary">Offer Your Services</button>
        </div>
      </section>

      <MarketplaceFooter />
    </div>
  );
}
