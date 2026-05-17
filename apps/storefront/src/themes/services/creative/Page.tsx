'use client';
import React from 'react';
import { CrtvHeader, CrtvCategoryCard, CrtvCreativeCard, CrtvPortfolioItem, CrtvFooter } from './components';

export default function Page() {
  const categories = [
    { title: "Graphic Design", rate: "From $100", icon: "🎨" },
    { title: "Writing & Content", rate: "Copywriting, SEO", icon: "✍️" },
    { title: "Photography", rate: "Events, Products", icon: "📸" },
    { title: "Web Development", rate: "Full Stack, CMS", icon: "💻" },
    { title: "Music & Audio", rate: "Sound Design", icon: "🎵" },
    { title: "Marketing", rate: "Social Media", icon: "📈" }
  ];

  const creatives = [
    { name: "Sophia L.", title: "UX Designer", rating: "5.0", rate: "$50/hr", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400" },
    { name: "David P.", title: "Professional Photographer", rating: "4.8", rate: "$75/hr", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400" },
    { name: "Marco V.", title: "Senior Front-End Dev", rating: "4.9", rate: "$80/hr", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400" }
  ];

  const portfolios = [
    { title: "Modern UI Kit", category: "Graphic Design", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600" },
    { title: "Brand Identity", category: "Branding", image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=600" },
    { title: "Urban Photography", category: "Photography", image: "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=600" },
    { title: "SaaS Website", category: "UX/UI Design", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600" },
    { title: "Product Ad Copy", category: "Writing", image: "https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=600" },
    { title: "Mobile App Concept", category: "Development", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600" }
  ];

  return (
    <div className="services-creative-theme">
      <CrtvHeader />

      {/* Hero Section */}
      <section className="crtv-hero">
        <div className="crtv-hero-overlay"></div>
        <div className="crtv-hero-content">
          <h1>Hire Creative Talent Worldwide</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.9 }}>Discover exceptional freelancers for your projects, from design to development.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="crtv-btn crtv-btn-gradient" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Browse Creatives</button>
            <button className="crtv-btn crtv-btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Showcase Your Work</button>
          </div>
        </div>
      </section>

      {/* Search Filters */}
      <section className="crtv-search-bar">
        <input type="text" className="crtv-search-input" placeholder="Search for skills, creatives, or projects..." style={{ flex: 2 }} />
        <select className="crtv-select"><option>Category</option></select>
        <select className="crtv-select"><option>Budget</option></select>
        <select className="crtv-select"><option>Rating</option></select>
        <button className="crtv-btn" style={{ background: '#6c757d', color: 'white' }}>Filter</button>
      </section>

      {/* Categories */}
      <section className="crtv-section">
        <h2 className="crtv-section-title"><span className="gradient-text">Featured Creative Categories</span></h2>
        <div className="crtv-category-grid">
          {categories.map((c, i) => (
            <CrtvCategoryCard key={i} {...c} />
          ))}
        </div>
      </section>

      {/* Top Creatives */}
      <section className="crtv-section" style={{ background: 'white' }}>
        <h2 className="crtv-section-title">Meet Our <span className="gradient-text">Top Creatives</span></h2>
        <div className="crtv-creative-grid">
          {creatives.map((c, i) => (
            <CrtvCreativeCard key={i} {...c} />
          ))}
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section className="crtv-section">
        <h2 className="crtv-section-title"><span className="gradient-text">Inspiring Portfolio Showcase</span></h2>
        <div className="crtv-masonry">
          {portfolios.map((p, i) => (
            <CrtvPortfolioItem key={i} {...p} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="crtv-section" style={{ background: 'white' }}>
        <h2 className="crtv-section-title">Trusted by Clients & Creatives</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', background: 'var(--crtv-bg)', padding: '4rem', borderRadius: '1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }} className="gradient-text">"</div>
            <p style={{ fontSize: '1.25rem', fontStyle: 'italic', marginBottom: '2rem', lineHeight: 1.6 }}>
                "I found my dream design job here! The platform made it incredibly easy to showcase my UI/UX work and connect with top-tier clients globally. Highly recommended for any serious creative."
            </p>
            <p style={{ fontWeight: 800 }}>Josh T., Client <span style={{ color: 'var(--crtv-text)', fontWeight: 400, opacity: 0.7 }}>- Hired a UX Designer</span></p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="crtv-cta-banner">
        <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>Ready to Hire or Get Hired?</h2>
        <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.9 }}>Join the Creative Community Today and turn your vision into reality.</p>
        <button className="crtv-btn" style={{ background: 'white', color: '#121212', padding: '1.2rem 3rem', fontSize: '1.1rem' }}>Sign Up Now</button>
      </section>

      <CrtvFooter />
    </div>
  );
}
